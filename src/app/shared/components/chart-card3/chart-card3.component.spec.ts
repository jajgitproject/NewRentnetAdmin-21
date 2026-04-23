// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ChartCard3Component } from './chart-card3.component';

describe('ChartCard3Component', () => {
  let component: ChartCard3Component;
  let fixture: ComponentFixture<ChartCard3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChartCard3Component],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartCard3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

