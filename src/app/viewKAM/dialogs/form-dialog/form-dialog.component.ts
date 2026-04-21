// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { ViewKAMService } from '../../viewKAM.service';
import { FormControl, Validators, FormGroup, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewKAM } from '../../viewKAM.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { CommonModule, formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { ViewKAMDropDown } from '../../viewKAMDropDown.model';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import { QualificationDropDown } from 'src/app/general/qualificationDropDown.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CustomerNameModel } from 'src/app/customer/customer.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
@Component({
  standalone: true,
  selector: 'app-viewkam-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogComponent 
{
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: ViewKAM;
  customerNameModel:CustomerNameModel
  fName = '';
  contents: any[];
  mydata = [];
  name = '';
  dataSource: ViewKAM[] | null;
  public ViewKAMList?: ViewKAMDropDown[] = [];
  SearchViewKAMName: string = '';
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;

  image: any;
  fileUploadEl: any;
  FirstName: any;
  customerName: any;
  customerID: any;
 
  constructor(
    public  viewKAMService: ViewKAMService,
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  public route:ActivatedRoute,
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: ViewKAMService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          //this.dialogTitle ='Edit ViewKAM';       
          this.dialogTitle ='ViewKAM';
          this.advanceTable = data.advanceTable;
          this.customerID = this.advanceTable.customerID;
        } else 
        {
          this.dialogTitle = 'Key Account Manager ';
          this.advanceTable = new ViewKAM({});
          this.advanceTable.activationStatus=true;
          
        }
        this.advanceTableForm = this.createContactForm();
        this.customerID = data.advanceTable.customerID;
        //this.customerName=data.advanceTable.customerCustomerGroup.split('-')[0];
  }
  public ngOnInit(): void
  {
    this.getCustomer();
     this.loadData();
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
  public loadData() 
   {
    
      this.viewKAMService.getTableData(this.customerID,this.SearchViewKAMName,this.SearchActivationStatus, this.PageNumber).subscribe
    (
      (data :any) =>   
      {

        this.dataSource = data;        
      },
      (error: HttpErrorResponse) => 
      { 
         
        this.dataSource = null;
      }
    );
  }

  public getCustomer() 
   {
    
      this.viewKAMService.getCustomer(this.customerID).subscribe
    (
      (data :any) =>   
      {

        this.customerNameModel = data;       
        this.customerName= this.customerNameModel.customerName
      },
      (error: HttpErrorResponse) => 
      { 
         
        this.dataSource = null;
      }
    );
  }

  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      customerID: [this.advanceTable.customerID],
      CustomerKeyAccountManagerID: [this.advanceTable.CustomerKeyAccountManagerID],
      employeeID: [this.advanceTable.employeeID],
      serviceDescription: [this.advanceTable.serviceDescription],
      fromDate: [this.advanceTable.fromDate],
      endDate: [this.advanceTable.endDate],
      attachmentStatus: [this.advanceTable.attachmentStatus],
      firstName: [this.advanceTable.firstName],
      lastName:[this.advanceTable.lastName],
      mobile: [this.advanceTable.mobile],
      email: [this.advanceTable.email],
     
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
  public Post(): void
  {
    this.advanceTableForm.patchValue({ customerID:this.data.customerID });
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('ViewKAMCreate:ViewKAMView:Success');//To Send Updates  
    
    },
    error =>
    {
       this._generalService.sendUpdate('ViewKAMAll:ViewKAMView:Failure');//To Send Updates  
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
       this._generalService.sendUpdate('ViewKAMUpdate:ViewKAMView:Success');//To Send Updates  
       
    },
    error =>
    {
     this._generalService.sendUpdate('ViewKAMAll:ViewKAMView:Failure');//To Send Updates  
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
  
  public uploadFinished = (event) => 
  {
    this.response = event;
    this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({image:this.ImagePath})
  }

  // public fileChanged(event?: UIEvent): void {
  //   const files: FileList = this.fileUploadEl.nativeElement.files;

  //   const file = files[0];
  //   const reader = new FileReader();
  //   const loaded = (el) => {
  //     const contents = el.target.result;
  //     this.contents = contents;
  //   }
  //   reader.onload = loaded;
  //   reader.readAsText(file, 'UTF-8');
  //   this.name = file.name;
  // }

  // onSelectFile(event) {
  //   const files = event.target.files;
  //   if (files) {
  //     for (const file of files) {
  //       const reader = new FileReader();
  //       reader.onload = (e: any) => {
  //         if (file.type.indexOf('image') > -1) {
  //           this.mydata.push({
  //             url: e.target.result,
  //             type: 'img',
  //           });
  //         } else if (file.type.indexOf('video') > -1) {
  //           this.mydata.push({
  //             url: e.target.result,
  //             type: 'video',
  //           });
  //         } else if (file.type.indexOf('pdf') > -1) {
  //           this.mydata.push({
  //             url: e.target.result,
  //             type: 'pdf',
  //           });
  //         }
  //       };
  //       reader.readAsDataURL(file);
  //     }
  //   }
  // }

/////////////////for Image Upload ends////////////////////////////

// Only Numbers with Decimals
// keyPressNumbersDecimal(event) {
//   var charCode = (event.which) ? event.which : event.keyCode;
//   if (charCode != 46 && charCode > 31
//     && (charCode < 48 || charCode > 57)) {
//     event.preventDefault();
//     return false;
//   }
//   return true;
// }

// Only AlphaNumeric
// keyPressAlphaNumeric(event) {

//   var inp = String.fromCharCode(event.keyCode);

//   if (/[a-zA-Z]/.ViewKAM(inp)) {
//     return true;
//   } else {
//     event.preventDefault();
//     return false;
//   }
// }

}


