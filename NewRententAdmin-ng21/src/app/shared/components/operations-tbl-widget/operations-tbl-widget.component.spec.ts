// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { OperationsTblWidgetComponent } from './operations-tbl-widget.component';

describe('OperationsTblWidgetComponent', () => {
  let component: OperationsTblWidgetComponent;
  let fixture: ComponentFixture<OperationsTblWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OperationsTblWidgetComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperationsTblWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

