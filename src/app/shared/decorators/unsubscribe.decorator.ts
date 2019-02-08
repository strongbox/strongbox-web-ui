import {Subscription} from 'rxjs';

import {environment} from '../../../environments/environment';

export interface UnsubscribeSettings {
    blacklist: string[];
}

export function Unsubscribe(settings: UnsubscribeSettings = {blacklist: []}) {
    return function (constructor) {
        const component = constructor.name;
        const original = constructor.prototype.ngOnDestroy;

        constructor.prototype.ngOnDestroy = function () {

            for (const prop of Object.keys(this)) {
                const property = this[prop];
                if (!settings.blacklist.includes(prop)) {
                    if (property && (property instanceof Subscription && typeof property.unsubscribe === 'function')) {
                        if (!environment.production) {
                            console.log(`%c Unsubscribed from ${component}.${prop}`, `color: #4CAF50; font-weight: bold`);
                        }
                        property.unsubscribe();
                    }
                }
            }

            original && typeof original === 'function' && original.apply(this, arguments);
        };
    };
}
