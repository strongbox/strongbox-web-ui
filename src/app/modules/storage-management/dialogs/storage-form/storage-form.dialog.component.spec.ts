import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {StorageFormDialogComponent} from './storage-form.dialog.component';

describe('StoragesDialogComponent', () => {
    let component: StorageFormDialogComponent;
    let fixture: ComponentFixture<StorageFormDialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [StorageFormDialogComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StorageFormDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
