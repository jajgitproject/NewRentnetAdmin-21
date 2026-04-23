// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { EarningSourceComponent } from './earning-source.component';

describe('EarningSourceComponent', () => {
  let component: EarningSourceComponent;
  let fixture: ComponentFixture<EarningSourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EarningSourceComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EarningSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

