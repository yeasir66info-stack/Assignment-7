'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { signIn } from '@/lib/auth-client';

const GoogleIcon = () => (
    <svg viewBox="0 0 48 48" className="h-4 w-4" aria-hidden="true">
        <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.5 17.7 9.5 24 9.5z" />
        <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.7 6c4.5-4.2 6.9-10.3 6.9-17.7z" />
        <path fill="#FBBC05" d="M10.5 28.7c-.5-1.4-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C1 16.4 0 20.1 0 24s1 7.6 2.6 10.8l7.9-6.1z" />
        <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.7-6c-2.1 1.4-4.9 2.3-8.2 2.3-6.3 0-11.6-4-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
    </svg>
);

const GithubIcon = () => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
        <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
    </svg>
);

const inputClass =
    'w-full rounded-lg border border-gray-200 bg-[#f6f9f6] px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-600 focus:border-[#058a40] focus:ring-2 focus:ring-[#058a40]/20';

const SigninPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email.trim() || !password) {
            setError('ইমেইল ও পাসওয়ার্ড দুটোই দিন।');
            return;
        }

        setLoading(true);
        const { error: authError } = await signIn.email({
            email: email.trim(),
            password,
        });
        setLoading(false);

        if (authError) {
            const message = authError.message || 'ইমেইল বা পাসওয়ার্ড ভুল হয়েছে।';
            setError(message);
            toast.error(message);
            return;
        }

        toast.success('Successfully signed in!');
        router.push('/');
    };

    const handleSocial = async (provider) => {
        setError('');
        const { error: authError } = await signIn.social({
            provider,
            callbackURL: '/',
        });
        if (authError) {
            const message = authError.message || `${provider} দিয়ে সাইন ইন করা যায়নি।`;
            setError(message);
            toast.error(message);
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center bg-[#f0f5f0] px-4 pt-10 pb-12">
            {/* Title */}
            <h1 className="text-3xl font-extrabold text-gray-900">সাইন ইন</h1>
            <p className="mt-2 max-w-md text-center text-sm text-gray-500">
                বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।
            </p>

            {/* Card */}
            <div className="mt-6 w-full max-w-[446px] rounded-2xl border border-gray-200 bg-[#fafcfa] p-6 shadow-sm">
                <form onSubmit={handleSubmit} noValidate>
                    {/* Email */}
                    <label htmlFor="email" className="mb-2 block text-sm font-semibold text-gray-900">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className={inputClass}
                    />

                    <label htmlFor="password" className="mb-2 mt-4 block text-sm font-semibold text-gray-900">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className={inputClass}
                    />

                    {error && (
                        <p
                            role="alert"
                            className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                        >
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 w-full cursor-pointer rounded-lg bg-[#058a40] py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#047a38] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#058a40] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {loading ? 'অপেক্ষা করুন...' : 'Sign In'}
                    </button>
                </form>

                <div className="my-4 flex items-center gap-3">
                    <span className="h-px flex-1 bg-gray-200" />
                    <span className="text-xs text-gray-700">অথবা</span>
                    <span className="h-px flex-1 bg-gray-200" />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <button
                        type="button"
                        onClick={() => handleSocial('google')}
                        className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-200 bg-[#f6f9f6] py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#058a40]"
                    >
                        <GoogleIcon />
                        Google দিয়ে চালিয়ে যান
                    </button>
                    <button
                        type="button"
                        onClick={() => handleSocial('github')}
                        className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-200 bg-[#f6f9f6] py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#058a40]"
                    >
                        <GithubIcon />
                        GitHub দিয়ে চালিয়ে যান
                    </button>
                </div>

                <p className="mt-5 text-center text-sm text-gray-900">
                    অ্যাকাউন্ট নেই?{' '}
                    <Link href="/signup" className="font-medium text-[#058a40] hover:underline">
                        সাইন আপ করুন
                    </Link>
                </p>
            </div>

            <Link href="/" className="mt-8 text-sm text-gray-500 hover:text-gray-700">
                ← হোম পেজে ফিরে যান
            </Link>
        </main>
    );
};

export default SigninPage;