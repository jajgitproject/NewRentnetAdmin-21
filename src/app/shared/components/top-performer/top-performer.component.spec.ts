// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { TopPerformerComponent } from './top-performer.component';

describe('TopPerformerComponent', () => {
  let component: TopPerformerComponent;
  let fixture: ComponentFixture<TopPerformerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopPerformerComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopPerformerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

