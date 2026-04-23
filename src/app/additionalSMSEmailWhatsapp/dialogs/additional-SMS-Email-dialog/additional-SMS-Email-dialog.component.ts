// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { AdditionalSMSEmailWhatsappService } from '../../additionalSMSEmailWhatsapp.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { AdditionalSMSEmailWhatsapp } from '../../additionalSMSEmailWhatsapp.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CountryCodeDropDown } from 'src/app/general/countryCodeDropDown.model';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {atLeastOneRequired} from './atLeastOneRequired.component';
@Component({
  standalone: false,
  selector: 'app-additional-SMS-Email-dialog',
  templateUrl: './additional-SMS-Email-dialog.component.html',
  styleUrls: ['./additional-SMS-Email-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class AdditionalSMSEmailDialogComponent 
{
  saveDisabled:boolean=true;
  buttonDisabled:boolean=false;
  status: any;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: AdditionalSMSEmailWhatsapp;
  filteredCountryCodesOptions: Observable<CountryCodeDropDown[]>;
  public CountryCodeList?: CountryCodeDropDown[] = [];
  reservationID: any;
  constructor(
    private snackBar: MatSnackBar,
  public dialogRef: MatDialogRef<AdditionalSMSEmailDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: AdditionalSMSEmailWhatsappService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Additional SMS/Email/Whatsapp';       
          this.advanceTable = data.advanceTable;
          this.advanceTable.activationStatus=true;
          if (this.advanceTable.countryCodes) {
            const mobileParts = this.advanceTable.countryCodes.split('+');
            const countryCodes = '+91'+''+mobileParts[0];
            this.advanceTable.countryCodes=countryCodes;
            const mobile1 = mobileParts[1];
            this.advanceTable.mobileNumber=mobile1;
        }
        } 
        else 
        {
          this.dialogTitle = 'Additional SMS/Email/Whatsapp';
          this.advanceTable = new AdditionalSMSEmailWhatsapp({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
        if(data?.advanceTable?.reservationID !== undefined) {
          this.reservationID = data?.advanceTable?.reservationID;
        } else {
          this.reservationID = data?.reservationID;
        };
        // this.reservationID=data.reservationID;
        
        this.status=data?.status?.status || data?.status || data;
        // if(this.status!='Changes allow'){
        //   this.buttonDisabled=true;
        // }
               if(this.status === 'Changes allow'){
    this.buttonDisabled = false;  // Save button enable
} else {
    this.buttonDisabled = true;   // Save button disable
}
       
  }

  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      reservationAdditionalMessagingID: [this.advanceTable.reservationAdditionalMessagingID],
      reservationID: [this.advanceTable.reservationID],
     activationStatus: [this.advanceTable.activationStatus],
      personToBeMessaged: [this.advanceTable.personToBeMessaged],
      mobileNumber: [this.advanceTable.mobileNumber],
      emailID: [this.advanceTable.emailID],
      countryCodes:['+91']
    }, { validator: atLeastOneRequired });
  }
  public ngOnInit(): void
  {
   this.InitCountryISDCodes(); 
  }

  InitCountryISDCodes(){
    this._generalService.GetCountryCodes().subscribe
    (
      data=>{
        this.CountryCodeList=data;
        this.filteredCountryCodesOptions = this.advanceTableForm.controls['countryCodes'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterCountryCodes(value || ''))
        ); 
      }
    );
  }
  private _filterCountryCodes(value: string): any {
    const filterValue = value.toLowerCase();
    return this.CountryCodeList.filter(
      customer => 
      {
        return customer.icon.toLowerCase().indexOf(filterValue)===0 || customer.countryISOCode.toLowerCase().indexOf(filterValue)===0 || customer.countryISDCode.toLowerCase().indexOf(filterValue)===0;
     
      }
    );
  }
  onCountryCodes(event: any): void {      
    this.advanceTableForm.patchValue({ countryCodes: event.option.value });
   
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
    this.dialogRef.close();
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
  public Post(): void
  {
    const phone1 = this.advanceTableForm.get('countryCodes').value;
    const phone2 = this.advanceTableForm.get('mobileNumber').value;
    const countryCodes = phone1.split('+')[1];
    const mobile =countryCodes+'-'+phone2
    this.advanceTableForm.patchValue({mobileNumber:mobile});
    this.advanceTableForm.patchValue({reservationID:this.reservationID});
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
      response => 
      {
          
          this.showNotification(
            'snackbar-success',
            'Additional SMS/Email/Whatsapp Create...!!!',
            'bottom',
            'center'
          );
          this.saveDisabled=true;
          this.dialogRef.close(true);
         //this._generalService.sendUpdate('AdditionalSMSEmailWhatsappUpdate:AdditionalSMSEmailWhatsappUpdate:Success');//To Send Updates  
         
      },
      error =>
      {
       //this._generalService.sendUpdate('AdditionalSMSEmailWhatsappUpdate:AdditionalSMSEmailWhatsappUpdate:Failure');//To Send Updates 
       this.showNotification(
        'snackbar-danger',
        'Operation Failed.....!!!',
        'bottom',
        'center'
      ); 
      this.saveDisabled=true;
      }
  )
  }
  public Put(): void
  {
    const phone1 = this.advanceTableForm.get('countryCodes').value;
    const phone2 = this.advanceTableForm.get('mobileNumber').value;
    const countryCodes = phone1.split('+')[1];
    const mobile =countryCodes+'-'+phone2
    this.advanceTableForm.patchValue({mobileNumber:mobile});
    this.advanceTableForm.patchValue({reservationID:this.reservationID || this.reservationID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
      response => 
      {
          
          this.showNotification(
            'snackbar-success',
            'Additional SMS/Email/Whatsapp Update...!!!',
            'bottom',
            'center'
          );
          this.saveDisabled=true;
          this.dialogRef.close(true);         
      },
      error =>
      {
       //this._generalService.sendUpdate('AdditionalSMSEmailWhatsappUpdate:AdditionalSMSEmailWhatsappUpdate:Failure');//To Send Updates 
       this.showNotification(
        'snackbar-danger',
        'Operation Failed.....!!!',
        'bottom',
        'center'
      ); 
      this.saveDisabled=true;
      }
  )
  }
  public confirmAdd(): void 
  {
    this.saveDisabled=false;
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


