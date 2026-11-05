'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL;

const UNITS = { kg: 'কেজি', litre: 'লিটার', dozen: 'ডজন', piece: 'পিস' };

const normalizeProduct = (p) => ({
    id: p.id,
    name: p.nameBn,
    emoji: p.image ?? p.categoryIcon ?? '🛒',
    unit: UNITS[p.unit] ?? p.unit,
    price: Number(p.today),
    dir: p.change?.dir ?? 'flat', 
    pct: Math.abs(Number(p.change?.pct ?? 0)),
});

const SORTS = [
    { value: 'default', label: 'ডিফল্ট' },
    { value: 'asc', label: 'দাম: কম থেকে বেশি' },
    { value: 'desc', label: 'দাম: বেশি থেকে কম' },
];

const toBn = (n) => Number(n).toLocaleString('bn-BD');

function ChangeBadge({ dir, pct }) {
    if (dir === 'up') {
        return (
            <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
                ▲ {toBn(pct)}%
            </span>
        );
    }
    if (dir === 'down') {
        return (
            <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-600">
                ▼ {toBn(pct)}%
            </span>
        );
    }
    return (
        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
            — ০.০%
        </span>
    );
}

function ProductCard({ product }) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-[#fafcfa] p-4 shadow-sm">
            <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-2xl">
                    {product.emoji}
                </span>
                <div className="min-w-0">
                    <h3 className="truncate text-base font-bold text-gray-900">{product.name}</h3>
                    <p className="text-xs text-gray-500">প্রতি {product.unit}</p>
                </div>
            </div>

            <p className="mt-4 text-xs text-gray-500">আজকের দাম</p>
            <div className="mt-1 flex items-center justify-between">
                <p className="text-lg font-extrabold text-gray-900">
                    {toBn(product.price)} <span className="text-sm font-medium">টাকা</span>
                </p>
                <ChangeBadge dir={product.dir} pct={product.pct} />
            </div>
        </div>
    );
}

function SkeletonCard() {
    return (
        <div className="animate-pulse rounded-2xl border border-gray-200 bg-[#fafcfa] p-4">
            <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-gray-200" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 w-2/3 rounded bg-gray-200" />
                    <div className="h-3 w-1/3 rounded bg-gray-200" />
                </div>
            </div>
            <div className="mt-4 h-3 w-1/4 rounded bg-gray-200" />
            <div className="mt-2 flex items-center justify-between">
                <div className="h-5 w-1/3 rounded bg-gray-200" />
                <div className="h-6 w-16 rounded-full bg-gray-200" />
            </div>
        </div>
    );
}

function EmptyState({ title, text }) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-[#fafcfa] px-6 py-14 text-center shadow-sm">
            <p className="text-5xl font-extrabold text-[#058a40]">৪০৪</p>
            <h2 className="mt-3 text-xl font-bold text-gray-900">{title}</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">{text}</p>
            <Link
                href="/"
                className="mt-6 inline-block rounded-lg bg-[#058a40] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#047a38]"
            >
                হোম পেজে ফিরে যান
            </Link>
        </div>
    );
}

export default function CategoryPage() {
    const { slug } = useParams();

    const [status, setStatus] = useState('loading');
    const [category, setCategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [sort, setSort] = useState('default');
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        const controller = new AbortController();

        async function load() {
            setStatus('loading');
            setSort('default');
            try {
                if (!API) throw new Error('NEXT_PUBLIC_API_URL set kora nai');

                const [catRes, prodRes] = await Promise.all([
                    fetch(`${API}/categories/${encodeURIComponent(slug)}`, { signal: controller.signal }),
                    fetch(`${API}/products`, { signal: controller.signal }),
                ]);

                if (catRes.status === 404) {
                    setCategory(null);
                    setProducts([]);
                    setStatus('notfound');
                    return;
                }
                if (!catRes.ok) throw new Error('category load hoyni');

                const cat = await catRes.json();
                if (!cat || !cat.slug) {
                    setCategory(null);
                    setProducts([]);
                    setStatus('notfound');
                    return;
                }
                setCategory(cat);

                if (!prodRes.ok) throw new Error('products load hoyni');
                const all = await prodRes.json();

                const list = (Array.isArray(all) ? all : [])
                    .filter((p) => p.category === slug)
                    .map(normalizeProduct);

                setProducts(list);
                setStatus('ready');
            } catch (err) {
                if (err.name === 'AbortError') return;
                console.error(err);
                setStatus('error');
            }
        }

        load();
        return () => controller.abort();
    }, [slug, reloadKey]);

    const sortedProducts = useMemo(() => {
        const list = [...products];
        if (sort === 'asc') list.sort((a, b) => a.price - b.price);
        if (sort === 'desc') list.sort((a, b) => b.price - a.price);
        return list;
    }, [products, sort]);

    return (
        <div className="min-h-[70vh] bg-[#f0f5f0] py-8">
            <div className="mx-auto max-w-6xl space-y-5 px-4">
                {status === 'notfound' && (
                    <EmptyState
                        title="ক্যাটাগরি পাওয়া যায়নি"
                        text="আপনি যে ক্যাটাগরিটি খুঁজছেন সেটি নেই বা সরিয়ে ফেলা হয়েছে।"
                    />
                )}

                {status === 'error' && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center">
                        <h2 className="text-lg font-bold text-red-700">তথ্য লোড করা যায়নি</h2>
                        <p className="mt-1 text-sm text-red-600">ইন্টারনেট সংযোগ দেখে আবার চেষ্টা করুন।</p>
                        <button
                            type="button"
                            onClick={() => setReloadKey((k) => k + 1)}
                            className="mt-4 cursor-pointer rounded-lg bg-[#058a40] px-5 py-2 text-sm font-bold text-white hover:bg-[#047a38]"
                        >
                            আবার চেষ্টা করুন
                        </button>
                    </div>
                )}

                {status === 'loading' && (
                    <>
                        <div className="h-24 animate-pulse rounded-2xl border border-gray-200 bg-[#fafcfa]" />
                        <div className="h-16 animate-pulse rounded-2xl border border-gray-200 bg-[#fafcfa]" />
                        <p className="text-sm text-gray-500">লোড হচ্ছে...</p>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <SkeletonCard key={i} />
                            ))}
                        </div>
                    </>
                )}

                {status === 'ready' && category && (
                    <>
                        {/* Title + icon */}
                        <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-[#fafcfa] p-5 shadow-sm">
                            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-3xl">
                                {category.icon}
                            </span>
                            <div>
                                <h1 className="text-2xl font-extrabold text-gray-900">{category.nameBn}</h1>
                                <p className="text-sm text-gray-500">
                                    {toBn(products.length)}টি পণ্যের আজকের দাম ও পরিবর্তন
                                </p>
                            </div>
                        </div>

                        {products.length === 0 ? (
                            <EmptyState
                                title="কোনো পণ্য পাওয়া যায়নি"
                                text="এই ক্যাটাগরিতে এখনো কোনো পণ্যের দাম যোগ করা হয়নি।"
                            />
                        ) : (
                            <>
                                <div className="flex items-center justify-end gap-2 rounded-2xl border border-gray-200 bg-[#fafcfa] p-4 shadow-sm">
                                    <label htmlFor="sort" className="text-sm text-gray-600">
                                        সাজান:
                                    </label>
                                    <select
                                        id="sort"
                                        value={sort}
                                        onChange={(e) => setSort(e.target.value)}
                                        className="cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-800 outline-none focus:border-[#058a40] focus:ring-2 focus:ring-[#058a40]/20"
                                    >
                                        {SORTS.map((s) => (
                                            <option key={s.value} value={s.value}>
                                                {s.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <p className="text-sm text-gray-600">
                                    মোট {toBn(sortedProducts.length)}টি পণ্য দেখানো হচ্ছে
                                </p>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {sortedProducts.map((p) => (
                                        <ProductCard key={p.id} product={p} />
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}