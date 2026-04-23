// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LumpsuminformationComponent } from './lumpsum-information.component';





describe('LumpsuminformationComponent', () => {
  let component:LumpsuminformationComponent;
  let fixture: ComponentFixture<LumpsuminformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LumpsuminformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LumpsuminformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

