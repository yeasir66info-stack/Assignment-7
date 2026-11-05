const MARKETS = [
    { name: 'কারওয়ান বাজার', division: 'ঢাকা' },
    { name: 'মিরপুর ১ নম্বর বাজার', division: 'ঢাকা' },
    { name: 'কাজীর দেউড়ি বাজার', division: 'চট্টগ্রাম' },
    { name: 'সাহেব বাজার', division: 'রাজশাহী' },
    { name: 'দৌলতপুর বাজার', division: 'খুলনা' },
    { name: 'জিন্দাবাজার', division: 'সিলেট' },
    { name: 'রূপাতলী বাজার', division: 'বরিশাল' },
    { name: 'গঞ্জ বাজার', division: 'রংপুর' },
    { name: "চৌর বাজার", division: 'ময়মনসিংহ' },
    { name: "চৌরাস্তা বাজার", division: 'সিলেট' },
];

function seed(str) {
    let h = 0;
    for (const c of str) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    return h;
}

export function buildMarkets(price, slug) {
    const spread = Math.max(1, Math.round(price * 0.05));
    return MARKETS.map((m, i) => {
        const h = seed(`${slug}-${i}`);
        const min = Math.max(1, price - 1 - (h % (spread + 1)));
        const max = price + 1 + ((h >> 3) % (spread + 1));
        const avg = Math.round(((min + max) / 2) * 2) / 2;
        return { ...m, min, max, avg };
    });
}