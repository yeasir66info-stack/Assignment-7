'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

export default function RequireAuth({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const { data: session, isPending } = authClient.useSession();

    useEffect(() => {
        if (!isPending && !session) {
            router.replace(`/signin?next=${encodeURIComponent(pathname)}`);
        }
    }, [isPending, session, router, pathname]);

    if (isPending || !session) {
        return (
            <div className="mx-auto max-w-5xl px-4 py-10 text-center text-sm text-gray-500">
                লোড হচ্ছে...
            </div>
        );
    }

    return children;
}