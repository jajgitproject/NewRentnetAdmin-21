// @ts-nocheck
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BlankComponent } from './blank.component';
describe('BlankComponent', () => {
  let component: BlankComponent;
  let fixture: ComponentFixture<BlankComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [BlankComponent],
      schemas: [NO_ERRORS_SCHEMA]
}).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(BlankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

