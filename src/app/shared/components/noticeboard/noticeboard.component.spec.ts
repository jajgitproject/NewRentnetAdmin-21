// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { NoticeboardComponent } from './noticeboard.component';

describe('NoticeboardComponent', () => {
  let component: NoticeboardComponent;
  let fixture: ComponentFixture<NoticeboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NoticeboardComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoticeboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

