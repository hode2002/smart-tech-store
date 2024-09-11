import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Smart Tech Store',
        short_name: 'Smart Tech Store',
        description: 'A Progressive Web App built with Next.js',
        start_url: '/',
        display: 'standalone',
        icons: [
            {
                src: './images/site-logo.png',
                sizes: '500x500',
                type: 'image/png',
            },
        ],
    };
}
