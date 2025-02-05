import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import ReduxProvider from '@/lib/store/redux-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { CookiesProvider } from 'next-client-cookies/server';
import ReactQueryProvider from '@/components/QueryClientProvider';

import '../globals.css';
import 'swiper/css';
import 'swiper/css/bundle';
import './swiper.css';

import { Toaster } from '@/components/ui/toaster';

import { PageHeader } from '@/components/page-header';
import { PageFooter } from '@/components/page-footer';

const inter = Inter({ subsets: ['vietnamese'] });

export const metadata: Metadata = {
    title: 'Smart Tech Store',
    description: 'Smart Tech Store',
};
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                    enableSystem
                    disableTransitionOnChange
                >
                    <CookiesProvider>
                        <ReduxProvider>
                            <TooltipProvider>
                                <PageHeader />
                                <ReactQueryProvider>
                                    <main className="min-h-screen min-w-[400px]">
                                        {children}
                                    </main>
                                </ReactQueryProvider>
                                <Toaster />
                                <PageFooter />
                            </TooltipProvider>
                        </ReduxProvider>
                    </CookiesProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
