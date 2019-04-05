import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ToastrModule} from 'ngx-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {ListRoutesComponent} from './list-routes.component';
import {MaterialModule} from '../../../../shared/material.module';
import {NgxsModule} from '@ngxs/store';
import {LayoutModule} from '../../../../shared/layout/layout.module';

describe('Component: ListUsersComponent', () => {
    let component: ListRoutesComponent;
    let fixture: ComponentFixture<ListRoutesComponent>;

    beforeEach(async(() => {
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
            declarations: [ListRoutesComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ListRoutesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
