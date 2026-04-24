import type { ProfileData } from '../components/organisms/ProfileSection';

function normalizeRank(role?: string | null): ProfileData['rank'] {
  const normalized = String(role ?? '').trim().toUpperCase();

  if (!normalized || normalized === 'INVITADO') return 'INVITADO';
  if (normalized.includes('FUNDADOR')) return 'FUNDADOR';
  if (normalized.includes('COMPOSITOR')) return 'COMPOSITOR';
  if (normalized.includes('QA')) return 'QA';
  if (normalized.includes('ARTISTA')) return 'ARTISTA';

  return 'INVITADO';
}

export function mapDbToProfileData(input: {
  username?: string | null;
  role?: string | null;
  status?: string | null;
}): ProfileData {
  return {
    username: input.username ?? 'Username',
    role: input.role ?? 'MIEMBRO',
    status: (String(input.status ?? 'ACTIVO').toUpperCase() === 'INACTIVO' ? 'INACTIVO' : 'ACTIVO') as any,
    rank: normalizeRank(input.role),
    projects: null,
    commits: null,
    avatarUrl: (input as any).avatar_url ?? (input as any).avatarUrl ?? null,
  };
}
