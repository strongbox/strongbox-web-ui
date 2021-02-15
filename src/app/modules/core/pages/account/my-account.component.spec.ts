import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {NgxsModule} from '@ngxs/store';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgxsFormPluginModule} from '@ngxs/form-plugin';
import {ToastrModule} from 'ngx-toastr';

import {MyAccountComponent} from './my-account.component';
import {MaterialModule} from '../../../../shared/material.module';
import {AccountService} from './account.service';
import {SessionState} from '../../auth/state/session.state';
import {LayoutModule} from '../../../../shared/layout/layout.module';

describe('ProfileComponent', () => {
    let component: MyAccountComponent;
    let fixture: ComponentFixture<MyAccountComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                BrowserAnimationsModule,
                HttpClientTestingModule,
                ReactiveFormsModule,
                MaterialModule,
                LayoutModule,
                NgxsModule.forRoot([
                    SessionState
                ]),
                NgxsFormPluginModule.forRoot(),
                ToastrModule.forRoot(),
                RouterTestingModule
            ],
            declarations: [MyAccountComponent],
            providers: [
                AccountService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MyAccountComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
