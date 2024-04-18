import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import ReduxProvider from '@/lib/store/redux-provider';
import { TooltipProvider } from '@/components/ui/tooltip';

import '../globals.css';

import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['vietnamese'] });

export const metadata: Metadata = {
    title: 'Addmin | Dashboard',
    description: 'CT466 - Project Admin Dashboard',
};

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <ReduxProvider>
                        <TooltipProvider>
                            <main className="min-h-screen min-w-[400px]">
                                {children}
                            </main>
                            <Toaster />
                        </TooltipProvider>
                    </ReduxProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
