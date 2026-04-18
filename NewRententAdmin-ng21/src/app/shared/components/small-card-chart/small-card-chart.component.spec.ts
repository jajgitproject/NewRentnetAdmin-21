// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { SmallCardChartComponent } from './small-card-chart.component';

describe('SmallCardChartComponent', () => {
  let component: SmallCardChartComponent;
  let fixture: ComponentFixture<SmallCardChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SmallCardChartComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmallCardChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

