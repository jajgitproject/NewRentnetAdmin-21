// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { DocWelcomeCardComponent } from './doc-welcome-card.component';

describe('DocWelcomeCardComponent', () => {
  let component: DocWelcomeCardComponent;
  let fixture: ComponentFixture<DocWelcomeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocWelcomeCardComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocWelcomeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

