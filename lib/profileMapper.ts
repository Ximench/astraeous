import type { ProfileData } from '../components/organisms/ProfileSection';

export function mapDbToProfileData(input: {
  username?: string | null;
  role?: string | null;
  status?: string | null;
}): ProfileData {
  return {
    username: input.username ?? 'Username',
    role: input.role ?? 'MIEMBRO',
    status: (String(input.status ?? 'ACTIVO').toUpperCase() === 'INACTIVO' ? 'INACTIVO' : 'ACTIVO') as any,
    rank: 'INVITADO',
    projects: null,
    commits: null,
    avatarUrl: (input as any).avatar_url ?? (input as any).avatarUrl ?? null,
  };
}
