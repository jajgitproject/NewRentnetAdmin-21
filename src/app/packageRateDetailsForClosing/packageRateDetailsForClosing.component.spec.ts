// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PackageRateDetailsForClosingComponent } from './packageRateDetailsForClosing.component';


describe('PackageRateDetailsForClosingComponent', () => {
  let component: PackageRateDetailsForClosingComponent;
  let fixture: ComponentFixture<PackageRateDetailsForClosingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackageRateDetailsForClosingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageRateDetailsForClosingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

