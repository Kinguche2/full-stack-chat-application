export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.MONGO,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  },
  testing: {
    hey: process.env.HEY,
  },
  jwtSecret: process.env.JWT_SECRET,
});
