export const customFetch = async (url: string, options?: any) => {
  const res = await fetch(url);

  if (!res?.ok) {
    throw new Error("Failed to fetch data!");
  }

  return res.json();
};
