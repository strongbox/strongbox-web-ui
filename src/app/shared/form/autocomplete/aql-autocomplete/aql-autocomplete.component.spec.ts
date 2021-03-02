import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AqlAutocompleteComponent} from './aql-autocomplete.component';
import {MaterialModule} from '../../../material.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CommonModule} from '@angular/common';

describe('AqlAutocompleteComponent', () => {
    let component: AqlAutocompleteComponent;
    let fixture: ComponentFixture<AqlAutocompleteComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                BrowserAnimationsModule,
                FormsModule,
                ReactiveFormsModule,
                MaterialModule
            ],
            declarations: [AqlAutocompleteComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AqlAutocompleteComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
