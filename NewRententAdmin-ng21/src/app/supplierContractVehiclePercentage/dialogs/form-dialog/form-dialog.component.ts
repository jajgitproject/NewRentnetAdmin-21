// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, Input } from '@angular/core';
import { SupplierContractVehiclePercentageService } from '../../supplierContractVehiclePercentage.service';
import { FormControl, Validators, FormGroup, FormBuilder, ValidationErrors, ValidatorFn, AbstractControl} from '@angular/forms';
import { SupplierContractVehiclePercentage } from '../../supplierContractVehiclePercentage.model';
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
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import moment from 'moment';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogComponentHolder 
{
  employeeID:number;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  public EmployeeList?: EmployeeDropDown[] = [];
  public OrganizationalEntityList?: OrganizationalEntityDropDown[] = [];
  public VehicleList?: VehicleDropDown[] = [];
  public DesginationList?:DesignationDropDown[]=[];
  searchVehicle:FormControl = new FormControl();
   filteredVehicleOptions: Observable<VehicleDropDown[]>;
  
  image: any;
  advanceTable: SupplierContractVehiclePercentage;
  applicableFrom: any;
  applicableTo: any;
  supplierName: any;
  vehicleID: any;
  isLoading: boolean = false;

 // DesginationList: import("f:/NewRentnetAdmin/NewRentnetAdmin/RentnetAdmin/src/app/general/designationDropDown.model").DesignationDropDown[];
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponentHolder>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  private snackBar: MatSnackBar,
  public advanceTableService: SupplierContractVehiclePercentageService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Vehicle Percentage For';       
          this.advanceTable = data.advanceTable;
          this.searchVehicle.setValue(this.advanceTable.vehicle);
          let fromDate=moment(this.advanceTable.fromDate).format('DD/MM/yyyy');
          let toDate=moment(this.advanceTable.toDate).format('DD/MM/yyyy');
          this.onBlurUpdateDateValidFromEdit(fromDate);
          this.onBlurUpdateDateValidToEdit(toDate);
        } else 
        {
          this.dialogTitle = 'Vehicle Percentage For';
          this.advanceTable = new SupplierContractVehiclePercentage({});
          this.advanceTable.activationStatus=true;

        }
        this.advanceTableForm = this.createContactForm();
        this.applicableFrom=data.ApplicableFrom;
        this.applicableTo=data.ApplicableTo;
        this.supplierName=data.SupplierName;
  }
  public ngOnInit(): void
  { 
    this.InitVehicle();
    // this._generalService.GetVehicle().subscribe
    // (
    //   data =>   
    //   {
    //     this.VehicleList = data;
        
    //   }
    // );
 
  }
  vehicleValidator(VehicleList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = VehicleList.some(group => group.vehicle.toLowerCase() === value);
      return match ? null : { vehicleInvalid: true };
    };
  }

  InitVehicle() {
    this._generalService.GetVehicle().subscribe(
      data => {
        ;
        this.VehicleList = data;
        this.advanceTableForm.controls['vehicle'].setValidators([this.vehicleValidator(this.VehicleList)
        ]);
        this.advanceTableForm.controls['vehicle'].updateValueAndValidity();
        this.filteredVehicleOptions = this.advanceTableForm.controls['vehicle'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterVehicle(value || ''))
        );
        //console.log(this.StateList);
      },
      error => {

      }
    );
  }
 private _filterVehicle(value: string): any {
    const filterValue = value.toLowerCase();
    // Only show results if 3 or more characters are typed
    if (filterValue.length < 3) {
      return [];
    }
    return this.VehicleList.filter(
      customer => 
      {
        return customer.vehicle.toLowerCase().includes(filterValue);
      }
    );
  }
  onVehicleSelected(selectedVehicle: string) {
    const selectedValue = this.VehicleList.find(
      data => data.vehicle === selectedVehicle
    );
  
    if (selectedValue) {
      this.getvehicleID(selectedValue.vehicleID);
    }
  }

  getvehicleID(vehicleID: any) {
    this.vehicleID=vehicleID;
  }
  formControl = new FormControl('', 
  [
    Validators.required
    // Validators.email,
  ]);
  getErrorMessage() 
  {
      return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('email')
      ? 'Not a valid email'
      : '';
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      supplierContractVehiclePercentageID: [this.advanceTable.supplierContractVehiclePercentageID],
      supplierContractID: [this.advanceTable.supplierContractID],
      vehicleID: [this.advanceTable.vehicleID],
      vehicle: [this.advanceTable.vehicle],
      fromDate: [this.advanceTable.fromDate,[Validators.required, this._generalService.dateValidator()]],
      toDate: [this.advanceTable.toDate,[Validators.required, this._generalService.dateValidator()]],
      supplierPercentage: [this.advanceTable.supplierPercentage,],
      activationStatus: [this.advanceTable.activationStatus],
    });
  }

  
    //start date
    onBlurUpdateDateValidFrom(value: string): void {
      value= this._generalService.resetDateiflessthan12(value);
    
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
        this.advanceTableForm.get('fromDate')?.setValue(formattedDate);    
    } else {
      this.advanceTableForm.get('fromDate')?.setErrors({ invalidDate: true });
    }
  }
  
  
  onBlurUpdateDateValidFromEdit(value: string): void {  
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      if(this.action==='edit')
      {
        this.advanceTable.fromDate=formattedDate
      }
      else{
        this.advanceTableForm.get('fromDate')?.setValue(formattedDate);
      }
      
    } else {
      this.advanceTableForm.get('fromDate')?.setErrors({ invalidDate: true });
    }
  }
  
  
  //end date
  onBlurUpdateDateValidTo(value: string): void {
    value= this._generalService.resetDateiflessthan12(value);
  
  const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
  if (validDate) {
    const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm.get('toDate')?.setValue(formattedDate);    
  } else {
    this.advanceTableForm.get('toDate')?.setErrors({ invalidDate: true });
  }
  }
  
  onBlurUpdateDateValidToEdit(value: string): void {  
  const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
  if (validDate) {
    const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
    if(this.action==='edit')
    {
      this.advanceTable.toDate=formattedDate
    }
    else{
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

  submit() 
  {
    // emppty stuff
  }
  onNoClick(): void 
  {
    if(this.action==='add'){
      this.advanceTableForm.reset();

    }
    else if(this.action==='edit'){
      this.dialogRef.close();
    }
  }
  public Post(): void
  {
    this.isLoading = true;
    
    this.advanceTableForm.patchValue({supplierContractID:this.data.SupplierContractID});
    this.advanceTableForm.patchValue({vehicleID:this.vehicleID});
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
      this.isLoading = false;
      //debugger;
      this.dialogRef.close();
       
      this._generalService.sendUpdate('SupplierContractVehiclePercentageCreate:SupplierContractVehiclePercentageView:Success');//To Send Updates  
       if(this.data.lastid){
        this.showNotification(
          'snackbar-success',
          'Organizational Entity Stake Holders Created Successfully...!!!',
          'bottom',
          'center'
        );
       }

    },
    error =>
    {
      this.isLoading = false;
       this._generalService.sendUpdate('SupplierContractVehiclePercentageAll:SupplierContractVehiclePercentageView:Failure');//To Send Updates  
    }
  )
  }
  public Put(): void
  {
    this.isLoading = true;
    this.advanceTableForm.patchValue({supplierContractID:this.advanceTable.supplierContractID});
    this.advanceTableForm.patchValue({vehicleID:this.vehicleID || this.advanceTable.vehicleID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
      this.isLoading = false;
        this.dialogRef.close();
       this._generalService.sendUpdate('SupplierContractVehiclePercentageUpdate:SupplierContractVehiclePercentageView:Success');//To Send Updates 
         
    },
    error =>
    {
      this.isLoading = false;
     this._generalService.sendUpdate('SupplierContractVehiclePercentageAll:SupplierContractVehiclePercentageView:Failure');//To Send Updates  
    }
  )
  }
  messageReceived: string;
  MessageArray:string[]=[];
  private subscriptionName: Subscription; //important to create a subscription

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
  SubscribeUpdateService()
  {
    this.subscriptionName=this._generalService.getUpdate().subscribe
    (
      message => 
      { 
        //message contains the data sent from service
        this.messageReceived = message.text;
        this.MessageArray=this.messageReceived.split(":");
     
        if(this.MessageArray.length==3)
        {
          if(this.MessageArray[0]=="SupplierContractVehiclePercentageCreate")
          {
            if(this.MessageArray[1]=="SupplierContractVehiclePercentageView")
            {
              if(this.MessageArray[2]=="Success")
              {
                debugger;
          
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
  public confirmAdd(): void 
  {
       if(this.action=="edit")
       {
          this.Put();
       }
       else
       {
          this.Post();
       }
  }
}



