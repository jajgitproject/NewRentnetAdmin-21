// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { MedicineListComponent } from './medicine-list.component';

describe('MedicineListComponent', () => {
  let component: MedicineListComponent;
  let fixture: ComponentFixture<MedicineListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicineListComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicineListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

