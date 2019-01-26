import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BrowseRepositoryComponent} from './browse-repository.component';

describe('BrowseRepositoryComponent', () => {
    let component: BrowseRepositoryComponent;
    let fixture: ComponentFixture<BrowseRepositoryComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BrowseRepositoryComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BrowseRepositoryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
