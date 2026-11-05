'use client';
import React, { useEffect, useState } from 'react';
const API = process.env.NEXT_PUBLIC_API_URL;
const UNITS = { kg: 'কেজি', litre: 'লিটার', dozen: 'ডজন', piece: 'পিস' };

const toBn = (n) => Number(n).toLocaleString('bn-BD');

const normalizeItem = (p) => ({
    id: p.id,
    emoji: p.categoryIcon ?? p.image ?? '🛒',
    name: p.nameBn,
    price: Number(p.today),
    unit: UNITS[p.unit] ?? p.unit,
    dir: p.change?.dir ?? 'flat', 
    pct: Math.abs(Number(p.change?.pct ?? 0)),
});

function ChangeText({ dir, pct }) {
    if (dir === 'up') {
        return <span className="text-xs font-semibold text-red-600">▲ {toBn(pct)}%</span>;
    }
    if (dir === 'down') {
        return <span className="text-xs font-semibold text-green-600">▼ {toBn(pct)}%</span>;
    }
    return <span className="text-xs font-semibold text-gray-500">— ০.০%</span>;
}

function TickerItem({ item }) {
    return (
        <div className="flex shrink-0 items-center gap-2 px-6 text-sm text-gray-800">
            <span aria-hidden="true">{item.emoji}</span>
            <span className="font-medium">{item.name}</span>
            <span className="text-gray-700">
                {toBn(item.price)} টাকা/{item.unit}
            </span>
            <ChangeText dir={item.dir} pct={item.pct} />
        </div>
    );
}

export default function PriceTicker() {
    const [items, setItems] = useState([]);
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        const controller = new AbortController();

        async function load() {
            try {
                if (!API) throw new Error('NEXT_PUBLIC_API_URL');

                const res = await fetch(`${API}/products`, { signal: controller.signal });
                if (!res.ok) throw new Error('products load hoyni');

                const data = await res.json();
                setItems((Array.isArray(data) ? data : []).map(normalizeItem));
                setStatus('ready');
            } catch (err) {
                if (err.name === 'AbortError') return;
                console.error(err);
                setStatus('error');
            }
        }

        load();
        return () => controller.abort();
    }, []);

    if (status === 'error' || (status === 'ready' && items.length === 0)) return null;

    if (status === 'loading') {
        return (
            <div className="border-y border-gray-200 bg-[#f6f9f6] py-2.5">
                <div className="mx-auto h-5 w-2/3 animate-pulse rounded bg-gray-200" />
            </div>
        );
    }

    return (
        <div className="ticker overflow-hidden border-y border-gray-200 bg-[#f6f9f6] py-2.5">
            <div className="ticker-track" style={{ animationDuration: `${items.length * 4}s` }}>
                {[...items, ...items].map((item, i) => (
                    <TickerItem key={`${item.id}-${i}`} item={item} />
                ))}
            </div>
        </div>
    );
}