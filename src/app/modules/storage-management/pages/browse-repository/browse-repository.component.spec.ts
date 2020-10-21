import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NgxsModule} from '@ngxs/store';
import {Router} from '@angular/router';

import {BrowseRepositoryComponent} from './browse-repository.component';
import {MaterialModule} from '../../../../shared/material.module';
import {LayoutModule} from '../../../../shared/layout/layout.module';
import {NgZone} from '@angular/core';

describe('Component: BrowseRepositoryComponent', () => {
    let component: BrowseRepositoryComponent;
    let fixture: ComponentFixture<BrowseRepositoryComponent>;
    let router: Router;
    let ngZone: NgZone;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                BrowserAnimationsModule,
                MaterialModule,
                LayoutModule,
                HttpClientTestingModule,
                NgxsModule.forRoot([]),
                RouterTestingModule.withRoutes([
                    {
                        path: 'admin/storages/:storageId/:repositoryId',
                        children: [
                            {
                                path: '**',
                                component: BrowseRepositoryComponent
                            }
                        ]
                    },
                ])
            ],
            declarations: [BrowseRepositoryComponent]
        }).compileComponents();

        router = TestBed.inject(Router);
        ngZone = TestBed.inject(NgZone);
        ngZone.run(() => {
            router.initialNavigation();
            router.navigateByUrl('admin/storages/myStorageId/myRepositoryId/some/long/path');
        });
    }));

    it('should create', () => {
        fixture = TestBed.createComponent(BrowseRepositoryComponent);
        fixture.detectChanges();
        component = fixture.componentInstance;

        expect(component).toBeTruthy();
    });
});
