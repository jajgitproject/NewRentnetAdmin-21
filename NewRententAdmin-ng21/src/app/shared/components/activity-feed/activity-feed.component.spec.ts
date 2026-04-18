// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ActivityFeedComponent } from './activity-feed.component';

describe('ActivityFeedComponent', () => {
  let component: ActivityFeedComponent;
  let fixture: ComponentFixture<ActivityFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActivityFeedComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivityFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display activities', () => {
    component.activities = [
      {
        id: '1',
        title: 'Test Activity',
        description: 'Test Description',
        type: 'user',
        timestamp: new Date(),
        priority: 'medium'
      }
    ];
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.activity-item-title')?.textContent).toContain('Test Activity');
  });

  it('should show empty state when no activities', () => {
    component.activities = [];
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.empty-state')).toBeTruthy();
  });
});
