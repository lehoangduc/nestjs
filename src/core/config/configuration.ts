const configuration = () => ({
  tz: process.env.TZ || 'UTC',
  httpTimeout: parseInt(process.env.HTTP_TIMEOUT || '60000', 10),
  api: {
    interface: process.env.API_INTERFACE || 'localhost',
    port: parseInt(process.env.API_PORT || '3001', 10),
  },
  jwt: {
    secret: process.env.JWT_SECRET || '',
    expired: process.env.JWT_EXPIRED || '1d',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || null,
  },
  mysql: {
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || '3306', 10),
    username: process.env.MYSQL_USERNAME || '',
    password: process.env.MYSQL_PASSWORD || '',
    name: process.env.MYSQL_NAME || '',
    tz: process.env.MYSQL_TZ || 'Z',
  },
  mongodb: {
    connectionString: process.env.MONGODB_CONNECTION_STRING || '',
    database: process.env.MONGODB_DATABASE || '',
  },
  mail: {
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT || '465', 10),
    secure: process.env.MAIL_SECURE === 'true',
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
    fromPrefix: process.env.MAIL_FROM_PREFIX,
    from: process.env.MAIL_FROM,
  },
  s3: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
    region: process.env.S3_REGION || '',
    bucket: process.env.S3_BUCKET || '',
    keyPrefix: process.env.S3_KEY_PREFIX || 'test',
    cloudFrontUrl: process.env.S3_CLOUDFRONT_URL || '',
    cloudFrontKeyPairId: process.env.S3_CLOUDFRONT_KEY_PAIR_ID || '',
    cloudFrontPrivateKey: process.env.S3_CLOUDFRONT_PRIVATE_KEY || '',
  },
  fileStorage: {
    engine: process.env.FILE_STORAGE_ENGINE || 's3',
    uploadSizeLimit: parseInt(process.env.FILE_STORAGE_UPLOAD_SIZE_LIMIT || '31457280', 10), //30MB
  },
  auth: {
    signupEnabled:
      process.env.AUTH_SIGNUP_ENABLED === undefined || process.env.AUTH_SIGNUP_ENABLED === 'true',
    resetPasswordUrl: process.env.AUTH_RESET_PASSWORD_URL,
  },
})

export { configuration }
