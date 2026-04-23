// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { RecentCommentsComponent } from './recent-comments.component';

describe('RecentCommentsComponent', () => {
  let component: RecentCommentsComponent;
  let fixture: ComponentFixture<RecentCommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecentCommentsComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

