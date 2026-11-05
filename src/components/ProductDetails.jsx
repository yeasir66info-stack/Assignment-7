'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { fetchProducts, toBn } from '@/lib/products';
import { buildMarkets } from '@/lib/markets';
import { ChangeBadge } from './ProductCard';


function getStats(product, markets = []) {
    const mins = markets.map((m) => m.min).filter((n) => typeof n === 'number');
    const maxs = markets.map((m) => m.max).filter((n) => typeof n === 'number');
    const avgs = markets.map((m) => m.avg).filter((n) => typeof n === 'number');

    const min = product?.min ?? (mins.length ? Math.min(...mins) : product?.price);
    const max = product?.max ?? (maxs.length ? Math.max(...maxs) : product?.price);
    const avg =
        product?.avg ??
        (avgs.length ? avgs.reduce((a, b) => a + b, 0) / avgs.length : product?.price);

    return { min, max, avg };
}

function formatNum(n) {
    if (typeof n !== 'number') return '—';
    return toBn(Number.isInteger(n) ? n : Number(n.toFixed(2)));
}


function Skeleton() {
    return (
        <div className="mx-auto max-w-5xl animate-pulse space-y-6 px-4 py-10">
            <div className="h-4 w-48 rounded bg-gray-200" />
            <div className="h-28 rounded-2xl bg-gray-200" />
            <div className="grid gap-4 sm:grid-cols-3">
                {[0, 1, 2].map((i) => (
                    <div key={i} className="h-24 rounded-2xl bg-gray-200" />
                ))}
            </div>
            <div className="h-72 rounded-2xl bg-gray-200" />
        </div>
    );
}

function StatCard({ label, value, hint, tone }) {
    const tones = {
        green: 'text-green-600',
        red: 'text-red-600',
        gray: 'text-gray-900',
    };
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <p className="text-xs text-gray-500">{label}</p>
            <p className={`mt-1 text-2xl font-extrabold ${tones[tone]}`}>
                {formatNum(value)} <span className="text-sm font-medium">টাকা</span>
            </p>
            <p className="mt-1 text-xs text-gray-400">{hint}</p>
        </div>
    );
}

export default function ProductDetails() {
    const { slug } = useParams();
    const [products, setProducts] = useState([]);
    const [status, setStatus] = useState('loading');
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        const controller = new AbortController();
        async function load() {
            setStatus('loading');
            try {
                const list = await fetchProducts(controller.signal);
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
    }, [reloadKey]);

    const product = useMemo(
        () => products.find((p) => p.slug === decodeURIComponent(slug ?? '')),
        [products, slug]
    );

    const markets = useMemo(() => {
        if (!product) return [];
        return product.markets?.length
            ? product.markets
            : buildMarkets(product.price, product.slug);
    }, [product]);

    const stats = useMemo(() => getStats(product, markets), [product, markets]);

    const categories = useMemo(() => {
        if (!product?.category) return [];
        return Array.isArray(product.category) ? product.category : [product.category];
    }, [product]);

    if (status === 'loading') return <Skeleton />;

    if (status === 'error') {
        return (
            <div className="mx-auto max-w-5xl px-4 py-10">
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
            </div>
        );
    }

    if (!product) {
        return (
            <div className="mx-auto max-w-5xl px-4 py-10">
                <div className="rounded-2xl border border-gray-200 bg-[#fafcfa] px-6 py-10 text-center">
                    <h2 className="text-lg font-bold text-gray-900">পণ্যটি পাওয়া যায়নি</h2>
                    <Link
                        href="/"
                        className="mt-4 inline-block rounded-lg bg-[#058a40] px-5 py-2 text-sm font-bold text-white hover:bg-[#047a38]"
                    >
                        সব পণ্য দেখুন
                    </Link>
                </div>
            </div>
        );
    }

    const diffText =
        typeof product.diff === 'number' && product.dir !== 'flat'
            ? `গতকালের তুলনায় আজ দাম ${product.dir === 'up' ? 'বেড়েছে' : 'কমেছে'} ${toBn(
                Math.abs(product.diff)
            )} টাকা`
            : product.description;

    return (
        <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">

            <nav aria-label="breadcrumb" className="text-xs text-gray-500">
                <Link href="/" className="hover:text-[#058a40]">হোম</Link>
                {categories[0] && (
                    <>
                        <span className="mx-1.5">›</span>
                        <span>{categories[0]}</span>
                    </>
                )}
                <span className="mx-1.5">›</span>
                <span className="text-gray-700">{product.name}</span>
            </nav>

            <section className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-3xl">
                        {product.emoji}
                    </span>
                    <div className="min-w-0">
                        <h1 className="text-2xl font-extrabold text-gray-900">{product.name}</h1>
                        {categories.length > 0 && (
                            <div className="mt-1.5 flex flex-wrap gap-1.5">
                                {categories.map((c) => (
                                    <span
                                        key={c}
                                        className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700"
                                    >
                                        {c}
                                    </span>
                                ))}
                            </div>
                        )}
                        {diffText && <p className="mt-2 text-sm text-gray-500">{diffText}</p>}
                    </div>
                </div>

                <div className="shrink-0 rounded-xl bg-[#fafcfa] px-6 py-3 text-center sm:min-w-[140px]">
                    <p className="text-xs text-gray-500">আজকের দাম</p>
                    <p className="mt-0.5 text-3xl font-extrabold text-gray-900">{formatNum(product.price)}</p>
                    <p className="text-xs text-gray-500">টাকা / প্রতি {product.unit}</p>
                    <div className="mt-2">
                        <ChangeBadge dir={product.dir} pct={product.pct} />
                    </div>
                </div>
            </section>

            <section>
                <h2 className="mb-3 text-lg font-extrabold text-gray-900">দামের সারসংক্ষেপ</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <StatCard label="সর্বনিম্ন দাম" value={stats.min} tone="green" hint="সবচেয়ে কম পাওয়া দাম" />
                    <StatCard label="সর্বোচ্চ দাম" value={stats.max} tone="red" hint="সবচেয়ে বেশি পাওয়া দাম" />
                    <StatCard
                        label="গড় দাম"
                        value={stats.avg}
                        tone="gray"
                        hint={`প্রতি ${product.unit} হিসাবে`}
                    />
                </div>
            </section>

            <section>
                <h2 className="mb-3 text-lg font-extrabold text-gray-900">বাজারভিত্তিক আজকের দাম</h2>

                {markets.length === 0 ? (
                    <p className="rounded-2xl border border-gray-200 bg-[#fafcfa] px-6 py-10 text-center text-sm text-gray-500">
                        এই পণ্যের বাজারভিত্তিক দাম এখনো পাওয়া যায়নি।
                    </p>
                ) : (
                    <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
                        <table className="w-full min-w-[560px] border-collapse text-sm">
                            <thead>
                                <tr className="bg-[#fafcfa] text-left text-xs text-gray-500">
                                    <th scope="col" className="px-4 py-3 font-semibold">বাজার</th>
                                    <th scope="col" className="px-4 py-3 font-semibold">বিভাগ</th>
                                    <th scope="col" className="px-4 py-3 text-right font-semibold">সর্বনিম্ন</th>
                                    <th scope="col" className="px-4 py-3 text-right font-semibold">সর্বোচ্চ</th>
                                    <th scope="col" className="px-4 py-3 text-right font-semibold">গড়</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {markets.map((m) => {
                                    const isLow = m.min === stats.min;
                                    const isHigh = m.max === stats.max;
                                    return (
                                        <tr key={m.name} className="hover:bg-[#fafcfa]">
                                            <th scope="row" className="px-4 py-3 text-left font-semibold text-gray-900">
                                                {m.name}
                                            </th>
                                            <td className="px-4 py-3 text-gray-600">{m.division}</td>
                                            <td
                                                className={`px-4 py-3 text-right ${isLow ? 'font-bold text-green-600' : 'text-gray-700'
                                                    }`}
                                            >
                                                {formatNum(m.min)} টাকা
                                            </td>
                                            <td
                                                className={`px-4 py-3 text-right ${isHigh ? 'font-bold text-red-600' : 'text-gray-700'
                                                    }`}
                                            >
                                                {formatNum(m.max)} টাকা
                                            </td>
                                            <td className="px-4 py-3 text-right font-bold text-gray-900">
                                                {formatNum(m.avg)} টাকা
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}