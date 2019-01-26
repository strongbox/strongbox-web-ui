import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ManageRepositoryComponent} from './manage-repository.component';

describe('StorageManageComponent', () => {
    let component: ManageRepositoryComponent;
    let fixture: ComponentFixture<ManageRepositoryComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ManageRepositoryComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ManageRepositoryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
