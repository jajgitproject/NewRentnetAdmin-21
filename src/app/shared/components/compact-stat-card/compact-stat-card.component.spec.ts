// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { CompactStatCardComponent } from './compact-stat-card.component';

describe('CompactStatCardComponent', () => {
  let component: CompactStatCardComponent;
  let fixture: ComponentFixture<CompactStatCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompactStatCardComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompactStatCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
