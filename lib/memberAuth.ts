import { supabase } from './supabase';

export type MemberRecord = {
  id: string;
  email: string | null;
  profile_id: string | null;
  profile_photo_url: string | null;
  status: 'activo' | 'offline';
  is_active: boolean;
};

type LoginResult =
  | { ok: true; member: MemberRecord }
  | { ok: false; reason: 'not_found' | 'inactive' | 'bad_password' };

function buildEmailCandidates(input: string) {
  const raw = input.trim().toLowerCase();
  if (!raw) return [] as string[];
  if (raw.includes('@')) return [raw];
  // Allows nickname-only login even if DB uses nickname@astraeous.com
  return [raw, `${raw}@astraeous.com`];
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
    const lookupUrl = `${baseUrl}/rest/v1/members?select=id,email,profile_id,profile_photo_url,status,is_active&email=eq.${encodeURIComponent(
      email
    )}&limit=1`;

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
        .select('id,email,profile_id,profile_photo_url,status,is_active')
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
  return data;
}
