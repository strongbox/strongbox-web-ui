import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRepositoriesComponent } from './list-repositories.component';

describe('ListRepositoriesComponent', () => {
  let component: ListRepositoriesComponent;
  let fixture: ComponentFixture<ListRepositoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListRepositoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListRepositoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
