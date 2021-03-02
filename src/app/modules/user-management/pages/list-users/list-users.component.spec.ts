import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ToastrModule} from 'ngx-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {ListUsersComponent} from './list-users.component';
import {MaterialModule} from '../../../../shared/material.module';
import {NgxsModule} from '@ngxs/store';
import {LayoutModule} from '../../../../shared/layout/layout.module';

describe('Component: ListUsersComponent', () => {
    let component: ListUsersComponent;
    let fixture: ComponentFixture<ListUsersComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                BrowserAnimationsModule,
                LayoutModule,
                MaterialModule,
                HttpClientTestingModule,
                NgxsModule.forRoot(),
                ToastrModule.forRoot()
            ],
            declarations: [ListUsersComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ListUsersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
