import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FormFieldErrorsComponent} from './form-field-errors.component';

describe('Component: FormFieldErrorsComponent', () => {
    let component: FormFieldErrorsComponent;
    let fixture: ComponentFixture<FormFieldErrorsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FormFieldErrorsComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FormFieldErrorsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
