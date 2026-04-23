// @ts-nocheck
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { First2Component } from './first2.component';

describe('First2Component', () => {
  let component: First2Component;
  let fixture: ComponentFixture<First2Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [First2Component],
      schemas: [NO_ERRORS_SCHEMA]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(First2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

