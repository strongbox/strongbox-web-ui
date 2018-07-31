import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {NgxsModule} from '@ngxs/store';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgxsFormPluginModule} from '@ngxs/form-plugin';

import {ProfileComponent} from './profile.component';
import {MaterialModule} from '../../../../shared/material.module';
import {ProfileService} from './profile.service';
import {SessionState} from '../../auth/state/session.state';
import {ToastrModule} from 'ngx-toastr';

describe('ProfileComponent', () => {
    let component: ProfileComponent;
    let fixture: ComponentFixture<ProfileComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                BrowserAnimationsModule,
                HttpClientTestingModule,
                ReactiveFormsModule,
                MaterialModule,
                NgxsModule.forRoot([
                    SessionState
                ]),
                NgxsFormPluginModule.forRoot(),
                ToastrModule.forRoot(),
                RouterTestingModule
            ],
            declarations: [ProfileComponent],
            providers: [
                ProfileService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProfileComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
