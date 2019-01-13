import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClient} from '@angular/common/http';
import {NgxsModule} from '@ngxs/store';

import {RepositorySearchResultsComponent} from './repository-search-results.component';
import {CodeSnippetPipePipe} from '../../../../shared/layout/pipes/code-snippet.pipe';
import {AppState} from '../../../../state/app.state';
import {MaterialModule} from '../../../../shared/material.module';
import {LayoutModule} from '../../../../shared/layout/layout.module';

describe('Component: RepositorySearchResultsComponent', () => {
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

    let component: RepositorySearchResultsComponent;
    let fixture: ComponentFixture<RepositorySearchResultsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule,
                LayoutModule,
                MaterialModule,
                NgxsModule.forRoot([AppState]),
            ],
            declarations: [
                RepositorySearchResultsComponent,
                CodeSnippetPipePipe
            ]
        });

        httpClient = TestBed.get(HttpClient);
        httpTestingController = TestBed.get(HttpTestingController);

        fixture = TestBed.createComponent(RepositorySearchResultsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
