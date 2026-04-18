// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IternallinformationComponent } from './internal-information.component';




describe('IternallinformationComponent', () => {
  let component:IternallinformationComponent;
  let fixture: ComponentFixture<IternallinformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IternallinformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IternallinformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

