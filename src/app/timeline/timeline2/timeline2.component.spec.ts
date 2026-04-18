// @ts-nocheck
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Timeline2Component } from './timeline2.component';
describe('Timeline2Component', () => {
  let component: Timeline2Component;
  let fixture: ComponentFixture<Timeline2Component>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [Timeline2Component],
      schemas: [NO_ERRORS_SCHEMA]
}).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(Timeline2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

