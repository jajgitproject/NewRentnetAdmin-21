// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, Inject } from '@angular/core';
import { CustomerContractPackageTypePackageMappingService } from '../../customerContractPackageTypePackageMapping.service';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';
import { CustomerContractPackageTypePackageMapping } from '../../customerContractPackageTypePackageMapping.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../../../general/general.service';
import { CitiesDropDown } from 'src/app/organizationalEntity/citiesDropDown.model';
import { PackageDropDown } from 'src/app/general/packageDropDown.model';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: CustomerContractPackageTypePackageMapping;
  public CityList?: CitiesDropDown[] = [];
  public PackageList?: PackageDropDown[] = [];
  filteredOptions: Observable<PackageDropDown[]>;
  customerContractPackageTypeID!: number;
  customerContractPackageType: string;
  customerContractName: string;
  packageID: any;
  saveDisabled: boolean = true;
  CustomerContractID: number;

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: CustomerContractPackageTypePackageMappingService,
    private fb: FormBuilder,
    private el: ElementRef,
    public _generalService: GeneralService
  ) {
    this.CustomerContractID = data.customerContractID;
    this.customerContractPackageTypeID = data.customerContractPackageTypeID;
    this.customerContractPackageType = data.customerContractPackageType;
    this.customerContractName = data.customerContractName;
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = 'Package Mapping';
      this.advanceTable = data.advanceTable;
    } else {
      this.dialogTitle = 'Package Mapping';
      this.advanceTable = new CustomerContractPackageTypePackageMapping({});
      this.advanceTable.activationStatus = true;
      this.advanceTable.customerContractID = this.CustomerContractID;
    }
    this.advanceTableForm = this.createContactForm();
  }

  ngOnInit(): void {
    this.InitCities();
    this.initPackage();
  }

  onNoClick(action: string) {
    if (action === 'add') {
      this.advanceTableForm.reset();
    } else {
      this.dialogRef.close();
    }
  }

  InitCities() {
    this._generalService.GetCitiessAll().subscribe(data => {
      this.CityList = data;
    });
  }

  initPackage() {
    this._generalService.GetPackages().subscribe(
      data => {
        this.PackageList = data;
        this.advanceTableForm.controls['package'].setValidators([Validators.required]);
        this.advanceTableForm.controls['package'].updateValueAndValidity();
        this.filteredOptions = this.advanceTableForm.controls['package'].valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value || ''))
        );
      }
    );
  }

  private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    if (!value || value.length < 3) {
      return [];
    }
    return this.PackageList.filter(pkg => pkg.package.toLowerCase().includes(filterValue));
  }

  OnPackageSelect(selectedPackage: string) {
    const packageName = this.PackageList.find(data => data.package === selectedPackage);
    if (selectedPackage && packageName) {
      this.getPackage(packageName.packageID);
    }
  }

  getPackage(packageID: any) {
    this.packageID = packageID;
    this.packageOnSelect();
  }

  createContactForm(): FormGroup {
    return this.fb.group({
      customerContractPackageTypePackageMappingID: [this.advanceTable.customerContractPackageTypePackageMappingID],
      customerContractPackageTypeID: [this.data.customerContractPackageTypeID],
      customerContractID: [this.CustomerContractID],
      packageID: [this.advanceTable.packageID],
      customerPackageName: [this.advanceTable.customerPackageName, [Validators.required]],
      customerPackageCodeForIntegration: [this.advanceTable.customerPackageCodeForIntegration],
      activationStatus: [this.advanceTable.activationStatus],
      package: [this.advanceTable.package, [Validators.required]],
    });
  }

  submit() {}

  public Post(): void {
    this.advanceTableForm.patchValue({ customerContractPackageTypeID: this.data.customerContractPackageTypeID });
    this.advanceTableForm.patchValue({ customerContractID: this.CustomerContractID || this.data.customerContractID });
    this.advanceTableForm.patchValue({ packageID: this.packageID });
    this.advanceTableService.add(this.advanceTableForm.getRawValue()).subscribe(
      response => {
        if (response && response.activationStatus && typeof response.activationStatus === 'string' && response.activationStatus.includes('Duplicate')) {
          this._generalService.sendUpdate('DataNotFound:DuplicacyError:Failure');
          this.saveDisabled = true;
        } else {
          this.dialogRef.close();
          this._generalService.sendUpdate('CustomerContractPackageTypePackageMappingCreate:CustomerContractPackageTypePackageMappingView:Success');
          this.saveDisabled = true;
        }
      },
      () => {
        this._generalService.sendUpdate('CustomerContractPackageTypePackageMappingAll:CustomerContractPackageTypePackageMappingView:Failure');
        this.saveDisabled = true;
      }
    );
  }

  public Put(): void {
    this.advanceTableForm.patchValue({ customerContractPackageTypeID: this.advanceTable.customerContractPackageTypeID });
    this.advanceTableForm.patchValue({ customerContractID: this.CustomerContractID || this.data.customerContractID || this.advanceTable.customerContractID });
    this.advanceTableForm.patchValue({ packageID: this.packageID || this.advanceTable.packageID });
    this.advanceTableService.update(this.advanceTableForm.getRawValue()).subscribe(
      response => {
        if (response && response.activationStatus && typeof response.activationStatus === 'string' && response.activationStatus.includes('Duplicate')) {
          this._generalService.sendUpdate('DataNotFound:DuplicacyError:Failure');
          this.saveDisabled = true;
        } else {
          this.dialogRef.close();
          this._generalService.sendUpdate('CustomerContractPackageTypePackageMappingUpdate:CustomerContractPackageTypePackageMappingView:Success');
          this.saveDisabled = true;
        }
      },
      () => {
        this._generalService.sendUpdate('CustomerContractPackageTypePackageMappingAll:CustomerContractPackageTypePackageMappingView:Failure');
        this.saveDisabled = true;
      }
    );
  }

  public confirmAdd(): void {
    if (!this.CustomerContractID && !this.data.customerContractID) {
      alert('Customer Contract ID is missing. Please contact support.');
      return;
    }
    this.saveDisabled = false;
    if (this.action == 'edit') {
      this.Put();
    } else {
      this.Post();
    }
  }

  packageOnSelect() {
    this.advanceTableForm.controls['customerPackageName'].setValue(this.advanceTableForm.value.package);
  }

  canSave(): boolean {
    const pkg = this.advanceTableForm.get('package')?.value;
    const customerPackageName = this.advanceTableForm.get('customerPackageName')?.value;
    return !!(pkg && customerPackageName);
  }
}
