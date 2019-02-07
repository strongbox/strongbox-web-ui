import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgxsModule} from '@ngxs/store';

import {MaterialModule} from '../../../../shared/material.module';
import {LayoutModule} from '../../../../shared/layout/layout.module';
import {BrowseComponent} from './browse.component';

describe('Component: BrowseComponent', () => {
    let component: BrowseComponent;
    let fixture: ComponentFixture<BrowseComponent>;

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
            declarations: [BrowseComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BrowseComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
