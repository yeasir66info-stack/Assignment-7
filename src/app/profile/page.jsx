'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useSession, signOut, updateUser } from '@/lib/auth-client';

function ProfileSkeleton() {
    return (
        <div className="space-y-5">
            <div className="space-y-2">
                <div className="h-7 w-40 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-64 animate-pulse rounded bg-gray-200" />
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-[#fafcfa] p-4">
                <div className="h-14 w-14 animate-pulse rounded-xl bg-gray-200" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200" />
                    <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200" />
                </div>
                <div className="h-9 w-24 animate-pulse rounded-lg bg-gray-200" />
            </div>

            <div className="space-y-4 rounded-2xl border border-gray-200 bg-[#fafcfa] p-5">
                <div className="h-5 w-16 animate-pulse rounded bg-gray-200" />
                <div className="h-3 w-10 animate-pulse rounded bg-gray-200" />
                <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200" />
                <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200" />
            </div>
        </div>
    );
}

export default function ProfilePage() {
    const router = useRouter();
    const { data: session, isPending } = useSession();
    const user = session?.user;

    const [name, setName] = useState('');
    const [saving, setSaving] = useState(false);
    const [signingOut, setSigningOut] = useState(false);

    useEffect(() => {
        if (!isPending && !session && !signingOut) {
            router.replace('/signin');
        }
    },
     [isPending, session, signingOut, router]);

    useEffect(() => {
        if (user?.name) setName(user.name);
    }, [user?.name]);

    const handleUpdate = async (e) => {
        e.preventDefault();

        const trimmed = name.trim();
        if (!trimmed) {
            toast.error('নাম খালি রাখা যাবে না।');
            return;
        }
        if (trimmed === user.name) {
            toast('নতুন কিছু পরিবর্তন করা হয়নি।');
            return;
        }

        setSaving(true);
        const { error } = await updateUser({ name: trimmed });
        setSaving(false);

        if (error) {
            toast.error(error.message || 'প্রোফাইল আপডেট করা যায়নি।');
            return;
        }
        toast.success('প্রোফাইল সফলভাবে আপডেট হয়েছে!');
    };

    const handleSignOut = async () => {
        setSigningOut(true);
        await signOut();
        toast.success('সফলভাবে সাইন আউট হয়েছে!');
        router.push('/');
        router.refresh();
    };

    return (
        <div className="min-h-[70vh] bg-[#f0f5f0] py-10">
            <div className="mx-auto max-w-2xl px-4">
                {isPending || !user ? (
                    <ProfileSkeleton />
                ) : (
                    <div className="space-y-5">
                        <div>
                            <h1 className="text-2xl font-extrabold text-gray-900">আমার প্রোফাইল</h1>
                            <p className="text-sm text-gray-500">আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।</p>
                        </div>

                        <div className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-[#fafcfa] p-4 shadow-sm">
                            <div className="flex min-w-0 items-center gap-4">
                                {user.image ? (
                                    <img
                                        src={user.image}
                                        alt={user.name || 'Profile'}
                                        referrerPolicy="no-referrer"
                                        className="h-14 w-14 shrink-0 rounded-xl object-cover"
                                    />
                                ) : (
                                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#058a40] text-xl font-bold text-white">
                                        {(user.name || user.email || '?').charAt(0).toUpperCase()}
                                    </span>
                                )}
                                <div className="min-w-0">
                                    <p className="truncate text-base font-semibold text-gray-900">{user.name}</p>
                                    <p className="truncate text-sm text-gray-500">{user.email}</p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleSignOut}
                                className="shrink-0 cursor-pointer rounded-lg border border-red-300 px-3.5 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                            >
                                <span aria-hidden="true">↩ </span>সাইন আউট
                            </button>
                        </div>

                        <form
                            onSubmit={handleUpdate}
                            noValidate
                            className="rounded-2xl border border-gray-200 bg-[#fafcfa] p-5 shadow-sm"
                        >
                            <h2 className="text-base font-bold text-gray-900">তথ্য</h2>

                            <label htmlFor="name" className="mb-2 mt-5 block text-sm font-semibold text-gray-900">
                                নাম
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="আপনার নাম লিখুন"
                                className="w-full rounded-lg border border-gray-200 bg-[#f6f9f6] px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-500 focus:border-[#058a40] focus:ring-2 focus:ring-[#058a40]/20"
                            />

                            <button
                                type="submit"
                                disabled={saving}
                                className="mt-4 w-full cursor-pointer rounded-lg bg-[#058a40] py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#047a38] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#058a40] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {saving ? 'আপডেট হচ্ছে...' : 'আপডেট'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}