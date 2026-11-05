'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { fetchProducts } from '@/lib/products';
import ProductCard, { ProductCardSkeleton } from './ProductCard';

function SectionTitle({ icon, iconClass, title, subtitle }) {
    return (
        <div className="mb-4">
            <h2 className="flex items-center gap-2 text-xl font-extrabold text-gray-900">
                {icon && <span className={`text-base ${iconClass}`}>{icon}</span>}
                {title}
            </h2>
            {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
    );
}

function Grid({ children, wide = false }) {
    return (
        <div
            className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 ${wide ? 'xl:grid-cols-4' : ''
                }`}
        >
            {children}
        </div>
    );
}

function SkeletonSection({ withTitle = true }) {
    return (
        <section>
            {withTitle && <div className="mb-4 h-6 w-48 animate-pulse rounded bg-gray-200" />}
            <Grid>
                {Array.from({ length: 6 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                ))}
            </Grid>
        </section>
    );
}

export default function ProductSections() {
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

    const risers = useMemo(
        () =>
            products
                .filter((p) => p.dir === 'up')
                .sort((a, b) => b.pct - a.pct)
                .slice(0, 6),
        [products]
    );

    const fallers = useMemo(
        () =>
            products
                .filter((p) => p.dir === 'down')
                .sort((a, b) => b.pct - a.pct)
                .slice(0, 6),
        [products]
    );

    return (
        <div className="mx-auto max-w-6xl space-y-10 px-4 py-10">
            {status === 'loading' && (
                <>
                    <SkeletonSection />
                    <SkeletonSection />
                    <SkeletonSection />
                </>
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

            {status === 'ready' && (
                <>
                    {risers.length > 0 && (
                        <section>
                            <SectionTitle icon="▲" iconClass="text-red-600" title="আজ দাম বেড়েছে" />
                            <Grid>
                                {risers.map((p) => (
                                    <ProductCard key={p.id} product={p} />
                                ))}
                            </Grid>
                        </section>
                    )}

                    {fallers.length > 0 && (
                        <section>
                            <SectionTitle icon="▼" iconClass="text-green-600" title="আজ দাম কমেছে" />
                            <Grid>
                                {fallers.map((p) => (
                                    <ProductCard key={p.id} product={p} />
                                ))}
                            </Grid>
                        </section>
                    )}

                    <section id="সব-পণ্য" className="scroll-mt-24">
                        <SectionTitle
                            title="সব পণ্য"
                            subtitle="সব পণ্যের আজকের দাম ও পরিবর্তন এক জায়গায়।"
                        />
                        {products.length === 0 ? (
                            <p className="rounded-2xl border border-gray-200 bg-[#fafcfa] px-6 py-10 text-center text-sm text-gray-500">
                                কোনো পণ্য পাওয়া যায়নি।
                            </p>
                        ) : (
                            <Grid wide>
                                {products.map((p) => (
                                    <ProductCard key={p.id} product={p} />
                                ))}
                            </Grid>
                        )}
                    </section>
                </>
            )}
        </div>
    );
}