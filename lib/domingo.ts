export type DomingoHero = {
  name: string;
  image: string;
};

const RAW_DATA_URL =
  process.env.NEXT_PUBLIC_DOMINGO_DATA_URL ||
  "https://raw.githubusercontent.com/shamansuryavamshi/MyBusiness/master/domingo-data.json";

export async function fetchDomingoHero(): Promise<DomingoHero | null> {
  try {
    const res = await fetch(RAW_DATA_URL, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || !data.hero) return null;
    return {
      name: String(data.hero.name || ""),
      image: String(data.hero.image || ""),
    };
  } catch {
    return null;
  }
}