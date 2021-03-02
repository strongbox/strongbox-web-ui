import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CommonModule} from '@angular/common';

import {SelectAutocompleteComponent} from './select-autocomplete.component';
import {MaterialModule} from '../../../material.module';
import {FormHelperModule} from '../../form-helper.module';

describe('SelectAutocompleteComponent', () => {
    let component: SelectAutocompleteComponent;
    let fixture: ComponentFixture<SelectAutocompleteComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                BrowserAnimationsModule,
                MaterialModule,
                FormHelperModule
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SelectAutocompleteComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
