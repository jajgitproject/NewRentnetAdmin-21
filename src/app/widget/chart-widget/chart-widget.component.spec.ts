// @ts-nocheck
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ChartWidgetComponent } from './chart-widget.component';

describe('ChartWidgetComponent', () => {
  let component: ChartWidgetComponent;
  let fixture: ComponentFixture<ChartWidgetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [ChartWidgetComponent],
      schemas: [NO_ERRORS_SCHEMA]
}).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

