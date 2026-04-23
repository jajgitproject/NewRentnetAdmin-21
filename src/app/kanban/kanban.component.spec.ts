// @ts-nocheck
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { kanbansComponent } from './kanban.component';
describe('ViewkanbansComponent', () => {
  let component: kanbansComponent;
  let fixture: ComponentFixture<kanbansComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [kanbansComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(kanbansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

