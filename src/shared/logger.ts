import path from "path";
import DailyRotateFile from "winston-daily-rotate-file";
import chalk from "chalk"; // For coloring terminal output
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf } = format;

interface IMessageProps {
  level: string;
  message: string;
  label: string;
  timestamp: Date;
}

// Emoji + color symbols
const getLogIcon = (level: string): string => {
  switch (level.toLowerCase()) {
    case "error":
      return chalk.red("❌");
    case "warn":
      return chalk.yellow("⚠️");
    case "info":
      return chalk.green("✅");
    case "debug":
      return chalk.cyan("🐞");
    case "verbose":
      return chalk.magenta("🔍");
    default:
      return chalk.white("📌");
  }
};

// Color text by level
const colorizeLevel = (level: string, text: string) => {
  switch (level.toLowerCase()) {
    case "error":
      return chalk.red(text);
    case "warn":
      return chalk.yellow(text);
    case "info":
      return chalk.green(text);
    case "debug":
      return chalk.cyan(text);
    case "verbose":
      return chalk.magenta(text);
    default:
      return chalk.white(text);
  }
};

// Custom formatter
const myFormat = printf(({ level, message, label, timestamp }: IMessageProps) => {
  const date = new Date(timestamp);
  const timeString = date.toTimeString().split(" ")[0]; // HH:MM:SS
  const icon = getLogIcon(level);
  const levelText = colorizeLevel(level, level.toUpperCase());
  const labelText = chalk.blue(`[${label}]`);

  return `${chalk.gray(date.toDateString())} ${chalk.gray(timeString)} ${icon} ${labelText} ${levelText}: ${message}`;
});

// Normal Logger
const logger = createLogger({
  level: "info",
  format: combine(label({ label: "Finder" }), timestamp(), myFormat),
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      filename: path.join(process.cwd(), "winston", "success", "%DATE%-success.log"),
      datePattern: "DD-MM-YYYY-HH",
      maxSize: "20m",
      maxFiles: "1d",
    }),
  ],
});

// Error Logger
const errorLogger = createLogger({
  level: "error",
  format: combine(label({ label: "Finder" }), timestamp(), myFormat),
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      filename: path.join(process.cwd(), "winston", "error", "%DATE%-error.log"),
      datePattern: "DD-MM-YYYY-HH",
      maxSize: "20m",
      maxFiles: "1d",
    }),
  ],
});

export { errorLogger, logger };
