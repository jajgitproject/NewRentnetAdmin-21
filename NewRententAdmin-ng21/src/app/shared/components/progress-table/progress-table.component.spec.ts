// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ProgressTableComponent } from './progress-table.component';

describe('ProgressTableComponent', () => {
  let component: ProgressTableComponent;
  let fixture: ComponentFixture<ProgressTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProgressTableComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgressTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

