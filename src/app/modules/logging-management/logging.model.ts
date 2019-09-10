export class Logger {
    public loggerPackage: string = null;
    public level: string = null;
    public appenderName: string = null;
}

export class Loggers {
    public levels: string[] = [];
    public loggers: Record<string, Level>[] = [];
}

export class Level {
    public configuredLevel: string = null;
    public effectiveLevel: string = null;
}

export class LoggerConfiguration extends Level {
    public package: string = null;
}

