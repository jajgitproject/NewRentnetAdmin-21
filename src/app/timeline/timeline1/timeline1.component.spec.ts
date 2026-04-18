// @ts-nocheck
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Timeline1Component } from './timeline1.component';
describe('Timeline1Component', () => {
  let component: Timeline1Component;
  let fixture: ComponentFixture<Timeline1Component>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [Timeline1Component],
      schemas: [NO_ERRORS_SCHEMA]
}).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(Timeline1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

