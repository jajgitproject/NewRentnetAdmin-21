// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { EmpTaskTabComponent } from './emp-task-tab.component';

describe('EmpTaskTabComponent', () => {
  let component: EmpTaskTabComponent;
  let fixture: ComponentFixture<EmpTaskTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmpTaskTabComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpTaskTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

