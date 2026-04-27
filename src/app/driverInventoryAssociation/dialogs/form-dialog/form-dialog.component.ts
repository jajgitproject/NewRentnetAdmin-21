// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { DriverInventoryAssociationService } from '../../driverInventoryAssociation.service';
import { FormControl, Validators, FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DriverDropDownForAllotment, DriverInventoryAssociation } from '../../driverInventoryAssociation.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../../../general/general.service';
import { Observable } from 'rxjs';
import { DriverDropDown } from 'src/app/customerPersonInstruction/driverDropDown.model';
import { map, startWith } from 'rxjs/operators';
import { VehicleDropDown } from 'src/app/vehicle/vehicleDropDown.model';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import moment from 'moment';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogComponent implements OnInit {
  showError: string;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: DriverInventoryAssociation;

  filteredDriverOptions: Observable<DriverDropDown[]>;
  public DriverList?: DriverDropDown[] = [];

  filteredDriverListOptions: Observable<DriverDropDownForAllotment[]>;
  public AnotherDriverList?: DriverDropDownForAllotment[] = [];

  filteredVehicleOptions: Observable<VehicleDropDown[]>;
  public VehicleList?: VehicleDropDown[] = [];

  driverID: any;
  vehicleID: number;

  inventoryID: any;
  DriverName: string;
  DriverID!: number;
  vehicleCategoryID: any;
  Regno: any;
  VehicleID: any;
  Vehicle: any;
  VehicleCategory: any;
  RedirectingFrom: any;
  DriverPhone: string;
  SupplierName: string;
  Supplier: any;
  saveDisabled: boolean = true;
  supplierID: number;
  ownedSupplier: any;
  driverInventoryAssociationDataSource: any;
  ownedSupplierChecked: string;
  InventorySupplierName: any;
  DriverSupplierName: any;
  driverSupplierID: number;
  inventorySupplierID: number;

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: DriverInventoryAssociationService,
    private fb: FormBuilder,
    public _generalService: GeneralService) {
    this.RedirectingFrom = data.redirectingFrom;
    this.DriverID = data.driverID;
    this.DriverName = data.driverName;
    this.Regno = data.regno;
    this.VehicleID = data.vehicleID;
    this.Vehicle = data.vehicle;
    this.VehicleCategory = data.vehicleCategory;
    this.DriverPhone = data.driverPhone;
    this.SupplierName = data.supplierName;
    this.Supplier = data.supplier;
    this.driverInventoryAssociationDataSource = data.driverInventoryAssociationDataSource;
    this.ownedSupplier = data.driverInventoryAssociationDataSource?.driverOwnedSupplier;
    this.supplierID = data.driverInventoryAssociationDataSource?.inventorySupplierID

    // Set the defaults
    this.action = data.action;
    console.log(data)
    this.InventorySupplierName = data.inventorySupplierName;
    this.DriverSupplierName = data.driverSupplierName;
    if (this.action === 'edit') {
      this.dialogTitle = 'Driver Inventory Association';
      this.advanceTable = data.advanceTable;
      this.advanceTable.activationStatus = true;
      //this.advanceTable.inventoryName=this.advanceTable.inventoryName + '-' + this.advanceTable.vehicle + '-'+ this.advanceTable.vehicleCategory;
      this.advanceTable.inventoryName = this.advanceTable.inventory + '-' + this.advanceTable.vehicle + '-' + this.advanceTable.supplierName;
      //  let driverInventoryAssociationStartDate=moment(this.advanceTable.driverInventoryAssociationStartDate).format('DD/MM/yyyy');
      //  let driverInventoryAssociationEndDate=moment(this.advanceTable.driverInventoryAssociationEndDate).format('DD/MM/yyyy');
      //  this.onBlurUpdateDateEdit(driverInventoryAssociationStartDate);
      //  this.onBlurUpdateEndDateEdit(driverInventoryAssociationEndDate);
      // this.advanceTable.driverName = this.advanceTable.driverName + '-' + this.advanceTable.driverPhone + '-' + this.Supplier;
    } else {
      this.dialogTitle = 'Driver Inventory Association';
      this.advanceTable = new DriverInventoryAssociation({});
      this.advanceTable.driverInventoryAssociationStatus = true;
      this.advanceTable.activationStatus = true;
    }
    this.advanceTableForm = this.createContactForm();
  }

  createContactForm(): FormGroup {
    return this.fb.group(
      {
        driverInventoryAssociationID: [this.advanceTable.driverInventoryAssociationID],
        driverID: [this.advanceTable.driverID],
        driverName: [this.advanceTable.driverName],
        inventoryID: [this.advanceTable.inventoryID],
        inventoryName: [this.advanceTable.inventoryName],
        vehicleID: [this.advanceTable.vehicleID],
        vehicle: [this.advanceTable.vehicle],
        inventory: [this.advanceTable.inventory],
        vehicleCategoryID: [this.advanceTable.vehicleCategoryID],
        vehicleCategory: [this.advanceTable.vehicleCategory],
        //   driverInventoryAssociationStartDate: [
        //   { value: this.advanceTable.driverInventoryAssociationStartDate, disabled: true }
        // ],
        //       driverInventoryAssociationEndDate: [
        //   { value: this.advanceTable.driverInventoryAssociationEndDate, disabled: true }
        // ],
        driverInventoryAssociationStatus: [
          this.advanceTable.driverInventoryAssociationStatus ?? true
        ],
        activationStatus: [this.advanceTable.activationStatus],
      });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  ngOnInit(): void {
    if (this.RedirectingFrom === "Driver") {
      const DP = this.DriverPhone.split('-')[1];
      this.InitVehicle();

      this.advanceTableForm.patchValue({ driverName: this.DriverName + "-" + DP + "-" + this.Supplier });
      this.advanceTableForm.patchValue({ driverID: this.DriverID });
      this.advanceTableForm.controls["driverName"].disable();
    }
    if (this.RedirectingFrom === "Inventory") {
      this.InitDriver();
      //this.advanceTableForm.patchValue({inventoryName:this.Regno + "-" + this.Vehicle + "-" + this.VehicleCategory});
      if (this.action === 'edit') {
        this.advanceTableForm.patchValue({ driverName: this.advanceTable.driverName + "-" + this.advanceTable.driverPhone + "-" + this.Regno + "-" + this.advanceTable.supplier });
      }
      this.advanceTableForm.patchValue({ inventoryName: this.Regno + "-" + this.Vehicle + "-" + this.SupplierName });
      this.advanceTableForm.patchValue({ inventoryID: this.VehicleID });
      this.advanceTableForm.controls["inventoryName"].disable();
    }
    if (this.data.text === 'AttachAnotherDriver') {
      this.ownedSupplierChecked = 'Supplier';
      this.advanceTableForm.controls['inventoryName'].disable();
      this.advanceTableForm.controls['inventoryName'].setValue(this.data.inventoryName + '-' + this.data.vehicle + '-' + this.data.vehicleCategory);
      this.advanceTableForm.controls['inventoryID'].patchValue(this.data.inventoryID);
      this.advanceTableForm.controls['driverInventoryAssociationID'].patchValue(this.data.driverInventoryAssociationID);
      this.advanceTableForm.controls['vehicleID'].patchValue(this.data.vehicleID);
      this.advanceTableForm.controls['vehicleCategoryID'].patchValue(this.data.vehicleCategoryID);
      //this.advanceTableForm.controls["driverInventoryAssociationStartDate"].setValue(this.data.driverInventoryAssociationStartDate);
      //this.advanceTableForm.controls["driverInventoryAssociationEndDate"].setValue(this.data.driverInventoryAssociationEndDate);
      this.advanceTableForm.controls["driverInventoryAssociationStatus"].setValue(this.data.driverInventoryAssociationStatus);
      this.advanceTableForm.controls["activationStatus"].setValue(this.data.activationStatus);
      this.advanceTableForm.patchValue({ driverID: this.data.driverID, });
      this.InitAttachAnotherDriver(this.supplierID, this.ownedSupplierChecked);
      //this.advanceTableForm.controls['vehicleCategory'].setValue(this.data.vehicleCategory);
    }
    if (this.data.text === 'AttachAnotherCar') {
      this.advanceTableForm.controls["driverName"].disable();
      this.advanceTableForm.controls["driverName"].setValue(this.data.driverName);
      //this.advanceTableForm.controls['driverID'].patchValue(this.data.driverID);
      this.advanceTableForm.patchValue({ driverID: this.data.driverID, });
      this.advanceTableForm.controls['vehicleID'].patchValue(this.data.vehicleID);
      this.advanceTableForm.controls['vehicleCategoryID'].patchValue(this.data.vehicleCategoryID);
      this.advanceTableForm.patchValue({ driverInventoryAssociationID: this.data.driverInventoryAssociationID });
      this.advanceTableForm.controls['inventoryName'].setValue(this.data.inventoryName + '-' + this.data.vehicle + '-' + this.data.vehicleCategory);
      this.advanceTableForm.controls['inventoryID'].patchValue(this.data.inventoryID);
      //this.advanceTableForm.controls["driverInventoryAssociationStartDate"].setValue(this.data.driverInventoryAssociationStartDate);
      //this.advanceTableForm.controls["driverInventoryAssociationEndDate"].setValue(this.data.driverInventoryAssociationEndDate);
      this.advanceTableForm.controls["driverInventoryAssociationStatus"].setValue(this.data.driverInventoryAssociationStatus);
      this.advanceTableForm.controls["activationStatus"].setValue(this.data.activationStatus);
    }

  }

  formControl = new FormControl('', [Validators.required]);

  onOwnedCheckboxChange(event: any) {
    const isChecked = event.checked;
    if (isChecked) {
      this.ownedSupplierChecked = 'Owned';
      this.InitAttachAnotherDriver(this.supplierID, this.ownedSupplierChecked);
    }
    else {
      this.ownedSupplierChecked = 'Supplier';
      this.InitAttachAnotherDriver(this.supplierID, this.ownedSupplierChecked);
    }
  }

  //---------AttachAnotherDriver-----------------
  InitAttachAnotherDriver(supplierID, ownedSupplier) {
    this.advanceTableService.getDriverList(supplierID, ownedSupplier).subscribe(
      data => {
        this.AnotherDriverList = data;
        this.advanceTableForm.controls['driverName'].setValidators([Validators.required,
        this.driverListTypeValidator(this.AnotherDriverList)
        ]);
        this.advanceTableForm.controls['driverName'].updateValueAndValidity();

        this.filteredDriverListOptions = this.advanceTableForm.controls['driverName'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterAttachAnotherDriver(value || ''))
        )
      });;
  }
  private _asSearchString(v: unknown): string {
    return v == null || v === undefined ? '' : String(v);
  }

  /** Digits only for phone-style matching. */
  private _phoneDigits(s: string): string {
    return (s || '').replace(/\D/g, '');
  }

  private _attachAnotherRowMatches(
    customer: DriverDropDownForAllotment,
    filterValue: string,
    filterDigits: string
  ): boolean {
    const f = (v: unknown) => this._asSearchString(v).toLowerCase();
    if (f(customer.driverName).includes(filterValue)) {
      return true;
    }
    if (f(customer.supplier).includes(filterValue)) {
      return true;
    }
    if (f(customer.supplierType).includes(filterValue)) {
      return true;
    }
    if (f(customer.ownedSupplier).includes(filterValue)) {
      return true;
    }
    const mobile = f(customer.mobile1);
    if (mobile.includes(filterValue)) {
      return true;
    }
    if (filterDigits.length >= 3) {
      const mobileD = this._phoneDigits(this._asSearchString(customer.mobile1));
      if (mobileD.includes(filterDigits)) {
        return true;
      }
    }
    return false;
  }

  private _filterAttachAnotherDriver(value: string): any {
    const raw = (value || '').trim();
    const filterValue = raw.toLowerCase();
    if (filterValue.length < 3) {
      return [];
    }
    const filterDigits = this._phoneDigits(raw);

    return (this.AnotherDriverList || []).filter((customer) =>
      this._attachAnotherRowMatches(customer, filterValue, filterDigits)
    );
  }


  // private _filterAttachAnotherDriver(value: string): any {
  //   const filterValue = value.toLowerCase();
  //   return this.AnotherDriverList.filter(
  //     customer => 
  //     {
  //       return customer.driverName.toLowerCase().includes(filterValue);
  //     }
  //   );
  // }

  OnDriverSelected(selectedDriver: string) {
    const DriverName = this.AnotherDriverList.find(
      data => data.driverName === selectedDriver
    );
    if (selectedDriver) {
      this.getDriverID(DriverName.driverID);
    }
  }

  getDriverlistID(driverID: any) {
    this.driverID = driverID;
    this.advanceTableForm.patchValue({ driverID: this.driverID });
  }

  driverListTypeValidator(AnotherDriverList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = AnotherDriverList.some(group => group.driverName.toLowerCase() === value);
      return match ? null : { driverInvalid: true };
    };
  }




  //---------Driver-----------------
  InitDriver() {
    this._generalService.GetDriver().subscribe(
      data => {
        this.DriverList = data;
        this.advanceTableForm.controls['driverName'].setValidators([Validators.required,
        this.driverTypeValidator(this.DriverList)
        ]);
        this.advanceTableForm.controls['driverName'].updateValueAndValidity();

        this.filteredDriverOptions = this.advanceTableForm.controls['driverName'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterCT(value || ''))
        )
      });;
  }

  private _filterCT(value: string): any {
    const filterValue = value.toLowerCase();
    if (filterValue.length < 3) {
      return [];
    }
    return this.DriverList.filter(
      customer => {
        return customer.driverName.toLowerCase().includes(filterValue);
      }
    );
  }

  OnDriverNameSelected(selectedDriver: string) {
    const DriverName = this.DriverList.find(
      data => data.driverName === selectedDriver
    );
    if (selectedDriver) {
      this.getDriverID(DriverName.driverID);
    }
  }

  getDriverID(driverID: any) {
    this.driverID = driverID;
    this.advanceTableForm.patchValue({ driverID: this.driverID });
  }

  driverTypeValidator(DriverList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = DriverList.some(group => group.driverName.toLowerCase() === value);
      return match ? null : { driverTypeInvalid: true };
    };
  }

  //-----------Inventory----------------
  InitVehicle() {
    this._generalService.GetVehicleAsInventory().subscribe(
      data => {
        this.VehicleList = data;
        this.advanceTableForm.controls['inventoryName'].setValidators([Validators.required,
        this.inventoryTypeValidator(this.VehicleList)
        ]);
        this.advanceTableForm.controls['inventoryName'].updateValueAndValidity();

        this.filteredVehicleOptions = this.advanceTableForm.controls['inventoryName'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterVehicle(value || ''))
        );
      });
  }

  private _filterVehicle(value: string): any {
    if (!value || value.length < 3) {
      return [];
    }

    const filterValue = value.toLowerCase();

    return this.VehicleList.filter(customer =>
      customer.vehicle.toLowerCase().includes(filterValue)
    );
  }

  // private _filterVehicle(value: string): any {
  //   const filterValue = value.toLowerCase();
  //   return this.VehicleList.filter(
  //     customer => 
  //     {
  //       return customer.vehicle.toLowerCase().includes(filterValue);
  //     }
  //   );
  // }

  onInventorySelected(selectedInventory: string) {
    const InventoryName = this.VehicleList.find(
      data => data.vehicle === selectedInventory
    );
    if (selectedInventory) {
      this.getvehicleID(InventoryName.vehicleID);
    }
  }

  getvehicleID(inventoryID: any) {
    this.inventoryID = inventoryID;
    this.advanceTableForm.patchValue({ inventoryID: this.inventoryID });
  }

  inventoryTypeValidator(VehicleList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = VehicleList.some(group => group.vehicle.toLowerCase() === value);
      return match ? null : { inventoryTypeInvalid: true };
    };
  }

  // getvehicleID(inventoryID: any, vehicleNameID:any, vehicleCategoryID:any) {
  //   this.inventoryID=inventoryID;
  //   this.vehicleID=vehicleNameID;
  //   this.vehicleCategoryID=vehicleCategoryID;
  //   this.advanceTableForm.patchValue({inventoryID:this.inventoryID});
  //   this.advanceTableForm.patchValue({vehicleNameID:this.vehicleID});
  //   this.advanceTableForm.patchValue({vehicleCategoryID:this.vehicleCategoryID});
  // }

  submit() {

  }

  onNoClick(): void {
    if (this.action === 'add') {
      this.advanceTableForm.reset();

    }
    else if (this.action === 'edit') {
      this.dialogRef.close();
    }
  }

  public Post(): void {
    //this.advanceTableForm.patchValue({driverInventoryAssociationID:this.driverInventoryAssociationID});
    // this.advanceTableForm.patchValue({driverID:this.driverID || this.advanceTable.driverID});
    //this.advanceTableForm.patchValue({vehicleID:this.vehicleID || this.advanceTable.vehicleID});
    this.advanceTableService.add(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          // console.log(response?.message)
           this.dialogRef.close({isClose:false});
          this._generalService.sendUpdate('DriverInventoryAssociationCreate:DriverInventoryAssociationView:Success');//To Send Updates  
          this.saveDisabled = true;
          alert("Driver Inventory Association Created...!!!");
        },
        error => {
          this._generalService.sendUpdate('DriverInventoryAssociationAll:DriverInventoryAssociationView:Failure');//To Send Updates 
          this.saveDisabled = true;
        }
      )
  }

  public Put(): void {

    //this.advanceTableForm.patchValue({driverInventoryAssociationID:this.driverInventoryAssociationID || this.advanceTable.driverInventoryAssociationID});

    //this.advanceTableForm.patchValue({driverID:this.driverID || this.advanceTable.driverID});
    //this.advanceTableForm.patchValue({inventoryID:this.inventoryID || this.advanceTable.inventoryID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.dialogRef.close({ isClose: false });
          this._generalService.sendUpdate('DriverInventoryAssociationUpdate:DriverInventoryAssociationView:Success');//To Send Updates  
          this.saveDisabled = true;
        },
        error => {
          this._generalService.sendUpdate('DriverInventoryAssociationAll:DriverInventoryAssociationView:Failure');//To Send Updates 
          this.saveDisabled = true;
        }
      )
  }
  public getDriverSupplierID() {

    this.advanceTableService.getDriverSupplierID(this.driverID).subscribe(
      data => {
        this.driverSupplierID = data.driverSupplierID;
        console.log("Driver Supplier ID:", this.driverSupplierID);
      },
      (error: HttpErrorResponse) => { this.dataSource = null; }
    );
  }
  public getInventorySupplierID() {

    this.advanceTableService.getInventorySupplierID(this.data.inventoryID).subscribe(
      data => {
        this.inventorySupplierID = data.inventorySupplierID;
        console.log("Inventory Supplier ID:", this.inventorySupplierID);

        this.checkSupplierAndProceed();
      },
      (error: HttpErrorResponse) => { this.dataSource = null; }
    );
  }
  public confirmAdd(): void {
    this.saveDisabled = false;
    if (this.action == "edit") {
      this.Put();
    }
    if (this.data.text === 'AttachAnotherDriver') {
      this.getDriverSupplierID();
      this.getInventorySupplierID();
    }
    else {
      this.Post();
    }
  }

  checkSupplierAndProceed() {
    if (this.driverSupplierID && this.inventorySupplierID) {    

      if (this.driverSupplierID === this.inventorySupplierID) {
        this.Post();
      }
      else {
      
        Swal.fire({
          title: 'Are you sure?',
          text: 'You want to change driver? because Driver Supplier and Inventory Supplier are different?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'Cancel',
           customClass: {
                cancelButton: 'btn btn-danger',
                confirmButton: 'btn btn-primary'
              },
        }).then(result => {
          if (result.isConfirmed) {
            this.Post();
          }
        });
      }

    }
  }
  //start date
  onBlurUpdateDate(value: string): void {
    value = this._generalService.resetDateiflessthan12(value);

    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm.get('driverInventoryAssociationStartDate')?.setValue(formattedDate);
    } else {
      this.advanceTableForm.get('driverInventoryAssociationStartDate')?.setErrors({ invalidDate: true });
    }
  }

  onBlurUpdateDateEdit(value: string): void {
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      if (this.action === 'edit') {
        this.advanceTable.driverInventoryAssociationStartDate = formattedDate
      }
      else {
        this.advanceTableForm.get('driverInventoryAssociationStartDate')?.setValue(formattedDate);
      }

    } else {
      this.advanceTableForm.get('driverInventoryAssociationStartDate')?.setErrors({ invalidDate: true });
    }
  }

  //end date
  onBlurUpdatesDate(value: string): void {
    value = this._generalService.resetDateiflessthan12(value);

    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm.get('driverInventoryAssociationEndDate')?.setValue(formattedDate);
    } else {
      if (value === "") {
        this.advanceTableForm.controls['driverInventoryAssociationEndDate'].setValue('');
      }
      else {
        this.advanceTableForm?.get('driverInventoryAssociationEndDate')?.setErrors({ invalidDate: true });
      }

    }
  }

  onBlurUpdateEndDateEdit(value: string): void {
    debugger;
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      if (this.action === 'edit') {
        this.advanceTable.driverInventoryAssociationEndDate = formattedDate
      }
      else {
        this.advanceTableForm?.get('driverInventoryAssociationEndDate')?.setValue(formattedDate);
      }

    } else {
      this.advanceTableForm?.get('driverInventoryAssociationEndDate')?.setErrors({ invalidDate: true });
    }
  }
}



