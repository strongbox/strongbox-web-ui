import {ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {of} from 'rxjs';
import {ToastrModule} from 'ngx-toastr';

import {LdapConnectionTestDialogComponent} from './ldap-connection-test-dialog.component';
import {MaterialModule} from '../../../../../../../shared/material.module';


describe('Dialog: LdapConnectionTestDialogComponent', () => {
    let component: LdapConnectionTestDialogComponent;
    let fixture: ComponentFixture<LdapConnectionTestDialogComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                MaterialModule,
                HttpClientTestingModule,
                RouterTestingModule,
                ReactiveFormsModule,
                ToastrModule.forRoot()
            ],
            declarations: [LdapConnectionTestDialogComponent],
            providers: [
                {provide: MAT_DIALOG_DATA, useValue: {}},
                {provide: MatDialogRef, useValue: {afterClosed: () => of(null)}}
            ]
        });

        fixture = TestBed.createComponent(LdapConnectionTestDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create an instance', () => {
        expect(component).toBeTruthy();
    });

});
