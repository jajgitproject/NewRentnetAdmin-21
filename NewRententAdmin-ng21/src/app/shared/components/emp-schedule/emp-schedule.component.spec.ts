// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { EmpScheduleComponent } from './emp-schedule.component';

describe('EmpScheduleComponent', () => {
  let component: EmpScheduleComponent;
  let fixture: ComponentFixture<EmpScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmpScheduleComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

