// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { PatientGroupListComponent } from './patient-group-list.component';

describe('PatientGroupListComponent', () => {
  let component: PatientGroupListComponent;
  let fixture: ComponentFixture<PatientGroupListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PatientGroupListComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

