// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { GeneralService } from 'src/app/general/general.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChangeCarTypeService } from '../../changeCarType.service';
import { ChangeCarTypeModel } from '../../changeCarType.model';
import { VehicleVehicleCategoryDropDown } from 'src/app/vehicle/vehicleVehicleCategoryDropDown.model';
import Swal from 'sweetalert2';

@Component({
  standalone: false,
    selector: 'app-form-dialog',
    templateUrl: './form-dialog.component.html',
    styleUrls: ['./form-dialog.component.sass'],
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
  })

export class ChangeCarTypeFormDialogComponent {
  showError?: string;
  action?: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable?: ChangeCarTypeModel;
  saveDisabled: boolean = true;

  public VehicleList?: VehicleVehicleCategoryDropDown[] = [];
  filteredVehicleOptions?: Observable<VehicleVehicleCategoryDropDown[]>;
  NewRecordID: any;
  PreviousRecordID: any;
  PreviousRecordName: string;
  CustomerGroupID: any;
  ReservationID: any;
  CustomerContractID: number;
  vehicleCategoryID: any;
  dutySlipID: any;
  package: any;
  packageType: any;
  packageID: any;

  constructor(
    public dialogRef: MatDialogRef<ChangeCarTypeFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: ChangeCarTypeService,
    private fb: FormBuilder,
    public _generalService: GeneralService,
    private snackBar: MatSnackBar,) {
    // Set the defaults
    this.dialogTitle = 'Change Car Type';
    this.ReservationID = data?.reservationID;
    this.CustomerGroupID = data?.customerGroupID;
    this.PreviousRecordID = data?.vehicleID;
    this.PreviousRecordName = data?.vehicle + '-' + data.vehicleCategory;
    this.CustomerContractID = data?.customerContractID;
    this.dutySlipID = data?.dutySlipID;
    this.package = data?.package;
    this.packageType = data?.packageType;
    this.packageID = data?.packageID;
    // this.vehicleCategoryID = data?.vehicleCategoryID;
    this.advanceTableForm = this.createContactForm();
  }

  public ngOnInit(): void {
    this.advanceTableForm.get('previousRecordName')?.disable();
    this.InitCarType();
  }

  createContactForm(): FormGroup {
    return this.fb.group(
      {
        //reservationChangeLogID:[this.advanceTable?.reservationChangeLogID],
        reservationID: [this.ReservationID],
        changeType: ['Car Type'],
        previousRecordID: [this.PreviousRecordID],
        previousRecordName: [this.PreviousRecordName],
        newRecordID: [this.advanceTable?.newRecordID],
        newRecordName: [this.advanceTable?.newRecordName],
        reason: [this.advanceTable?.reason || ''],
        dutySlipID: [this.dutySlipID],
        customerContractID: [this.CustomerContractID],
        vehicleCategoryID: [this.vehicleCategoryID],
        package: [this.package],
        packageType: [this.packageType],
        packageID: [this.packageID]
      });
  }


  submit() { }

  showNotification(colorName: any, text: string, placementFrom: any, placementAlign: any) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

  public Post(): void {
    this.saveDisabled = false;
    this.advanceTableForm.patchValue({ previousRecordName: this.PreviousRecordName.split('-')[0] })
    this.advanceTableService.add(this.advanceTableForm.getRawValue()).subscribe(
      response => {
        this.dialogRef.close();
        this.showNotification(
          'snackbar-success',
          'Car Type Changed Successfully...!!!',
          'bottom',
          'center'
        );
        this.dialogRef.close(true);
        this.saveDisabled = true;
      },
      error => {
        console.error('Full Error:', error);

        let errorMessage = error || 'Operation Failed';
        Swal.fire({
          title: 'Validation Errors',
          icon: 'error',
          html: `<div style="text-align:left;">${errorMessage}</div>`,
          confirmButtonText: 'OK',
          width: '800px',
          customClass: {
            container: 'swal2-popup-high-zindex'
          }
        })


        this.saveDisabled = true;
        return;
      }
      // error =>
      // {
      //  this.showNotification(
      //     'snackbar-danger',
      //     'Operation Failed...!!!',
      //     'bottom',
      //     'center'
      //   );
      //   this.saveDisabled = true; 
      // }
    )
  }


  InitCarType() {
    this.advanceTableService.getVehicleBasedOnContractID(this.CustomerContractID).subscribe(
      data => {
        this.VehicleList = data;
        this.advanceTableForm.controls['newRecordName'].setValidators([Validators.required, this.VehicleEmployeeValidator(this.VehicleList)]);
        this.advanceTableForm.controls['newRecordName'].updateValueAndValidity();
        this.filteredVehicleOptions = this.advanceTableForm.controls['newRecordName'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterVehicle(value || ''))
        );
      });
  }

  private _filterVehicle(value: string): any {
    const filterValue = value.toLowerCase();
    return this.VehicleList?.filter(
      data => {
        return data.vehicle.toLowerCase().includes(filterValue);
      }
    );
  }

  VehicleEmployeeValidator(VehicleList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = VehicleList.some(data => ((data.vehicle + '-' + data.vehicleCategory).toLowerCase()) === value);
      return match ? null : { newRecordNameInvalid: true };
    };
  }
  onVehicleSelected(selectedStateName: string) {
    const selectedState = this.VehicleList?.find(
      data => data.vehicle + '-' + data.vehicleCategory === selectedStateName);
    if (selectedState) {
      this.getVehicleID(selectedState.vehicleID, selectedState.vehicleCategoryID);
    }
  }
  getVehicleID(vehicleID: any, vehicleCategoryID: any) {
    this.NewRecordID = vehicleID;
    this.vehicleCategoryID = vehicleCategoryID;
    this.advanceTableForm.patchValue({ newRecordID: this.NewRecordID })
    this.advanceTableForm.patchValue({ vehicleCategoryID: this.vehicleCategoryID })
  }

}


