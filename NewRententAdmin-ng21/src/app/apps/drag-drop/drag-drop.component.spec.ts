// @ts-nocheck
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DragDropComponent } from './drag-drop.component';
describe('DragDropComponent', () => {
  let component: DragDropComponent;
  let fixture: ComponentFixture<DragDropComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [DragDropComponent],
      schemas: [NO_ERRORS_SCHEMA]
}).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(DragDropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

