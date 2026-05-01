// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { PackageTypeService } from '../../packageType.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { PackageType } from '../../packageType.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { PackageTypeDropDown } from '../../packageTypeDropDown.model';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import { ServiceTypeDropDown } from 'src/app/general/serviceTypeDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
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
  advanceTable: PackageType;
  fName = '';
  contents: any[];
  mydata = [];
  name = '';
 
  public ServiceTypeList?: ServiceTypeDropDown[] = [];
  filteredServiceTypeOptions: Observable<ServiceTypeDropDown[]>;
  searchServiceType: FormControl = new FormControl();
  serviceTypeID: any;
  image: any;
  fileUploadEl: any;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: PackageTypeService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          //this.dialogTitle ='Edit Package Type';
          this.dialogTitle ='Package Type';       
          this.advanceTable = data.advanceTable;
          this.searchServiceType.setValue(this.advanceTable.serviceType);
         
        } else 
        {
          //this.dialogTitle = 'Create Package Type';
          this.dialogTitle = 'Package Type';
          this.advanceTable = new PackageType({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
  }
  public ngOnInit(): void
  {
    this.InitServiceTypes();

    // this._generalService.GetServiceType().subscribe
    // (
    //   data =>   
    //   {
    //     this.ServiceTypeList = data;
     
    //   }
    // );
  }

  InitServiceTypes(){
    this._generalService.GetServiceType().subscribe(
      data=>
      {
        this.ServiceTypeList=data;
        this.filteredServiceTypeOptions = this.searchServiceType.valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        ); 
      });
  }
  
  private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    return this.ServiceTypeList.filter(
      customer => 
      {
        return customer.serviceType.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }
  
  getTitles(serviceTypeID: any) {
    
    this.serviceTypeID=serviceTypeID;
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
      packageTypeID: [this.advanceTable.packageTypeID],
      serviceTypeID: [this.advanceTable.serviceTypeID],
      packageType: [this.advanceTable.packageType],
      oldRentNetDuty_Type: [this.advanceTable.oldRentNetDuty_Type],
      serviceType: [this.advanceTable.serviceType],
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
    // emppty stuff
  }
  onNoClick(): void 
  {
    if(this.action==='add')
    {
      this.advanceTableForm.reset();
    }
    else if(this.action==='edit')
    {
      this.dialogRef.close();
    }  
   
  }
  public Post(): void
  {
    this.advanceTableForm.patchValue({serviceTypeID:this.serviceTypeID})
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
     
        this.dialogRef.close();
       this._generalService.sendUpdate('PackageTypeCreate:PackageTypeView:Success');//To Send Updates  
    
  },
    error =>
    {
       this._generalService.sendUpdate('PackageTypeAll:PackageTypeView:Failure');//To Send Updates  
    }
  )
  }
  public Put(): void
  {
    
    this.advanceTableForm.patchValue({serviceTypeID:this.serviceTypeID || this.advanceTable.serviceTypeID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
    
        this.dialogRef.close();
       this._generalService.sendUpdate('PackageTypeUpdate:PackageTypeView:Success');//To Send Updates  
       
    },
    error =>
    {
     this._generalService.sendUpdate('PackageTypeAll:PackageTypeView:Failure');//To Send Updates  
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
  // OnPackageTypeChangeGetcurrencies()
  // {
  //   this._generalService.GetCurrencies(this.advanceTableForm.get("nativeCurrencyID").value).subscribe(
  //     data =>
  //      {
  //       this.CurrencyList = data;
  //      },
  //      error =>
  //      {
  //      }
  //   );
  // }

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
keyPressNumbersDecimal(event) {
  var charCode = (event.which) ? event.which : event.keyCode;
  if (charCode != 46 && charCode > 31
    && (charCode < 48 || charCode > 57)) {
    event.preventDefault();
    return false;
  }
  return true;
}

// Only AlphaNumeric
keyPressAlphaNumeric(event) {

  var inp = String.fromCharCode(event.keyCode);

  if (/[a-zA-Z]/.test(inp)) {
    return true;
  } else {
    event.preventDefault();
    return false;
  }
}

keyPress(event) {

  var inp = String.fromCharCode(event.keyCode);

  if (/[a-zA-Z]/.test(inp)) {
    return true;
  } else {
    event.preventDefault();
    return false;
  }
}
}


