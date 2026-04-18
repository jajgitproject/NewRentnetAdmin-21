// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { CustomerBlockingService } from '../../customerBlocking.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { CustomerBlocking } from '../../customerBlocking.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import { QualificationDropDown } from 'src/app/general/qualificationDropDown.model';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
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
  advanceTable: CustomerBlocking;
  image: any;
  fileUploadEl: any;
  CustomerID:number;
  
  public EmployeeList?: EmployeeDropDown[]=[];
  CustomerName: any;

  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: CustomerBlockingService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Unblock';       
          this.advanceTable = data.advanceTable;
          this.ImagePath1=this.advanceTable.unblockAttachment;
          this.unblockedByName();
          this.blockedByName();
        } else 
        {
          this.dialogTitle = 'Block';
          this.advanceTable = new CustomerBlocking({});
          this.blockedByName();
        }
        this.advanceTableForm = this.createContactForm();
        this.CustomerID=this.data.CustomerID;
        this.CustomerName=this.data.CustomerName;
  }
  public ngOnInit(): void
  {

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
      customerBlockingID: [this.advanceTable.customerBlockingID],
      customerID: [this.advanceTable.customerID],
      blockDate: [this.advanceTable.blockDate],
      reasonofBlocking: [this.advanceTable.reasonofBlocking],
      blockedByID: [this.advanceTable.blockedByID],
      blockedBy: [this.advanceTable.blockedBy],
      blockAttachment: [this.advanceTable.blockAttachment],
      unblockDate: [this.advanceTable.unblockDate],
      reasonofUnblocking: [this.advanceTable.reasonofUnblocking],
      unblockedByID: [this.advanceTable.unblockedByID],
      unblockedBy: [this.advanceTable.unblockedBy],
      unblockAttachment: [this.advanceTable.unblockAttachment]
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}

blockedByName(){
  this._generalService.getEmployeeID(this._generalService.getUserID()).subscribe(
    data=>{
      this.EmployeeList=data;
      this.advanceTableForm.patchValue({blockedBy:this.EmployeeList[0].firstName+' '+this.EmployeeList[0].lastName});
    }
  );
}

unblockedByName(){
  this._generalService.getEmployeeID(this._generalService.getUserID()).subscribe(
    data=>{
      this.EmployeeList=data;
      this.advanceTableForm.patchValue({unblockedBy:this.EmployeeList[0].firstName+' '+this.EmployeeList[0].lastName});
    }
  );
}

  submit() 
  {
    // emppty stuff
  }

  onNoClick(action: string) {
    if(action === 'add') {
      this.advanceTableForm.reset();
      this.ImagePath="";
    } else {
      this.dialogRef.close();
    }
  }
  reset(): void 
  {
    this.advanceTableForm.reset();
  }
  public Post(): void
  {
    this.advanceTableForm.patchValue({customerID:this.CustomerID});
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('CustomerBlockingCreate:CustomerBlockingView:Success');//To Send Updates  
    
    },
    error =>
    {
       this._generalService.sendUpdate('CustomerBlockingAll:CustomerBlockingView:Failure');//To Send Updates  
    }
  )
  }
  public Put(): void
  {
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('CustomerBlockingUpdate:CustomerBlockingView:Success');//To Send Updates  
       
    },
    error =>
    {
     this._generalService.sendUpdate('CustomerBlockingAll:CustomerBlockingView:Failure');//To Send Updates  
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
  
  /////////////////for Image Upload////////////////////////////
  public response: { dbPath: '' };
  public ImagePath: string = "";
  public ImagePath1: string = "";
  
  public uploadFinishedDoc = (event) => 
  {
    this.response = event;
    this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({blockAttachment:this.ImagePath})
  }

  public uploadFinished = (event) => 
  {
    this.response = event;
    this.ImagePath1 = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({unblockAttachment:this.ImagePath1})
  }
}


