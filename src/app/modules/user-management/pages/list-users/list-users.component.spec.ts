import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';

import {ListUsersComponent} from './list-users.component';
import {MaterialModule} from '../../../../shared/material.module';

describe('ListUsersComponent', () => {
    let component: ListUsersComponent;
    let fixture: ComponentFixture<ListUsersComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                MaterialModule,
                HttpClientTestingModule
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
