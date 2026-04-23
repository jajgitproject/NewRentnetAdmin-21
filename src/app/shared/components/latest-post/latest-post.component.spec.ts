// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { LatestPostComponent } from './latest-post.component';

describe('LatestPostComponent', () => {
  let component: LatestPostComponent;
  let fixture: ComponentFixture<LatestPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LatestPostComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LatestPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

