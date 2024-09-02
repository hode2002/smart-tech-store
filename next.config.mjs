/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn0.fahasa.com',
                port: '',
                pathname: '/media/**',
            },
            {
                protocol: 'https',
                hostname: 'img.tgdd.vn',
                port: '',
                pathname: '/imgt/**',
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                port: '',
                pathname:
                    '/dwmhohds0/image/upload/v1685348575/Shopping-Online/**',
            },
            {
                protocol: 'https',
                hostname: 'cdn.hoanghamobile.com',
                port: '',
                pathname: '/i/productlist/ts/Uploads/**',
            },
            {
                protocol: 'https',
                hostname: 'images.fpt.shop',
                port: '',
                pathname: '/unsafe/**',
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                port: '',
                pathname: '/a-/**',
            },
            {
                protocol: 'https',
                hostname: 'smart-tech-project.s3.ap-southeast-2.amazonaws.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'cdn.tgdd.vn',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'platform-lookaside.fbsbx.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
    typescript: {
        ignoreBuildErrors: true,
    },
};

export default nextConfig;
