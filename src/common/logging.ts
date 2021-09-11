
enum LogLevel {
  debug = 0,
  info,
  warn,
  error,
};

type LogLevels = keyof typeof LogLevel;

type LoggingFunction = (message: any, ...data: any[]) => void;
interface Logger {
  debug: LoggingFunction;
  info: LoggingFunction;
  warn: LoggingFunction;
  error: LoggingFunction;
}

let globalLogLevel: LogLevel;

const setLogLevel = (level: LogLevels) => globalLogLevel = LogLevel[level] ?? LogLevel.info;

class ConsoleLogger implements Logger {
  constructor(private name: string) {}

  public debug(message: any, ...data: any[]): void {
    this.log(LogLevel.debug, message, ...data);
  }

  public info(message: any, ...data: any[]): void {
    this.log(LogLevel.info, message, ...data);
  }

  public warn(message: any, ...data: any[]): void {
    this.log(LogLevel.warn, message, ...data);
  }

  public error(message: any, ...data: any[]): void {
    this.log(LogLevel.error, message, ...data);
  }

  protected log(level: LogLevel, message: any, ...data: any[]): void {
    if (level < globalLogLevel) {
      return;
    }

    const messageWithName = `[${this.name}] ${message}`;

    switch (level) {
      case LogLevel.debug:
        console.debug(messageWithName, ...data);
        break;
      case LogLevel.info:
        console.info(messageWithName, ...data);
        break;
      case LogLevel.warn:
        console.warn(messageWithName, ...data);
        break;
      case LogLevel.error:
        console.error(messageWithName, ...data);
        break;
    }
  }
}

setLogLevel((process.env.REACT_APP_LOG_LEVEL) as LogLevels);
(window as any).__setLogLevel = setLogLevel;

export function createLogger(name: string): Logger {
  return new ConsoleLogger(name);
}
