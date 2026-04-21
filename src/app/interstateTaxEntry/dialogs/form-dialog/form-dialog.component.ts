// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { InterstateTaxEntryService } from '../../interstateTaxEntry.service';
import { InterstateTaxEntry, VehicleInterstateTaxDetailsModel } from '../../interstateTaxEntry.model';
import { StatesDropDown } from 'src/app/organizationalEntity/stateDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { VehicleDropDown } from 'src/app/vehicle/vehicleDropDown.model';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { RegistrationDropDown } from '../../registrationDropDown.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import moment from 'moment';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogComponent 
{
  displayedColumns = [
    'registrationNumber',
    'state',
    'interStateTaxStartDate',
    'interStateTaxEndDate',
    'interStateTaxAmount',
  ];
  showError: string;
  PageNumber: number = 0;
  SearchActivationStatus : boolean=true; 
  public EmployeeList?: EmployeeDropDown[]=[];
  dataSource: VehicleInterstateTaxDetailsModel[] | null;
  public StatesList?: StatesDropDown[] = [];
  filteredStateOptions: Observable<StatesDropDown[]>;
  searchStateTerm: FormControl = new FormControl();
  filteredRegistrationNumberOptions:Observable<RegistrationDropDown[]>;
  public RegistrationNumberList?: RegistrationDropDown[] = [];
  public EmployeesList?: EmployeeDropDown[] = [];
  public VehicleList?: VehicleDropDown[] = [];
  filteredEmployeeOptions: Observable<EmployeeDropDown[]>;
  searchEmployee: FormControl = new FormControl();

  action: string;
  geoPointID: any;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: InterstateTaxEntry;
  geoPointStateID: any;
  inventoryID: any;
  paidByID: any;
  registrationNumber: string;
  redirectedFrom: any;
  stateID: any;
  state: any;
  saveDisabled: boolean = true;
  status: string = '';
  buttonDisabled: boolean = false;

  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  private snackBar: MatSnackBar,
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: InterstateTaxEntryService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        this.inventoryID=data.inventoryID;
        this.registrationNumber=data.registrationNumber;
        this.stateID=data.StateID;
        this.state=data.State;
        this.redirectedFrom=data.redirectedFrom;
        // Set the defaults
        this.action = data.action;
  // Extract and normalize status for gating
  // this.status = this.extractStatus(data?.status);
  // const normalized = (this.status || '').trim().toLowerCase();
  // this.buttonDisabled = normalized !== 'changes allow';
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Interstate Tax';       
          this.advanceTable = data.advanceTable;
          this.advanceTable.paidBy=this.advanceTable.firstName+' '+this.advanceTable.lastName;
          this.ImagePath=this.advanceTable.interStateTaxImage;
          let interStateTaxStartDate=moment(this.advanceTable.interStateTaxStartDate).format('DD/MM/yyyy');
          let interStateTaxEndDate=moment(this.advanceTable.interStateTaxEndDate).format('DD/MM/yyyy');
          let paidOn=moment(this.advanceTable.paidOn).format('DD/MM/yyyy');
          this.onBlurUpdateDateEdit(interStateTaxStartDate);
          this.onBlurUpdateEndDateEdit(interStateTaxEndDate);
          this.onBlurUpdateEndDateEdit(paidOn);
          
        } else 
        {
          this.dialogTitle = 'Interstate Tax';
          this.advanceTable = new InterstateTaxEntry({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
       
  }
  private extractStatus(input: any): string {
    try {
      if (typeof input === 'string') return input;
      if (input && typeof input.status === 'string') return input.status;
      if (input && input.status && typeof input.status.status === 'string') return input.status.status;
      return '';
    } catch { return ''; }
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  ngOnInit(){
    if(this.redirectedFrom==='Inventory')
    {
      this.advanceTableForm.patchValue({uploadedOn:new Date()})
      this.advanceTableForm.patchValue({inventoryID:this.inventoryID});
      this.advanceTableForm.patchValue({registrationNumber:this.registrationNumber});
      this.advanceTableForm.controls["registrationNumber"].disable();
    }
    if(this.redirectedFrom==='State')
      {
        this.advanceTableForm.patchValue({uploadedOn:new Date()})
        this.advanceTableForm.patchValue({geoPointID:this.stateID});
        this.advanceTableForm.patchValue({state:this.state});
        this.advanceTableForm.controls["state"].disable();
        
      }
    this.initVehicle();
    this.GetStates();
    this.InitRegistrationNumber();
    this.InitUploadedBy();
    this.InitEmployee();
  }

  initVehicle()
  {
    this._generalService.getVehicleBasedOnInventoryID(this.inventoryID || this.advanceTable.inventoryID).subscribe(
      data=>
        {
          this.VehicleList=data;
          this.advanceTableForm.patchValue({vehicle:this.VehicleList[0].vehicle});
        }
    );
  }

  // onDateChange()
  // {
  //   debugger;
  //   var startDate=moment(this.advanceTableForm.value.interStateTaxStartDate).format('yyyy-MM-DD');
  //   var interStateTaxEndDate=moment(this.advanceTableForm.value.interStateTaxEndDate).format('yyyy-MM-DD');
  //   this.advanceTableService.getTaxDetails(this.registrationNumber,this.geoPointStateID,startDate,interStateTaxEndDate,this.SearchActivationStatus, this.PageNumber).subscribe(
  //     data=>
  //       {
  //         this.dataSource=data;
  //       }
  //   );
  // }
  

  paidByValidator(list: any[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {

    if (!control.value) return null;

    const value = control.value
      ?.toString()
      .trim()
      .toLowerCase();

    const match = list.some(emp =>
      (emp.firstName + ' ' + emp.lastName)
        .toString()
        .trim()
        .toLowerCase() === value
    );

    return match ? null : { paidByInvalid: true };
  };
}

InitEmployee(){
  this._generalService.GetReportingManager().subscribe(
    data =>
    {
      this.EmployeesList = data;

      const control = this.advanceTableForm.get('paidBy');

      control?.setValidators([
        Validators.required,
        this.paidByValidator(this.EmployeesList)
      ]);

      control?.updateValueAndValidity();

      this.filteredEmployeeOptions = control?.valueChanges.pipe(
        startWith(""),
        map(value => this._filter(value || ''))
      ); 
    });
}

  
  private _filter(value: string): any {
  const filterValue = value.toLowerCase();

  // Only start filtering after typing 3 characters
  if (filterValue.length < 3) {
    return [];
  }

  return this.EmployeesList.filter(data => {
    const fullName = `${data.firstName} ${data.lastName}`.toLowerCase();
    return fullName.includes(filterValue);
  });
}

  // private _filter(value: string): any {
  //   const filterValue = value.toLowerCase();
  //   return this.EmployeesList.filter(
  //     data => 
  //     {
  //       //return customer.firstName.toLowerCase().includes(filterValue);
  //       const fullName = `${data.firstName} ${data.lastName}`.toLowerCase();
  //       return fullName.includes(filterValue);
  //     });
  // }
  OnPaidBySelect(selectedPaidBy: string)
  {
    const PaidByName = this.EmployeesList.find(
      data => `${data.firstName} ${data.lastName}` === selectedPaidBy
    );
    if (selectedPaidBy) 
    {
      this.getTitles(PaidByName.employeeID);
    }
  }
  getTitles(paidByID: any) {
    this.paidByID=paidByID;
  }

  InitUploadedBy()
  {
  this._generalService.getEmployeeID(this._generalService.getUserID()).subscribe(
    data=>
    {
      this.EmployeeList=data
      this.advanceTableForm.patchValue({uploadedByID: this.EmployeeList[0].employeeID});
      this.advanceTableForm.patchValue({uploadedBy: this.EmployeeList[0].firstName +" "+this.EmployeeList[0].lastName});
    }
  );
}

stateValidator(list: any[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {

    if (!control.value) return null;

    const value = control.value
      ?.toString()
      .trim()
      .toLowerCase();

    const match = list.some(item =>
      item.geoPointName
        ?.toString()
        .trim()
        .toLowerCase() === value
    );

    return match ? null : { stateInvalid: true };
  };
}

GetStates(){
  this._generalService.GetStatesAl().subscribe(
    data =>
    {
      this.StatesList = data;  

      const control = this.advanceTableForm.get('state');

      control?.setValidators([
        Validators.required,
        this.stateValidator(this.StatesList)
      ]);

      control?.updateValueAndValidity();

      this.filteredStateOptions = control?.valueChanges.pipe(
        startWith(""),
        map(value => this._filterState(value || ''))
      );              
    }
  );
}


    private _filterState(value: string): any {
  const filterValue = value.toLowerCase();

  // Only start filtering after typing 3 characters
  if (filterValue.length < 3) {
    return [];
  }

  return this.StatesList.filter(customer =>
    customer.geoPointName.toLowerCase().includes(filterValue)
  );
}

    // private _filterState(value: string): any {
    // const filterValue = value.toLowerCase();
    // return this.StatesList.filter(
    //   customer =>
    //   {
    //     return customer.geoPointName.toLowerCase().includes(filterValue);
    //   });
    // }
  OnStateSelect(selectedState: string)
  {
    const StateName = this.StatesList.find(
      data => data.geoPointName === selectedState
    );
    if (selectedState) 
    {
      this.getStateID(StateName.geoPointID);
    }
  }
    getStateID(geoPointID: any) 
    {
    this.geoPointStateID=geoPointID;
    this.advanceTableForm.patchValue({geoPointID:this.geoPointStateID});
    }


    registrationValidator(list: any[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {

    if (!control.value) return null;

    const value = control.value
      ?.toString()
      .trim()
      .toLowerCase();

    const match = list.some(item =>
      item.registrationNumber
        ?.toString()
        .trim()
        .toLowerCase() === value
    );

    return match ? null : { registrationInvalid: true };
  };
}


    InitRegistrationNumber(){
      this._generalService.GetRegistrationForDropDown().subscribe(
        data=>
        {
          this.RegistrationNumberList=data;
          this.filteredRegistrationNumberOptions = this.advanceTableForm.controls['registrationNumber'].valueChanges.pipe(
            startWith(""),
            map(value => this._filterRN(value || ''))
          ); 
        });
    }

    
    private _filterRN(value: string): any {
      const filterValue = value.toLowerCase();
      return this.RegistrationNumberList.filter(
        customer => 
        {
          return customer.registrationNumber.toLowerCase().includes(filterValue);
        });
    }
  OnRegNoSelect(selectedRegNo: string)
  {
    const RegNoName = this.RegistrationNumberList.find(
      data => data.registrationNumber === selectedRegNo
    );
    if (selectedRegNo) 
    {
      this.getInventoryID(RegNoName.inventoryID);
    }
  }
    
    getInventoryID(inventoryID: any,) {
      this.inventoryID=inventoryID;
      this.advanceTableForm.patchValue({inventoryID:this.inventoryID});
      this.initVehicle();
    }

    onRNkeyup(event:any)
    {
      if(event.keyCode===8){
        this.advanceTableForm.controls['vehicle'].setValue('');
       }
    }

    // GetVehicle() {
    //   this._generalService.GetVehicleByRegistrationNumber(this.vehicle).subscribe(
    //     data => {
    //       this.CarList = data;
    //       this.advanceTableForm.patchValue({ vehicle: this.advanceTable.vehicle });
          
    //     }
    //   );
    // }
    
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      interstateTaxID: [this.advanceTable.interstateTaxID],
      inventoryID: [this.advanceTable.inventoryID],
      vehicle:[this.advanceTable.vehicle],
      registrationNumber:[this.advanceTable.registrationNumber],
      geoPointID: [this.advanceTable.geoPointID],
      state: [this.advanceTable.state],
      amount: [this.advanceTable.amount],
      interStateTaxStartDate: [this.advanceTable.interStateTaxStartDate],
      interStateTaxEndDate: [this.advanceTable.interStateTaxEndDate],
      paidOn: [this.advanceTable.paidOn],
      paidByID: [this.advanceTable.paidByID],
      paidBy:[this.advanceTable.paidBy],
      uploadedOn: [this.advanceTable.uploadedOn],
      uploadedByID: [this.advanceTable.uploadedByID],
      uploadedBy:[this.advanceTable.uploadedBy],
      interStateTaxImage: [this.advanceTable.interStateTaxImage],
      activationStatus: [this.advanceTable.activationStatus],
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}

  submit() 
  {
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

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

  onCarTypeChange(event:any){
    if(event.keyCode===8){
     this.advanceTableForm.controls['vehicle'].setValue('');
    }
   }
  public Post(): void
  {
    
    this.advanceTableForm.patchValue({paidByID:this.paidByID});
   
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
     
      this.dialogRef.close(response);
      this._generalService.sendUpdate('InterstateTaxEntryCreate:InterstateTaxEntryView:Success');//To Send Updates 
      this.saveDisabled = true; 
      this.showNotification(
       'snackbar-success',
       'Interstate Tax Entry Created...!!!',
       'bottom',
       'center'
     );
    
  },
    error =>
    {
      this._generalService.sendUpdate('InterstateTaxEntryAll:InterstateTaxEntryView:Failure');
      this.saveDisabled = true; 
      this.showNotification(
        'snackbar-danger',
        'Operation Failed.....!!!',
        'bottom',
        'center'
      ); 
    }
  )
  }
  public Put(): void
  {
    this.advanceTableForm.patchValue({paidByID:this.paidByID || this.advanceTable.paidByID});
    this.advanceTableForm.patchValue({inventoryID:this.inventoryID || this.advanceTable.inventoryID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
    
        this.dialogRef.close();
        this._generalService.sendUpdate('InterstateTaxEntryUpdate:InterstateTaxEntryView:Success');
        this.saveDisabled = true; 
        this.showNotification(
          'snackbar-success',
          'Interstate Tax Entry Updated...!!!',
          'bottom',
          'center'
        );
       
    },
    error =>
    {
      this._generalService.sendUpdate('InterstateTaxEntryAll:InterstateTaxEntryView:Failure');
      this.saveDisabled = true; 
      this.showNotification(
        'snackbar-danger',
        'Operation Failed.....!!!',
        'bottom',
        'center'
      );   
    }
  )
  }
  public confirmAdd(): void 
  {
  //  if (this.buttonDisabled) {
  //   return; // blocked by status
  //  }
   this.saveDisabled = false;
       if(this.action=="edit")
       {
          this.Put();
       }
       else
       {
          this.Post();
       }
  }

  /////Image////
  public response: { dbPath: '' };
  public ImagePath: string = "";

  public uploadFinishedSelfie = (event) => 
  {
    this.response = event;
    this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({interStateTaxImage:this.ImagePath})
  }

  NextCall()
  {
    if (this.dataSource.length>0) 
    {
      this.PageNumber++;
      //this.onDateChange();
    }
  }
  PreviousCall()
  {
    if(this.PageNumber>0)
    {
      this.PageNumber--;
      //this.onDateChange(); 
    } 
  }

  //start date
onBlurUpdateDate(value: string): void {
  value= this._generalService.resetDateiflessthan12(value);

const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
if (validDate) {
  const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
    this.advanceTableForm.get('interStateTaxStartDate')?.setValue(formattedDate);    
} else {
  this.advanceTableForm.get('interStateTaxStartDate')?.setErrors({ invalidDate: true });
}
}

onBlurUpdateDateEdit(value: string): void {  
const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
if (validDate) {
  const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
  if(this.action==='edit')
  {
    this.advanceTable.interStateTaxStartDate=formattedDate
  }
  else{
    this.advanceTableForm.get('interStateTaxStartDate')?.setValue(formattedDate);
  }
  
} else {
  this.advanceTableForm.get('interStateTaxStartDate')?.setErrors({ invalidDate: true });
}
}

//end date
onBlurUpdateEndDate(value: string): void {
value= this._generalService.resetDateiflessthan12(value);

const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
if (validDate) {
const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
  this.advanceTableForm.get('interStateTaxEndDate')?.setValue(formattedDate);    
} else {
this.advanceTableForm.get('interStateTaxEndDate')?.setErrors({ invalidDate: true });
}
}

onBlurUpdateEndDateEdit(value: string): void {  
const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
if (validDate) {
const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
if(this.action==='edit')
{
  this.advanceTable.interStateTaxEndDate=formattedDate
}
else{
  this.advanceTableForm.get('interStateTaxEndDate')?.setValue(formattedDate);
}

} else {
this.advanceTableForm.get('interStateTaxEndDate')?.setErrors({ invalidDate: true });
}

}

//end date
onBlurUpdatepaidOnEndDate(value: string): void {
  value= this._generalService.resetDateiflessthan12(value);
  
  const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
  if (validDate) {
  const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
    this.advanceTableForm.get('paidOn')?.setValue(formattedDate);    
  } else {
  this.advanceTableForm.get('paidOn')?.setErrors({ invalidDate: true });
  }
  }
  
  onBlurUpdateEndpaidOnDateEdit(value: string): void {  
  const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
  if (validDate) {
  const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
  if(this.action==='edit')
  {
    this.advanceTable.paidOn=formattedDate
  }
  else{
    this.advanceTableForm.get('paidOn')?.setValue(formattedDate);
  }
  
  } else {
  this.advanceTableForm.get('paidOn')?.setErrors({ invalidDate: true });
  }

  }
}



