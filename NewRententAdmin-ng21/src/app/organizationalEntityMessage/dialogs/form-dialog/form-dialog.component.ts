// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { OrganizationalEntityMessageService } from '../../organizationalEntityMessage.service';
import { FormControl, Validators, FormGroup, FormBuilder, AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import { OrganizationalEntityMessage } from '../../organizationalEntityMessage.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import { QualificationDropDown } from 'src/app/general/qualificationDropDown.model';
import { OrganizationalEntityTypeDropDown } from '../../organizationalEntityTypeDropDown.model';
import { OrganizationalEntityDropDown } from '../../organizationalEntityDropDown.model';
import { MessageTypeDropDown } from '../../messageTypeDropDown.model';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
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
  advanceTable: OrganizationalEntityMessage;
  fName = '';
  contents: any[];
  mydata = [];
  name = '';
 
  public OrganizationalEntityTypeList?: OrganizationalEntityTypeDropDown[] = [];
  public OrganizationalEntityList?: OrganizationalEntityDropDown[] = [];
  public MessageTypeList?: MessageTypeDropDown[] = [];
  filteredMessageTypeOptions: Observable<MessageTypeDropDown[]>;
  searchMessageType: FormControl = new FormControl();
  filteredOrganizationalEntityOptions: Observable<OrganizationalEntityDropDown[]>;
  searchOrganizationalEntity: FormControl = new FormControl();
  image: any;
  fileUploadEl: any;
  organizationalEntityType: string;
  messageTypeID: any;
  organizationalEntityID: any;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: OrganizationalEntityMessageService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          //this.dialogTitle ='Edit Organizational Entity Message';       
          this.dialogTitle ='Organizational Entity Message';
          this.advanceTable = data.advanceTable;
          this.searchOrganizationalEntity.setValue(this.advanceTable.recipients);
          this.searchMessageType.setValue(this.advanceTable.messageType);
          this.organizationalEntityType=this.advanceTable.organizationalEntityType;
        } else 
        {
          //this.dialogTitle = 'Create Organizational Entity Message';
          this.dialogTitle = 'Organizational Entity Message';
          this.advanceTable = new OrganizationalEntityMessage({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
  }
  public ngOnInit(): void
  {
    this.InitOrganizationalEntity();
    this.InitMessageType();
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
      organizationalEntityMessageID: [this.advanceTable.organizationalEntityMessageID],
      organizationalEntityID: [this.advanceTable.organizationalEntityID],
      organizationalEntityType:[this.organizationalEntityType],
      searchOrganizationalEntity:[this.advanceTable.recipients],
      searchMessageType:[this.advanceTable.messageType],
      message: [this.advanceTable.message],
      messageTypeID: [this.advanceTable.messageTypeID],
      startDate: [this.advanceTable.startDate],
      endDate: [this.advanceTable.endDate],
      includeChildren: [this.advanceTable.includeChildren],
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
  reset(){
    this.advanceTableForm.reset();
  }
  onNoClick()
  {
    this.dialogRef.close();
  }
  public Post(): void
  {
    this.advanceTableForm.patchValue({organizationalEntityID:this.organizationalEntityID});
    this.advanceTableForm.patchValue({messageTypeID:this.messageTypeID});
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('OrganizationalEntityMessageCreate:OrganizationalEntityMessageView:Success');//To Send Updates  
    
    },
    error =>
    {
       this._generalService.sendUpdate('OrganizationalEntityMessageAll:OrganizationalEntityMessageView:Failure');//To Send Updates  
    }
  )
  }
  public Put(): void
  {
    this.advanceTableForm.patchValue({organizationalEntityID:this.organizationalEntityID  ||this.advanceTable.organizationalEntityID});
    this.advanceTableForm.patchValue({messageTypeID:this.messageTypeID  ||this.advanceTable.messageTypeID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('OrganizationalEntityMessageUpdate:OrganizationalEntityMessageView:Success');//To Send Updates  
       
    },
    error =>
    {
     this._generalService.sendUpdate('OrganizationalEntityMessageAll:OrganizationalEntityMessageView:Failure');//To Send Updates  
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

  // InitOrganizationalEntity(){
  //   this._generalService.GetOrganizationalEntity().subscribe(
  //     data=>{
  //       this.OrganizationalEntityList=data;
  //     }
  //   )
  // }

  // InitMessageType(){
  //   this._generalService.GetMessageType().subscribe(
  //     data=>{
  //       this.MessageTypeList=data;
  //     }
  //   )
  // }
  InitOrganizationalEntity(){
    this._generalService.GetOrganizationalEntity().subscribe(
      data=>
      {
        this.OrganizationalEntityList=data;
        this.advanceTableForm.controls['searchOrganizationalEntity'].setValidators([Validators.required,
          this.organizationalEntityValidator(this.MessageTypeList)]);
        this.advanceTableForm.controls['searchOrganizationalEntity'].updateValueAndValidity();
        this.filteredOrganizationalEntityOptions = this.advanceTableForm.controls['searchOrganizationalEntity'].valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        ); 
      });
  }
  
  private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    return this.OrganizationalEntityList.filter(
      customer => 
      {
        return customer.organizationalEntityName.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }
  getTitles(organizationalEntityID: any) {
    this.organizationalEntityID=organizationalEntityID;
  }


  
  organizationalEntityValidator(OrganizationalEntityList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = OrganizationalEntityList.some(group => group.organizationalEntityName?.toLowerCase() === value);
      return match ? null : {organizationalEntityInvalid: true };
    };
  }

  InitMessageType(){
    this._generalService.GetMessageType().subscribe(
      data=>
      {
        this.MessageTypeList=data;
        this.advanceTableForm.controls['searchMessageType'].setValidators([Validators.required,
          this.messageValidator(this.MessageTypeList)]);
        this.advanceTableForm.controls['searchMessageType'].updateValueAndValidity();
        this.filteredMessageTypeOptions =  this.advanceTableForm.controls['searchMessageType'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterMessageType(value || ''))
        ); 
      });
  }
  
  private _filterMessageType(value: string): any {
    const filterValue = value.toLowerCase();
    return this.MessageTypeList.filter(
      customer => 
      {
        return customer.messageType.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }
  
  getmessageTypeID(messageTypeID: any) {
    this.messageTypeID=messageTypeID;
  }

  messageValidator(MessageTypeList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = MessageTypeList.some(group => group.messageType?.toLowerCase() === value);
      return match ? null : {messageTypeInvalid: true };
    };
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

//   if (/[a-zA-Z]/.organizationalEntityMessage(inp)) {
//     return true;
//   } else {
//     event.preventDefault();
//     return false;
//   }
// }

}


