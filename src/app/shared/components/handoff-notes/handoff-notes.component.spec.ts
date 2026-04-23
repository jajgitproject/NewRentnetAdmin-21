// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { HandoffNotesComponent } from './handoff-notes.component';

describe('HandoffNotesComponent', () => {
  let component: HandoffNotesComponent;
  let fixture: ComponentFixture<HandoffNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HandoffNotesComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HandoffNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

