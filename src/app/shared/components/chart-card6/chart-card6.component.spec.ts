// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ChartCard6Component } from './chart-card6.component';

describe('ChartCard6Component', () => {
  let component: ChartCard6Component;
  let fixture: ComponentFixture<ChartCard6Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChartCard6Component],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartCard6Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

