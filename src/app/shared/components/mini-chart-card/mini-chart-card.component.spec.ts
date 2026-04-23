// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { MiniChartCardComponent } from './mini-chart-card.component';

describe('MiniChartCardComponent', () => {
  let component: MiniChartCardComponent;
  let fixture: ComponentFixture<MiniChartCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MiniChartCardComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiniChartCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
