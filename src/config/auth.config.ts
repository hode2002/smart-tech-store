export default () => ({
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || 'DEFAULT_ACCESS_TOKEN_SECRET',
    accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '1d',
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || 'DEFAULT_REFRESH_TOKEN_SECRET',
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
    cookieOptions:
        process.env.COOKIE_OPTIONS ||
        "{path:'/',httpOnly:false,secure:false,sameSite:'none',maxAge:60*60*1000}",
    frontendRedirectUrl: process.env.FRONTEND_DOMAIN || 'http://localhost:3000',
    pythonApiUrl: process.env.PYTHON_API_URL || 'http://localhost:3002',
});
