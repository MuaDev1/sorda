import winston from 'winston';

const logger = winston.createLogger({
  level: 'info', // مستوى تسجيل المعلومات (info, error, warn, debug)
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(), // تسجيل في وحدة التحكم
    new winston.transports.File({ filename: 'logs/app.log' }), // تسجيل في ملف
  ],
});

export default logger;
