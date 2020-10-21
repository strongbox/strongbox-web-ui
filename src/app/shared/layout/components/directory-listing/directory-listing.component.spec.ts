import {HttpClientTestingModule} from '@angular/common/http/testing';
import {async, ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgxsModule} from '@ngxs/store';
import {ChangeDetectorRef} from '@angular/core';

import {DirectoryListingComponent} from './directory-listing.component';
import {MaterialModule} from '../../../material.module';
import {DirectoryListingService} from '../../services/directory-listing.service';
import {CamelCaseToSpacePipe} from '../../pipes/camel-case-to-space.pipe';
import {FilesizePipe} from '../../pipes/filesize.pipe';

describe('Component: DirectoryListingComponent', () => {
    let component: DirectoryListingComponent;
    let fixture: ComponentFixture<DirectoryListingComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                BrowserAnimationsModule,
                MaterialModule,
                HttpClientTestingModule,
                NgxsModule.forRoot([]),
            ],
            providers: [
                DirectoryListingService,
                {provide: ChangeDetectorRef, useValue: {}}
            ],
            declarations: [DirectoryListingComponent, CamelCaseToSpacePipe, FilesizePipe]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DirectoryListingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
