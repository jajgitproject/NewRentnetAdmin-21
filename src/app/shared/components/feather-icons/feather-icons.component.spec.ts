// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { FeatherIconsComponent } from './feather-icons.component';

describe('FeatherIconsComponent', () => {
  let component: FeatherIconsComponent;
  let fixture: ComponentFixture<FeatherIconsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [FeatherIconsComponent],
      schemas: [NO_ERRORS_SCHEMA]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatherIconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

