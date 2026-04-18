// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { EmpStatusComponent } from './emp-status.component';

describe('EmpStatusComponent', () => {
  let component: EmpStatusComponent;
  let fixture: ComponentFixture<EmpStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmpStatusComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

