import { supabase } from './supabase';

export type MemberRecord = {
  id: string;
  email: string | null;
  profile_id: string | null;
  profile_photo_url: string | null;
  status: 'activo' | 'offline';
  is_active: boolean;
};

export type StoredMemberSession = {
  memberId: string;
  email?: string | null;
  profileId?: string | null;
  profilePhotoUrl?: string | null;
  status?: 'activo' | 'offline';
};

export type ProfileRecord = {
  id: string;
  username: string | null;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  avatar_blob?: string | null;
  avatar_mime_type?: string | null;
  role: string | null;
  location: string | null;
  website: string | null;
};

export type MemberProfileUpdateInput = {
  memberId: string;
  profileId?: string | null;
  username: string;
  status: 'ACTIVO' | 'INACTIVO';
  avatarUrl?: string | null;
  avatarBlobBase64?: string | null;
  avatarMimeType?: string | null;
  role?: string | null;
  bio?: string | null;
  displayName?: string | null;
};

export type MemberProfileUpdateResult = {
  member: MemberRecord;
  profile: ProfileRecord;
};

type LoginResult =
  | { ok: true; member: MemberRecord }
  | { ok: false; reason: 'not_found' | 'inactive' | 'bad_password' };

const MEMBER_SELECT_COLUMNS = 'id,email,profile_id,profile_photo_url,status,is_active';

function buildEmailCandidates(input: string) {
  const raw = input.trim().toLowerCase();
  if (!raw) return [] as string[];
  if (raw.includes('@')) return [raw];
  // Allows nickname-only login even if DB uses nickname@astraeous.com
  return [raw, `${raw}@astraeous.com`];
}

function buildProfileUsernameCandidates(input: string) {
  const raw = input.trim().toLowerCase();
  if (!raw) return [] as string[];
  return raw.includes('@') ? [raw.split('@')[0]] : [raw];
}

async function resolveProfileForEmail(email: string) {
  const candidates = buildProfileUsernameCandidates(email);

  for (const username of candidates) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id,username,display_name,bio,avatar_url,role,location,website')
      .or(`username.eq.${username},display_name.eq.${username}`)
      .maybeSingle();

    if (error) throw error;
    if (data) return data as ProfileRecord;
  }

  return null;
}

async function backfillMemberProfileLink(memberId: string, profileId: string) {
  const { error } = await supabase
    .from('members')
    .update({ profile_id: profileId })
    .eq('id', memberId);

  if (error) throw error;
}

async function memberLoginViaRest(payload: { usernameOrEmail: string; password: string }): Promise<LoginResult> {
  const apiKey =
    process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const baseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;

  if (!apiKey || !baseUrl) {
    throw new Error('Faltan env vars de Supabase.');
  }

  const candidates = buildEmailCandidates(payload.usernameOrEmail);
  for (const email of candidates) {
    const lookupUrl = `${baseUrl}/rest/v1/members?select=${encodeURIComponent(MEMBER_SELECT_COLUMNS)}&email=eq.${encodeURIComponent(email)}&limit=1`;

    const lookupRes = await fetch(lookupUrl, {
      headers: {
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!lookupRes.ok) {
      const body = await lookupRes.text();
      throw new Error(`Supabase REST error (${lookupRes.status}): ${body}`);
    }

    const rows = (await lookupRes.json()) as any[];
    const data = rows?.[0];
    if (!data) continue;

    if (!data.is_active) return { ok: false, reason: 'inactive' };

    const verifyRes = await fetch(`${baseUrl}/rest/v1/rpc/verify_member_login`, {
      method: 'POST',
      headers: {
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        p_email: email,
        p_password_hash: payload.password,
      }),
    });

    if (!verifyRes.ok) {
      const body = await verifyRes.text();
      throw new Error(`Supabase REST error (${verifyRes.status}): ${body}`);
    }

    const verifiedMemberId = await verifyRes.json();
    if (!verifiedMemberId) return { ok: false, reason: 'bad_password' };

    return {
      ok: true,
      member: {
        id: data.id,
        email: data.email,
        profile_id: data.profile_id,
        profile_photo_url: data.profile_photo_url,
        status: (data.status ?? 'offline') as 'activo' | 'offline',
        is_active: data.is_active,
      },
    };
  }

  return { ok: false, reason: 'not_found' };
}

export async function memberLogin(payload: { usernameOrEmail: string; password: string }): Promise<LoginResult> {
  const candidates = buildEmailCandidates(payload.usernameOrEmail);

  // First try supabase-js
  try {
    for (const email of candidates) {
      const { data, error } = await supabase
        .from('members')
        .select(MEMBER_SELECT_COLUMNS)
        .eq('email', email)
        .maybeSingle();

      if (error) throw error;
      if (!data) continue;
      if (!data.is_active) return { ok: false, reason: 'inactive' };

      const { data: verifiedMemberId, error: verifyError } = await supabase.rpc('verify_member_login', {
        p_email: email,
        p_password_hash: payload.password,
      });

      if (verifyError) throw verifyError;
      if (!verifiedMemberId) return { ok: false, reason: 'bad_password' };

      let resolvedProfileId = data.profile_id;
      if (!resolvedProfileId) {
        const resolvedProfile = await resolveProfileForEmail(email);
        if (resolvedProfile) {
          resolvedProfileId = resolvedProfile.id;
          await backfillMemberProfileLink(data.id, resolvedProfileId);
        }
      }

      return {
        ok: true,
        member: {
          id: data.id,
          email: data.email,
          profile_id: resolvedProfileId,
          profile_photo_url: data.profile_photo_url,
          status: (data.status ?? 'offline') as 'activo' | 'offline',
          is_active: data.is_active,
        },
      };
    }

    return { ok: false, reason: 'not_found' };
  } catch {
    // Fallback to REST in case supabase-js is misbehaving in this runtime
    return memberLoginViaRest(payload);
  }
}

export async function fetchProfileById(profileId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id,username,display_name,bio,avatar_url,role,location,website')
    .eq('id', profileId)
    .maybeSingle();
  if (error) throw error;
  return data as ProfileRecord | null;
}

export async function fetchMemberById(memberId: string) {
  const { data, error } = await supabase
    .from('members')
    .select(MEMBER_SELECT_COLUMNS)
    .eq('id', memberId)
    .maybeSingle();

  if (error) throw error;
  return data as MemberRecord | null;
}

export async function refreshStoredMemberSession(session: StoredMemberSession) {
  const member = await fetchMemberById(session.memberId);
  if (!member || !member.is_active) return null;

  let profileId = member.profile_id ?? session.profileId ?? null;
  if (!profileId && member.email) {
    const resolvedProfile = await resolveProfileForEmail(member.email);
    if (resolvedProfile) {
      profileId = resolvedProfile.id;
      await backfillMemberProfileLink(member.id, profileId);
    }
  }

  return {
    memberId: member.id,
    email: member.email ?? session.email ?? null,
    profileId,
    profilePhotoUrl: member.profile_photo_url ?? session.profilePhotoUrl ?? null,
    status: member.status,
  } satisfies StoredMemberSession;
}

function buildProfilePayload(input: MemberProfileUpdateInput, fallbackRole?: string | null) {
  const payload: Record<string, unknown> = {
    username: input.username,
    display_name: input.displayName ?? input.username,
    bio: input.bio ?? null,
    avatar_url: input.avatarUrl ?? null,
  };

  const role = input.role ?? fallbackRole;
  if (role !== undefined && role !== null) {
    payload.role = role;
  }

  return payload;
}

export async function updateMemberProfile(input: MemberProfileUpdateInput): Promise<MemberProfileUpdateResult> {
  const normalizedUsername = input.username.trim() || 'Miembro';
  const normalizedStatus = input.status === 'ACTIVO' ? 'activo' : 'offline';
  const hasAvatarBlob = Boolean(input.avatarBlobBase64?.trim());

  let profileId = input.profileId ?? null;
  let profileRecord: ProfileRecord | null = null;

  if (profileId) {
    const { data: currentProfile, error: currentProfileError } = await supabase
      .from('profiles')
      .select('id,username,display_name,bio,avatar_url,role,location,website')
      .eq('id', profileId)
      .maybeSingle();

    if (currentProfileError) throw currentProfileError;

    const { data, error } = await supabase
      .from('profiles')
      .upsert(
        {
          id: profileId,
          ...buildProfilePayload(input, currentProfile?.role ?? null),
        },
        { onConflict: 'id' }
      )
      .select('id,username,display_name,bio,avatar_url,role,location,website')
      .maybeSingle();

    if (error) throw error;
    profileRecord = (data ?? currentProfile) as ProfileRecord | null;
  } else {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        ...buildProfilePayload(input, input.role ?? 'MIEMBRO'),
      })
      .select('id,username,display_name,bio,avatar_url,role,location,website')
      .maybeSingle();

    if (error) throw error;
    profileRecord = data as ProfileRecord | null;
    profileId = profileRecord?.id ?? null;
  }

  if (!profileRecord) {
    throw new Error('No se pudo guardar el perfil.');
  }

  if (hasAvatarBlob && profileId) {
    const { data: avatarData, error: avatarError } = await supabase.rpc('save_profile_avatar_blob', {
      p_member_id: input.memberId,
      p_profile_id: profileId,
      p_avatar_base64: input.avatarBlobBase64,
      p_mime_type: input.avatarMimeType ?? 'image/jpeg',
    });

    if (avatarError) throw avatarError;

    const avatarRow = Array.isArray(avatarData) ? avatarData[0] : avatarData;
    if (avatarRow?.avatar_url) {
      profileRecord = {
        ...profileRecord,
        avatar_url: avatarRow.avatar_url,
        avatar_mime_type: avatarRow.avatar_mime_type ?? input.avatarMimeType ?? 'image/jpeg',
      };
    }
  }

  const { data: memberData, error: memberError } = await supabase
    .from('members')
    .update({
      status: normalizedStatus,
      profile_id: profileId,
      profile_photo_url: profileRecord.avatar_url ?? input.avatarUrl ?? null,
    })
    .eq('id', input.memberId)
    .select(MEMBER_SELECT_COLUMNS)
    .maybeSingle();

  if (memberError) throw memberError;
  if (!memberData) throw new Error('No se pudo actualizar la sesión del miembro.');

  return {
    member: memberData as MemberRecord,
    profile: profileRecord,
  };
}
