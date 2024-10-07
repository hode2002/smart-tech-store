'use client';

import { useRouter } from 'next/navigation';
import React, { useLayoutEffect } from 'react';
const Page = () => {
    const router = useRouter();
    useLayoutEffect(() => {
        router.push('/');
    }, [router]);
    return <div>Page</div>;
};

export default Page;
