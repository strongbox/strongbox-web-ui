import {Component, Inject} from '@angular/core';
import {MediaChange, ObservableMedia} from '@angular/flex-layout';

@Component({
    selector: 'app-strongbox',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    public isMobile;

    constructor(@Inject(ObservableMedia) media: ObservableMedia) {
        media.subscribe((change: MediaChange) => {
            this.isMobile = (change.mqAlias === 'xs' || change.mqAlias === 'sm' || change.mqAlias === 'md');
        });
    }
}
