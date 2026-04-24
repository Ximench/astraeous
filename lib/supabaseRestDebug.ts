export async function restSelect(path: string, apiKey: string) {
  const url = `https://kblvpallwaonsbuoeprx.supabase.co/rest/v1/${path}`;
  const res = await fetch(url, {
    headers: {
      apikey: apiKey,
      Authorization: `Bearer ${apiKey}`,
    },
  });
  const text = await res.text();
  return { status: res.status, text };
}
