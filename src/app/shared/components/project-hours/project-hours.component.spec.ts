// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ProjectHoursComponent } from './project-hours.component';

describe('ProjectHoursComponent', () => {
  let component: ProjectHoursComponent;
  let fixture: ComponentFixture<ProjectHoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectHoursComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

