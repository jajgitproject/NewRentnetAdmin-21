// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentdataInformationComponent } from './currentdata-information.component';

describe('CurrentdataInformationComponent', () => {
  let component: CurrentdataInformationComponent;
  let fixture: ComponentFixture<CurrentdataInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentdataInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentdataInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

