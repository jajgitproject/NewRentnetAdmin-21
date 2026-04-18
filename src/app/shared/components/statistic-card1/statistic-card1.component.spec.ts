// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { StatisticCard1Component } from './statistic-card1.component';

describe('StatisticCard1Component', () => {
  let component: StatisticCard1Component;
  let fixture: ComponentFixture<StatisticCard1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatisticCard1Component],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatisticCard1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

