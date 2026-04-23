// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { Third1Component } from './third1.component';

describe('Third1Component', () => {
  let component: Third1Component;
  let fixture: ComponentFixture<Third1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [Third1Component],
      schemas: [NO_ERRORS_SCHEMA]
})
    .compileComponents();

    fixture = TestBed.createComponent(Third1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

