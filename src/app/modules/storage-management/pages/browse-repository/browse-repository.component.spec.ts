import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NgxsModule} from '@ngxs/store';

import {BrowseRepositoryComponent} from './browse-repository.component';
import {MaterialModule} from '../../../../shared/material.module';
import {LayoutModule} from '../../../../shared/layout/layout.module';

describe('Component: BrowseRepositoryComponent', () => {
    let component: BrowseRepositoryComponent;
    let fixture: ComponentFixture<BrowseRepositoryComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                BrowserAnimationsModule,
                MaterialModule,
                LayoutModule,
                HttpClientTestingModule,
                NgxsModule.forRoot([]),
            ],
            declarations: [BrowseRepositoryComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BrowseRepositoryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
