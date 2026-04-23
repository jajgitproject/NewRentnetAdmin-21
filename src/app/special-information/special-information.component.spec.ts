// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpecialinformationComponent } from './special-information.component';



describe('SpecialinformationComponent', () => {
  let component:SpecialinformationComponent;
  let fixture: ComponentFixture<SpecialinformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpecialinformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialinformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

