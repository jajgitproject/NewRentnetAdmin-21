// @ts-nocheck
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { First3Component } from './first3.component';

describe('First3Component', () => {
  let component: First3Component;
  let fixture: ComponentFixture<First3Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [First3Component],
      schemas: [NO_ERRORS_SCHEMA]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(First3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

