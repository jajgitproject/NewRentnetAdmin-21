// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ChartCard1Component } from './chart-card1.component';

describe('ChartCard1Component', () => {
  let component: ChartCard1Component;
  let fixture: ComponentFixture<ChartCard1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChartCard1Component],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartCard1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

