export default () => ({
  // Common
  app: {
    name: process.env.APP_NAME,
    host: process.env.APP_HOST,
    port: process.env.APP_PORT,
    timezone: process.env.TIMEZONE,
    environment: process.env.NODE_ENV,
  },
  // RabbitMQ
  rabbitmq: {
    url: process.env.RABBITMQ_URL,
  },
});
