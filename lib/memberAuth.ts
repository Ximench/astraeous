import { supabase } from './supabase';

export type MemberRecord = {
  id: string;
  email: string | null;
  profile_id: string | null;
  profile_photo_url: string | null;
  status: 'activo' | 'offline';
  is_active: boolean;
};

export async function memberLogin(payload: { usernameOrEmail: string; password: string }) {
  // The UI calls it "username", but the DB uses email.
  const email = payload.usernameOrEmail.trim().toLowerCase();

  // TEST ONLY: compare hashes/strings stored in password_hash.
  // For now we treat the entered password as the stored value.
  const { data, error } = await supabase
    .from('members')
    .select('id,email,profile_id,profile_photo_url,status,is_active,password_hash')
    .eq('email', email)
    .maybeSingle();

  if (error) throw error;
  if (!data) return { ok: false as const, reason: 'not_found' as const };
  if (!data.is_active) return { ok: false as const, reason: 'inactive' as const };

  const matches = (data as any).password_hash === payload.password;
  if (!matches) return { ok: false as const, reason: 'bad_password' as const };

  const member: MemberRecord = {
    id: data.id,
    email: data.email,
    profile_id: data.profile_id,
    profile_photo_url: data.profile_photo_url,
    status: (data.status ?? 'offline') as 'activo' | 'offline',
    is_active: data.is_active,
  };

  return { ok: true as const, member };
}

export async function fetchProfileById(profileId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id,username,display_name,bio,avatar_url,role,location,website')
    .eq('id', profileId)
    .single();
  if (error) throw error;
  return data;
}
