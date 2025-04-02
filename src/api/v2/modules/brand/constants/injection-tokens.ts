export const BRAND_TOKENS = {
    REPOSITORIES: {
        COMMAND: Symbol('BRAND_COMMAND_REPOSITORY'),
        QUERY: Symbol('BRAND_QUERY_REPOSITORY'),
    },
    SERVICES: {
        COMMAND: Symbol('BRAND_COMMAND_SERVICE'),
        QUERY: Symbol('BRAND_QUERY_SERVICE'),
        MEDIA_UPLOAD: Symbol('BRAND_MEDIA_UPLOAD_SERVICE'),
        MEDIA_DELETE: Symbol('BRAND_MEDIA_DELETE_SERVICE'),
        BRAND: Symbol('BRAND_SERVICE'),
    },
    HANDLERS: {
        MEDIA_UPLOAD: Symbol('BRAND_MEDIA_UPLOAD_HANDLER'),
        MEDIA_DELETE: Symbol('BRAND_MEDIA_DELETE_HANDLER'),
    },
};
