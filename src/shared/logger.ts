import path from "path";
import DailyRotateFile from "winston-daily-rotate-file";
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf } = format;

interface IMessageProps {
  level: string;
  message: string;
  label: string;
  timestamp: Date;
}

// Simple symbols for different log levels
const getLogSymbol = (level: string): string => {
  switch (level.toLowerCase()) {
    case "error":
      return "✗";
    case "warn":
      return "!";
    case "info":
      return "✓";
    case "debug":
      return "*";
    case "verbose":
      return "+";
    default:
      return "-";
  }
};

const myFormat = printf(
  ({ level, message, label, timestamp }: IMessageProps) => {
    const date = new Date(timestamp);
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const symbol = getLogSymbol(level);
    return `${date.toDateString()} ${hour}:${minutes}:${seconds} ${symbol} [${label}] ${level}: ${message}`;
  }
);

const logger = createLogger({
  level: "info",
  format: combine(label({ label: "Finder" }), timestamp(), myFormat),
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      filename: path.join(
        process.cwd(),
        "winston",
        "success",
        "%DATE%-success.log"
      ),
      datePattern: "DD-MM-YYYY-HH",
      maxSize: "20m",
      maxFiles: "1d",
    }),
  ],
});

const errorLogger = createLogger({
  level: "error",
  format: combine(label({ label: "Finder" }), timestamp(), myFormat),
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      filename: path.join(
        process.cwd(),
        "winston",
        "error",
        "%DATE%-error.log"
      ),
      datePattern: "DD-MM-YYYY-HH",
      maxSize: "20m",
      maxFiles: "1d",
    }),
  ],
});

export { errorLogger, logger };
