import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AqlAutocompleteComponent} from './aql-autocomplete.component';

describe('AqlAutocompleteComponent', () => {
    let component: AqlAutocompleteComponent;
    let fixture: ComponentFixture<AqlAutocompleteComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AqlAutocompleteComponent]
        })
            .compileComponents();
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
