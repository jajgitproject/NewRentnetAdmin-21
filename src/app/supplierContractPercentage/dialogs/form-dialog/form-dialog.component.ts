// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, Input } from '@angular/core';
import { SupplierContractPercentageService } from '../../supplierContractPercentage.service';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { SupplierContractPercentage } from '../../supplierContractPercentage.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
//import { EmployeeDropDown } from 'src/app/general/IEmployees';
import { OrganizationalEntityDropDown } from 'src/app/general/organizationalEntityDropDown.model';
import { DepartmentDropDown } from 'src/app/general/departmentDropDown.model';
import { DesignationDropDown } from 'src/app/general/designationDropDown.model';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { VehicleDropDown } from 'src/app/vehicle/vehicleDropDown.model';
import moment from 'moment';

@Component({
  standalone: false,
    selector: 'app-form-dialog',
    templateUrl: './form-dialog.component.html',
    styleUrls: ['./form-dialog.component.sass'],
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
  })

export class FormDialogComponentHolder {
  employeeID: number;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  public EmployeeList?: EmployeeDropDown[] = [];
  public OrganizationalEntityList?: OrganizationalEntityDropDown[] = [];
  public VehicleList?: VehicleDropDown[] = [];
  public DesginationList?: DesignationDropDown[] = [];
  isLoading: boolean = false;

  image: any;
  advanceTable: SupplierContractPercentage;
  applicableFrom: any;
  applicableTo: any;
  supplierName: any;
  // DesginationList: import("f:/NewRentnetAdmin/NewRentnetAdmin/RentnetAdmin/src/app/general/designationDropDown.model").DesignationDropDown[];
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponentHolder>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    public advanceTableService: SupplierContractPercentageService,
    private fb: FormBuilder,
    public _generalService: GeneralService) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = 'Percentage For';
      this.advanceTable = data.advanceTable;
      let fromDate = moment(this.advanceTable.fromDate).format('DD/MM/yyyy');
      let toDate = moment(this.advanceTable.toDate).format('DD/MM/yyyy');
      this.onBlurUpdateDateFromEdit(fromDate);
      this.onBlurUpdateDateToEdit(toDate);
    } else {
      this.dialogTitle = 'Percentage For';
      this.advanceTable = new SupplierContractPercentage({});
      this.advanceTable.activationStatus = true;

    }
    this.advanceTableForm = this.createContactForm();
    this.applicableFrom = data.ApplicableFrom;
    this.applicableTo = data.ApplicableTo;
    this.supplierName = data.SupplierName;
  }
  public ngOnInit(): void {
    this._generalService.GetVehicle().subscribe
      (
        data => {
          this.VehicleList = data;

        }
      );

  }
  formControl = new FormControl('',
    [
      Validators.required
      // Validators.email,
    ]);
  getErrorMessage() {
    return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('email')
        ? 'Not a valid email'
        : '';
  }

  createContactForm(): FormGroup {
    return this.fb.group(
      {
        supplierContractPercentageID: [this.advanceTable.supplierContractPercentageID],
        supplierContractID: [this.advanceTable.supplierContractID],
        fromDate: [this.advanceTable.fromDate, [Validators.required, this._generalService.dateValidator()]],
        toDate: [this.advanceTable.toDate, [Validators.required, this._generalService.dateValidator()]],
        supplierPercentage: [this.advanceTable.supplierPercentage,],
        activationStatus: [this.advanceTable.activationStatus],
      });
  }

  //start date
  onBlurUpdateDateFrom(value: string): void {
    value = this._generalService.resetDateiflessthan12(value);

    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm.get('fromDate')?.setValue(formattedDate);
    } else {
      this.advanceTableForm.get('fromDate')?.setErrors({ invalidDate: true });
    }
  }

  onBlurUpdateDateFromEdit(value: string): void {
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      if (this.action === 'edit') {
        this.advanceTable.fromDate = formattedDate
      }
      else {
        this.advanceTableForm.get('fromDate')?.setValue(formattedDate);
      }

    } else {
      this.advanceTableForm.get('fromDate')?.setErrors({ invalidDate: true });
    }
  }

  //end date
  onBlurUpdateDateTo(value: string): void {
    value = this._generalService.resetDateiflessthan12(value);

    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm.get('toDate')?.setValue(formattedDate);
    } else {
      this.advanceTableForm.get('toDate')?.setErrors({ invalidDate: true });
    }
  }

  onBlurUpdateDateToEdit(value: string): void {
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      if (this.action === 'edit') {
        this.advanceTable.toDate = formattedDate
      }
      else {
        this.advanceTableForm.get('toDate')?.setValue(formattedDate);
      }

    } else {
      this.advanceTableForm.get('toDate')?.setErrors({ invalidDate: true });
    }
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  submit() {
    // emppty stuff
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
    this.isLoading = true;
    this.advanceTableForm.patchValue({ supplierContractID: this.data.SupplierContractID });
    this.advanceTableService.add(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
        
    this.isLoading = false;
          this.dialogRef.close();

          this._generalService.sendUpdate('SupplierContractPercentageCreate:SupplierContractPercentageView:Success');//To Send Updates  
          if (this.data.lastid) {
            this.showNotification(
              'snackbar-success',
              'Organizational Entity Stake Holders Created Successfully...!!!',
              'bottom',
              'center'
            );
          }

        },
        error => {
          
    this.isLoading = false;
          this._generalService.sendUpdate('SupplierContractPercentageAll:SupplierContractPercentageView:Failure');//To Send Updates  
        }
      )
  }
  public Put(): void {
    
    this.isLoading = true;
    this.advanceTableForm.patchValue({ supplierContractID: this.advanceTable.supplierContractID });
    this.advanceTableService.update(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.isLoading = false;
          this.dialogRef.close();
          this._generalService.sendUpdate('SupplierContractPercentageUpdate:SupplierContractPercentageView:Success');//To Send Updates 

        },
        error => {
          
      this.isLoading = false;
          this._generalService.sendUpdate('SupplierContractPercentageAll:SupplierContractPercentageView:Failure');//To Send Updates  
        }
      )
  }
  messageReceived: string;
  MessageArray: string[] = [];
  private subscriptionName: Subscription; //important to create a subscription

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
  SubscribeUpdateService() {
    this.subscriptionName = this._generalService.getUpdate().subscribe
      (
        message => {
          //message contains the data sent from service
          this.messageReceived = message.text;
          this.MessageArray = this.messageReceived.split(":");

          if (this.MessageArray.length == 3) {
            if (this.MessageArray[0] == "SupplierContractPercentageCreate") {
              if (this.MessageArray[1] == "SupplierContractPercentageView") {
                if (this.MessageArray[2] == "Success") {
                  

                  this.showNotification(
                    'snackbar-success',
                    'Organizational Entity Stake Holders Created Successfully...!!!',
                    'bottom',
                    'center'
                  );
                }
              }
            }

          }
        }
      );
  }
  public confirmAdd(): void {
    if (this.action == "edit") {
      this.Put();
    }
    else {
      this.Post();
    }
  }
}



