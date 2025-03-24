export type AccessToken = string;

export type RefreshToken = string;

export type TokenPairs = {
    accessToken: AccessToken;
    refreshToken: RefreshToken;
};

export type JwtPayload = {
    sub: string;
    role: string;
    jti: string;
    iat: number;
    exp: number;
};

export type CreateTokenPayload = {
    sub: string;
    role: string;
};
