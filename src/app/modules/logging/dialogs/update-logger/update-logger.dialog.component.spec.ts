import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateLoggerDialogComponent } from './update-logger.dialog.component';

describe('UpdateLogger.DialogComponent', () => {
  let component: UpdateLoggerDialogComponent;
  let fixture: ComponentFixture<UpdateLoggerDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateLoggerDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateLoggerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
