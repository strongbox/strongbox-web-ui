import {Exclude, Expose, plainToClass, Transform} from 'class-transformer';

@Exclude()
export class Logger {
    @Expose({groups: ['list', 'all']})
    package: string;

    @Expose({groups: ['list', 'save', 'all']})
    configuredLevel: string;

    @Expose({groups: ['list', 'all']})
    effectiveLevel: string;
}

export class LoggersResponse {
    public levels: string[] = [];
    @Transform((incoming: Record<string, any>) => {
        let result = [];

        if (incoming != null) {
            result = Object.keys(incoming).map(key => {
                let raw = incoming[key];
                raw.package = key;
                return plainToClass(Logger, raw, {groups: ['list']});
            });
        }

        return result;
    }, {toClassOnly: true})
    public loggers: Logger[] = [];
}

