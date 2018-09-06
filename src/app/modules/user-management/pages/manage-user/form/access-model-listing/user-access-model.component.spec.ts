import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessModelListingComponent } from './access-model-listing.component';

describe('AccessModelListingComponent', () => {
    let component: AccessModelListingComponent;
    let fixture: ComponentFixture<AccessModelListingComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ AccessModelListingComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AccessModelListingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
