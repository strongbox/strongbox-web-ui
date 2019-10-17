// cross-browser Event Source.
import {EventSourcePolyfill, NativeEventSource} from 'event-source-polyfill';
import {Observable, Observer, throwError} from 'rxjs';

const EventSource = NativeEventSource || EventSourcePolyfill;

export enum ConnectionState {
    CONNECTING,
    OPEN,
    CLOSED
}

export interface EventSourceMessage {
    connectionState: ConnectionState;
    type: string;
    data: any;
    rawEvent: Event | MessageEvent;
}

/**
 * @param url string
 * @param events string[]
 * @param options EventSourceInit
 */
export default function (url: string, events: string[], options?: EventSourceInit): Observable<EventSourceMessage> {
    return new Observable((source$: Observer<any>) => {
        let source;

        const connect = () => {
            source = new EventSource(url, options);
            source.onerror = handleErrorEvent;
            events.forEach(name => source.addEventListener(name, handleEvent));
        };

        const disconnect = () => {
            source.close();
            source.removeEventListener('error', handleErrorEvent, false);
            events.forEach(name => source.removeEventListener(name, handleEvent), false);
            source$.complete();
        };

        const handleErrorEvent = (e: Event) => {
            const eventSource = (e.currentTarget as EventSource);
            const state: number = eventSource.readyState;
            const readyState = ConnectionState[ConnectionState[state]];
            source$.error(throwError({
                connectionState: readyState,
                type: 'error',
                data: null,
                rawEvent: e
            } as EventSourceMessage));
        };

        const handleEvent = (e: MessageEvent) => source$.next({
            connectionState: ConnectionState.OPEN,
            type: e.type,
            data: e.data,
            rawEvent: e
        } as EventSourceMessage);

        // Initialize EventSource connection.
        connect();

        return {
            unsubscribe(): void {
                disconnect();
            }
        };
    });
}
