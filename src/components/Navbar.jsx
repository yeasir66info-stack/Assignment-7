'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useSession, signOut } from '@/lib/auth-client';
import PriceTicker from './PriceTicker';

// href gulo tomar asol route onujayi change koro
const categories = [
    { name: 'চাল', emoji: '🍚', href: '/category/rice' },
    { name: 'ডাল', emoji: '🫘', href: '/category/dal' },
    { name: 'তেল', emoji: '🛢️', href: '/category/oil' },
    { name: 'সবজি', emoji: '🥬', href: '/category/vegetables' },
    { name: 'মাছ', emoji: '🐟', href: '/category/fish' },
    { name: 'মাংস', emoji: '🥩', href: '/category/meat' },
    { name: 'ডিম-দুধ', emoji: '🥚', href: '/category/egg-milk' },
    { name: 'মসলা', emoji: '🌶️', href: '/category/spices' },
];

const Navbar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session, isPending } = useSession();

    const [menuOpen, setMenuOpen] = useState(false);
    const [dateText, setDateText] = useState('');
    const menuRef = useRef(null);

    // Bangla date (client e set kora hocche jate server/client er majhe hydration mismatch na hoy)
    useEffect(() => {
        const formatted = new Date().toLocaleDateString('bn-BD', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
        setDateText(formatted);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    if (pathname === '/signin' || pathname === '/signup') return null;

    const user = session?.user;

    const handleSignOut = async () => {
        setMenuOpen(false);
        await signOut();
        toast.success('Signed out');
        router.push('/');
        router.refresh();
    };

    return (
        <header className="bg-[#f8fbf8]">
            <div className="mx-auto max-w-6xl px-4">
                <div className="flex items-center justify-between py-3">
                    <Link href="/" className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#058a40] text-lg shadow-sm">
                            🛒
                        </span>
                        <span className="leading-tight">
                            <span className="block text-lg font-extrabold text-gray-900">বাজার দর</span>
                            <span className="block text-[11px] text-gray-500">{dateText || '\u00A0'}</span>
                        </span>
                    </Link>

                    <div className="flex items-center gap-3">
                        {isPending ? (
                            <div className="h-9 w-28 animate-pulse rounded-lg bg-gray-200" />
                        ) : user ? (
                            <div className="relative" ref={menuRef}>
                                <button
                                    type="button"
                                    onClick={() => setMenuOpen((prev) => !prev)}
                                    aria-haspopup="menu"
                                    aria-expanded={menuOpen}
                                    className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 transition hover:bg-gray-100"
                                >{user.image ? (
                                        <img
                                            src={user.image}
                                            alt={user.name || 'Profile'}
                                            className="h-8 w-8 rounded-full object-cover"
                                        />
                                    ) : (
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#058a40] text-sm font-bold text-white">
                                            {(user.name || user.email || '?').charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                    <span className="hidden text-sm font-medium text-gray-800 sm:block">
                                        {user.name?.split(' ')[0] || 'Profile'}
                                    </span>
                                    <span className="text-[10px] text-gray-500">▾</span>
                                </button>

                                {menuOpen && (
                                    <div
                                        role="menu"
                                        className="absolute right-0 z-50 mt-2 w-64 rounded-xl border border-gray-200 bg-white p-1 shadow-lg"
                                    >
                                        <div className="border-b border-gray-100 px-3 py-2.5">
                                            <p className="truncate text-sm font-semibold text-gray-900">
                                                {user.name}
                                            </p>
                                            <p className="truncate text-xs text-gray-500">{user.email}</p>
                                        </div>
                                        <button
                                            type="button"
                                            role="menuitem"
                                            onClick={handleSignOut}
                                            className="mt-1 flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 transition hover:bg-red-50"
                                        >
                                            <span aria-hidden="true">↩</span>
                                            সাইন আউট
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link
                                    href="/signin"
                                    className="text-sm font-medium text-gray-800 transition hover:text-[#058a40]"
                                >
                                    সাইন ইন
                                </Link>
                                <Link
                                    href="/signup"
                                    className="rounded-lg bg-[#058a40] px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[#047a38]"
                                >
                                    সাইন আপ
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                <nav aria-label="Categories" className="-mx-4 overflow-x-auto px-4 pb-3">
                    <ul className="flex min-w-max items-center gap-1">
                        {categories.map((cat) => {
                            const active = pathname === cat.href;
                            return (
                                <li key={cat.href}>
                                    <Link
                                        href={cat.href}
                                        aria-current={active ? 'page' : undefined}
                                        className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm transition ${
                                            active
                                                ? 'bg-[#058a40] font-semibold text-white shadow-sm'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        <span aria-hidden="true">{cat.emoji}</span>
                                        {cat.name}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>
            <PriceTicker />
        </header>
    );
};

export default Navbar;