// @ts-nocheck
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CalendarComponent } from "./calendar.component";
describe("CalendarComponent", () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    declarations: [CalendarComponent],
      schemas: [NO_ERRORS_SCHEMA],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

