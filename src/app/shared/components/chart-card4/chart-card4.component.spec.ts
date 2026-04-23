// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ChartCard4Component } from './chart-card4.component';

describe('ChartCard4Component', () => {
  let component: ChartCard4Component;
  let fixture: ComponentFixture<ChartCard4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChartCard4Component],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartCard4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

