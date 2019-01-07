import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseStoragesComponent } from './browse-storages.component';

describe('StorageManagerComponent', () => {
  let component: BrowseStoragesComponent;
  let fixture: ComponentFixture<BrowseStoragesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowseStoragesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseStoragesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
