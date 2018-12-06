import {Component, OnInit, ViewChild} from '@angular/core';
import {Actions, Select, Store} from '@ngxs/store';

import {SessionState} from '../../auth/state/session.state';
import {SearchQuerySubmitAction} from '../../../../state/app.actions';
import {AuthService} from '../../auth/auth.service';
import {AqlAutocompleteService} from '../../../../shared/form/services/aql-autocomplete.service';
import {AppState} from '../../../../state/app.state';
import {AbstractAutocompleteDataSource} from '../../../../shared/form/autocomplete/autocomplete.model';
import {AqlAutocompleteComponent} from '../../../../shared/form/autocomplete/aql-autocomplete/aql-autocomplete.component';
import {AqlAutocompleteDataSource} from '../../../../shared/form/autocomplete/aql-autocomplete/aql-autocomplete.data-source';

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
    @Select(SessionState.isAuthenticated)
    public isAuthenticated$;

    @Select(AppState.isHomepage)
    public isHomepage$;

    @Select(AppState.aqlQuery)
    public aqlQuery$;

    public aqlDataSource: AbstractAutocompleteDataSource;

    @ViewChild('aqlSearch')
    private aqlSearch: AqlAutocompleteComponent;

    constructor(public auth: AuthService,
                public aqlService: AqlAutocompleteService,
                private store: Store,
                private actions: Actions) {
    }

    submitSearchRequest(searchQuery = '') {
        this.store.dispatch(new SearchQuerySubmitAction(searchQuery));
    }

    ngOnInit(): void {
        this.aqlDataSource = new AqlAutocompleteDataSource(
            null,
            (search, cursorPosition) => this.aqlService.search(search, cursorPosition)
        );
    }
}
