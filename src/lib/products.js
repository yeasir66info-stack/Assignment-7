export const API = process.env.NEXT_PUBLIC_API_URL;
const UNITS = { kg: 'কেজি', litre: 'লিটার', dozen: 'ডজন', piece: 'পিস' };
export const toBn = (n) => Number(n).toLocaleString('bn-BD');

export const normalizeProduct = (p) => ({
    id: p.id,
    slug: p.slug,
    name: p.nameBn,
    emoji: p.image ?? p.categoryIcon ?? '🛒',
    unit: UNITS[p.unit] ?? p.unit,
    price: Number(p.today),
    dir: p.change?.dir ?? 'flat',
    pct: Math.abs(Number(p.change?.pct ?? 0)),
});

export async function fetchProducts(signal) {
    if (!API) throw new Error('NEXT_PUBLIC_API_URL');
    const res = await fetch(`${API}/products`, { signal });
    if (!res.ok) throw new Error('products load hoyni');
    const data = await res.json();
    return (Array.isArray(data) ? data : []).map(normalizeProduct);
}