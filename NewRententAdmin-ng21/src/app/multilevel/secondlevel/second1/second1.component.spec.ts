// @ts-nocheck
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { Second1Component } from './second1.component';

describe('Second1Component', () => {
  let component: Second1Component;
  let fixture: ComponentFixture<Second1Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [Second1Component],
      schemas: [NO_ERRORS_SCHEMA]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Second1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

