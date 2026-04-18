// @ts-nocheck
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MaterialComponent } from './material.component';
describe('MaterialComponent', () => {
  let component: MaterialComponent;
  let fixture: ComponentFixture<MaterialComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [MaterialComponent],
      schemas: [NO_ERRORS_SCHEMA]
}).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

