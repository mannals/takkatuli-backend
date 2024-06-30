module.exports = {
apps: [{
    name: 'auth-server',
    script: './auth-server/dist/auth-server/src/index.js',
    watch: true,
    env: {
    NODE_ENV: 'development',
    DB_HOST: 'localhost',
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASS,
    DB_NAME: process.env.DB_NAME,
    JWT_SECRET: process.env.JWT_SECRET,
    UPLOAD_URL: process.env.UPLOAD_URL,
    },
    env_production: {
    NODE_ENV: 'production',
    },
    exec_mode: 'cluster',
    instances: 1,
    pre_start: 'cd ./auth-server && npm run build'
}, {
    name: 'media-api',
    script: './media-api/dist/media-api/src/index.js',
    watch: true,
    env: {
    NODE_ENV: 'development',
    DB_HOST: 'localhost',
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASS,
    DB_NAME: process.env.DB_NAME,
    JWT_SECRET: process.env.JWT_SECRET,
    UPLOAD_SERVER: process.env.UPLOAD_SERVER,
    UPLOAD_URL: process.env.UPLOAD_URL,
    },
    env_production: {
    NODE_ENV: 'production',
    },
    exec_mode: 'cluster',
    instances: 1, 
    pre_start: 'cd ./media-api && npm run build'
}, {
    name: 'upload-server',
    script: './upload-server/dist/upload-server/src/index.js',
    watch: true,
    env: {
        NODE_ENV: 'development',
        JWT_SECRET: process.env.JWT_SECRET,
        AUTH_URL: process.env.AUTH_URL,
        MEDIA_API: process.env.MEDIA_API,
    },
    env_production: {
        NODE_ENV: 'production',
    },
    exec_mode: 'cluster',
    instances: 1,
    pre_start: 'cd ./upload-server && npm run build'
}]
};