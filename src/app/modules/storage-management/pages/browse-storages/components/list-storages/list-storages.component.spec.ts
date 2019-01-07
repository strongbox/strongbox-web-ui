import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListStoragesComponent } from './list-storages.component';

describe('ListStoragesComponent', () => {
  let component: ListStoragesComponent;
  let fixture: ComponentFixture<ListStoragesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListStoragesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListStoragesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
