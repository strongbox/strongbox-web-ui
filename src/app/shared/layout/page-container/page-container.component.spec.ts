import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';

import {PageContainerComponent} from './page-container.component';
import {MaterialModule} from '../../material.module';
import {BreadcrumbComponent} from '../breadcrumb/breadcrumb.component';

describe('PageContainerComponent', () => {
    let component: PageContainerComponent;
    let fixture: ComponentFixture<PageContainerComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                MaterialModule
            ],
            declarations: [PageContainerComponent, BreadcrumbComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PageContainerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
