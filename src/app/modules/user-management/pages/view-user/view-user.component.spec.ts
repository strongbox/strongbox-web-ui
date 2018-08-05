import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NgxsModule} from '@ngxs/store';
import {ToastrModule} from 'ngx-toastr';

import {ViewUserComponent} from './view-user.component';
import {MaterialModule} from '../../../../shared/material.module';
import {SessionState} from '../../../core/auth/state/session.state';

describe('Component: ViewUserComponent', () => {
    let component: ViewUserComponent;
    let fixture: ComponentFixture<ViewUserComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                MaterialModule,
                HttpClientTestingModule,
                NgxsModule.forRoot([
                    SessionState
                ]),
                ToastrModule.forRoot()
            ],
            declarations: [ViewUserComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ViewUserComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
