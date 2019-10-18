import {Observable, Subject, throwError, timer} from 'rxjs';
import {mergeMap, retryWhen, takeUntil} from 'rxjs/operators';

export interface RetryConfig {
    maxRetries: number;
    delay?: number;
    exponentialDelay?: boolean;
    incrementFraction?: number;
    maxDelay?: number;
    logAttempt?: boolean;
    logError?: boolean;
    destroy$?: Subject<any>;
    onRetry?: (attempt: RetryAttempt) => void;
}

const defaultConfig: RetryConfig = {
    maxRetries: 3,
    delay: 1000,
    exponentialDelay: false,
    incrementFraction: 1.65,
    maxDelay: 30000,
    logAttempt: true,
    logError: false,
    destroy$: new Subject<any>(),
    onRetry: () => {
    },
};

export interface RetryAttempt {
    count: number;
    max: number;
    delay: number;
}

const initialRetryAttempt = {
    count: 0,
    max: 0,
    delay: defaultConfig.delay
};

export class RetryLimitExceededException extends Error {
    constructor(maxAttempts) {
        super(`Retry limit of ${maxAttempts} reached!`);
        this.name = RetryLimitExceededException.name;
    }
}

/**
 * Exponential retryWith
 * @param config
 */
export default function (config: RetryConfig) {
    const opts = Object.assign({}, defaultConfig, config);

    return <T>(source$: Observable<T>) => {
        // Use Object.assign to prevent mutations over initialRetryAttempt.
        let attempt: RetryAttempt = Object.assign({}, initialRetryAttempt);
        attempt.max = opts.maxRetries;
        return new Observable<T>(observer => {
            return source$
                .pipe(
                    retryWhen(errors =>
                        errors.pipe(
                            takeUntil(opts.destroy$),
                            // Set counter variables.
                            mergeMap((err, i) => {
                                attempt.count++;

                                if (attempt.count > opts.maxRetries) {
                                    attempt.count--; // fix counter.
                                    return throwError(new RetryLimitExceededException(opts.maxRetries));
                                }

                                if (opts.exponentialDelay) {
                                    attempt.delay = Math.floor(attempt.delay * opts.incrementFraction);
                                    if (attempt.delay > opts.maxDelay) {
                                        attempt.delay = opts.maxDelay;
                                    }
                                }

                                if (opts.logError) {
                                    console.error(err);
                                }

                                if (opts.logAttempt) {
                                    console.log(`[${attempt.count}/${opts.maxRetries}] Retrying in ${attempt.delay}ms`);
                                }

                                // callback hook
                                opts.onRetry.apply(this, [attempt]);

                                return timer(attempt.delay);
                            })
                        )
                    )
                )
                .subscribe({
                    next: (data) => {
                        attempt = initialRetryAttempt;
                        observer.next(data);
                    },
                    error: err => {
                        attempt = initialRetryAttempt;
                        observer.error(err);
                    },
                    complete: () => {
                        attempt = initialRetryAttempt;
                        observer.complete();
                    }
                });
        });
    };
}
