import {AfterViewChecked, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MediaChange, ObservableMedia} from '@angular/flex-layout';
import {Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

import {RepositorySearchService} from './modules/core/pages/search/repository-search.service';

@Component({
    selector: 'app-strongbox',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewChecked {
    public isMobile;
    public searchQuery: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    constructor(public router: Router,
                public media: ObservableMedia,
                private repositorySearchService: RepositorySearchService,
                private changeDetector: ChangeDetectorRef) {
    }

    submitSearchRequest() {
        if (this.searchQuery.getValue() != null) {
            this.router.navigate(['search', this.searchQuery.getValue()]);
        }
    }

    ngOnInit(): void {
        this.media.subscribe((change: MediaChange) => {
            this.isMobile = (change.mqAlias === 'xs' || change.mqAlias === 'sm' || change.mqAlias === 'md');
        });

        this.searchQuery = this.repositorySearchService.getQueryObservable();
        this.searchQuery.pipe(debounceTime(850)).subscribe((query) => {
            if (query) {
                this.router.navigate(['search', query]);
            }
        });
    }

    ngAfterViewChecked() {
        this.changeDetector.detectChanges();
    }
}
