// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { QuickStatsGridComponent } from './quick-stats-grid.component';

describe('QuickStatsGridComponent', () => {
  let component: QuickStatsGridComponent;
  let fixture: ComponentFixture<QuickStatsGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuickStatsGridComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuickStatsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
