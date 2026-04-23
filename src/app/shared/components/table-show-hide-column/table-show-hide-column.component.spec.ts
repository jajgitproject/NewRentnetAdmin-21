// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { TableShowHideColumnComponent } from './table-show-hide-column.component';

describe('TableShowHideColumnComponent', () => {
  let component: TableShowHideColumnComponent;
  let fixture: ComponentFixture<TableShowHideColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableShowHideColumnComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableShowHideColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

