import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {async, ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClient} from '@angular/common/http';
import {NgxsModule} from '@ngxs/store';

import {RepositorySearchResultsComponent} from './repository-search-results.component';
import {AppState} from '../../../../state/app.state';
import {MaterialModule} from '../../../../shared/material.module';
import {LayoutModule} from '../../../../shared/layout/layout.module';

describe('Component: RepositorySearchResultsComponent', () => {
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

    let component: RepositorySearchResultsComponent;
    let fixture: ComponentFixture<RepositorySearchResultsComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule,
                LayoutModule,
                MaterialModule,
                NgxsModule.forRoot([AppState]),
            ],
            declarations: [
                RepositorySearchResultsComponent
            ]
        });

        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);

        fixture = TestBed.createComponent(RepositorySearchResultsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
