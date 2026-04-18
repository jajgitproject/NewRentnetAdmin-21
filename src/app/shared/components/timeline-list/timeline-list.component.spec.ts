// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { TimelineListComponent } from './timeline-list.component';

describe('TimelineListComponent', () => {
  let component: TimelineListComponent;
  let fixture: ComponentFixture<TimelineListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimelineListComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimelineListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

