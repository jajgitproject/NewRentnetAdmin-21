// @ts-nocheck
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ReadMailComponent } from './read-mail.component';

describe('ReadMailComponent', () => {
  let component: ReadMailComponent;
  let fixture: ComponentFixture<ReadMailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [ReadMailComponent],
      schemas: [NO_ERRORS_SCHEMA]
}).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

