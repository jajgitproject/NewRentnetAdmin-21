// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { DisputeResolutionService } from '../../disputeResolution.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { DisputeResolution } from '../../disputeResolution.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CustomerDropDown } from '../../customerDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import moment from 'moment';
@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogComponent 
{
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: DisputeResolution;
  fName = '';
  contents: any[];
  mydata = [];
  name = '';
  isLoading: boolean = false;
  disableDateTime: boolean = true;

   public CustomerList?: CustomerDropDown[] = [];
   filteredCustomerOptions: Observable<CustomerDropDown[]>;
   searchCustomer: FormControl = new FormControl();

  image: any;
  fileUploadEl: any;
  customerID: any;
  disputeID: any;
    public EmployeeList?: EmployeeDropDown[]=[];
  reservationID: any;
  verifyDutyStatusAndCacellationStatus: any;
  isSaveAllowed: boolean = false;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: DisputeResolutionService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        this.verifyDutyStatusAndCacellationStatus = data.verifyDutyStatusAndCacellationStatus;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Dispute Resolution'; 
          

          this.disputeID = data.disputeID;
          this.reservationID = data.reservationID;
          
          // this.VehicleCategory = data.vehicleCategory;      
          this.advanceTable = data.advanceTable;
          // this.searchCustomer.setValue(this.advanceTable.customerName);
        } else 
        {
          
          this.dialogTitle = 'Dispute Resolution';
          this.advanceTable = new DisputeResolution({});
          this.advanceTable.activationStatus=true;
          this.disputeID = data.disputeID;
          this.reservationID = data.reservationID;
        }
        this.advanceTableForm = this.createContactForm();
        if (this.verifyDutyStatusAndCacellationStatus !== 'Changes allow') 
        {
          this.isSaveAllowed = true;
        } 
        else
        {
          this.isSaveAllowed = false;
        }
  }
  public ngOnInit(): void
  {
    
    this.InitApprovedBy();
    this.InitCustomer();
  }

  InitCustomer(){
    this._generalService.GetCustomers().subscribe(
      data=>
      {
        this.CustomerList=data;
        this.filteredCustomerOptions = this.searchCustomer.valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        ); 
      });
  }
  
  private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    return this.CustomerList.filter(
      customer => 
      {
        return customer.customerName.toLowerCase().includes(filterValue);
      }
    );
  }
  onCustomerSelected(selectedCustomer: string) {
    const selectedValue = this.CustomerList.find(
      data => data.customerName === selectedCustomer
    );
  
    if (selectedValue) {
      this.getTitles(selectedValue.customerID);
    }
  }
  getTitles(customerID: any) {
    
    this.customerID=customerID;
  }
  // InitCustomer(){
  //   this._generalService.GetCustomers().subscribe(
  //     data=>{
  //       this.CustomerList=data;
  //     }
  //   )
  // }

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
      disputeResolutionID: [this.advanceTable.disputeResolutionID],
      actionTakenDate: [this.advanceTable.actionTakenDate],
      actionTakenTime: [this.advanceTable.actionTakenTime],
      actionTaken: [this.advanceTable.actionTaken],
      actionTakenByID: [this.advanceTable.actionTakenByID],
      disputeID: [this.advanceTable.disputeID],
      activationStatus: [this.advanceTable.activationStatus]
    });
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
  reset(): void 
  {
    this.advanceTableForm.reset();
  }
  onNoClick():void
  {
    this.dialogRef.close();
  }
  public Post(): void
  {
    this.isLoading = true;
  
    // this.advanceTableForm.patchValue({customerID:this.customerID})
    this.advanceTableForm.patchValue({disputeID:this.disputeID});
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
      this.isLoading = false;
        this.dialogRef.close();
       this._generalService.sendUpdate('DisputeResolutionCreate:DisputeResolutionView:Success');//To Send Updates  
    
    },
    error =>
    {
      this.isLoading = false;
       this._generalService.sendUpdate('DisputeResolutionAll:DisputeResolutionView:Failure');//To Send Updates  
    }
  )
  }
  public Put(): void
  {
    this.isLoading = true;
    // this.advanceTableForm.patchValue({customerID:this.customerID || this.advanceTable.customerID});
    this.advanceTableForm.patchValue({disputeID:this.disputeID || this.advanceTable.disputeID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {  
      this.isLoading = false;
        
      this.dialogRef.close();
       this._generalService.sendUpdate('DisputeResolutionUpdate:DisputeResolutionView:Success');//To Send Updates  
       
    },
    error =>
    {
      this.isLoading = false;
     this._generalService.sendUpdate('DisputeResolutionAll:DisputeResolutionView:Failure');//To Send Updates  
    }
  )
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
  
  keyPressNumbersDecimal(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  /////////////////for Image Upload////////////////////////////
  public response: { dbPath: '' };
  public ImagePath: string = "";
  
  public uploadFinished = (event) => 
  {
    this.response = event;
    this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({image:this.ImagePath})
  }

  InitApprovedBy()
  {
    this._generalService.getEmployeeID(this._generalService.getUserID()).subscribe(
      data=>
      {
        this.EmployeeList=data
        this.advanceTableForm.patchValue({actionTakenByID: this.EmployeeList[0].employeeID});
        this.advanceTableForm.patchValue({actionTakenByName: this.EmployeeList[0].firstName +" "+this.EmployeeList[0].lastName});
      }
    );
  }

  onTimeInput(event: any): void {
    const inputValue = event.target.value;
  
    // Attempt to parse the input as a valid time
    const parsedTime = new Date(`1970-01-01T${inputValue}`);
  
    // Check if the parsedTime is valid
    if (!isNaN(parsedTime.getTime())) {
        this.advanceTableForm.get('actionTakenTime').setValue(parsedTime);
    }
  }

   //start date
    onBlurdateOfLeaving(value: string): void {
      debugger;
      value= this._generalService.resetDateiflessthan12(value);
    
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
        this.advanceTableForm.get('actionTakenDate')?.setValue(formattedDate);    
    } else {
      if(value===""){
      this.advanceTableForm.controls['actionTakenDate'].setValue('');
      }
      else{
        this.advanceTableForm?.get('actionTakenDate')?.setErrors({ invalidDate: true });
      }
      
    }

  }
}



