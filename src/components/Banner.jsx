'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const Banner = () => {
    const [dateText, setDateText] = useState('');

    useEffect(() => {
        const formatted = new Date().toLocaleDateString('bn-BD', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
        setDateText(formatted);
    }, []);

    return (
        <section className="mx-auto max-w-6xl px-4 pt-6">
            <div className="flex flex-col-reverse items-center justify-between gap-6 rounded-3xl border border-gray-200 bg-[#fafcfa] p-6 shadow-sm sm:p-8 md:flex-row">
                <div className="w-full md:max-w-xl">
                    <span className="inline-block min-h-[24px] rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-[#058a40]">
                        {dateText || '\u00A0'}
                    </span>


                    <h2 className="mt-3 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl">
                        আজকের বাজারের দাম এক নজরে
                    </h2>

                    <p className="mt-3 text-sm leading-relaxed text-gray-600">
                        চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়,
                        সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
                    </p>

                    <a
                        href="#সব-পণ্য"
                        className="mt-5 inline-block rounded-lg bg-[#058a40] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#047a38] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#058a40] focus-visible:ring-offset-2"
                    >
                        সব পণ্য দেখুন
                    </a>
                </div>

                <div className="relative h-44 w-64 shrink-0 sm:h-52 sm:w-72">
                    <Image
                        src="/bazar-hero.png"
                        alt="বাজারের তাজা শাকসবজি ও ফলের ঝুড়ি"
                        fill
                        priority
                        sizes="(max-width: 640px) 256px, 288px"
                        className="object-contain"
                    />
                </div>
            </div>
        </section>
    );
};

export default Banner;