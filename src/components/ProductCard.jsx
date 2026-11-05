import Link from 'next/link';
import { toBn } from '@/lib/products';

export function ChangeBadge({ dir, pct }) {
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

export function ProductCardSkeleton() {
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

export default function ProductCard({ product }) {
    return (
        <Link
            href={`/products/${product.slug}`}
            className="block rounded-2xl border border-gray-200 bg-[#fafcfa] p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#058a40]"
        >
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
        </Link>
    );
}