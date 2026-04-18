// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { FeedBackAttachmentService } from '../../feedBackAttachment.service';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { FeedBackAttachment } from '../../feedBackAttachment.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { FeedBackAttachmentDropDown } from '../../feedBackAttachmentDropDown.model';
// import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import moment from 'moment';
//import { CityDropDown } from '../../cityDropDown.model';
import { UomDropDown } from 'src/app/additionalService/uomDropDown.model';
import { ServiceTypeDropDown } from 'src/app/general/serviceTypeDropDown.model';
import { AdditionalServiceDropDown } from 'src/app/general/additionalServiceDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
//import { ServiceTypeDropDown } from 'src/app/serviceType/serviceTypeDropDown.model';
// import { CityDropDown } from 'src/app/general/cityDropDown.model';
// import { CityDropDown } from 'src/app/city/cityDropDown.model';
@Component({
  standalone: false,
    selector: 'app-form-dialog',
    templateUrl: './form-dialog.component.html',
    styleUrls: ['./form-dialog.component.sass'],
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
  })

export class tripFeedBackAttachmentFormDialogComponent {
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: FeedBackAttachment;
  fName = '';
  contents: any[];
  mydata = [];
  name = '';

  // public CityList?: CityDropDown[] = [];
  // filteredCityOptions: Observable<CityDropDown[]>;
  searchCityTerm: FormControl = new FormControl();

  public uomList?: UomDropDown[] = [];
  public additionalList?: AdditionalServiceDropDown[] = [];

  image: any;
  fileUploadEl: any;
  UOMID: any;
  ServiceID: any;
  service: string;
  geoPointCityID: any;
  ReservationID: any;
  CustomerPersonID: any;
  TripFeedBackID: any;
  dutySlipID: any;
  DutySlipID: any;
  tripFeedBackID: any;
  verifyDutyStatusAndCacellationStatus: string;
  isSaveAllowed: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<tripFeedBackAttachmentFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: FeedBackAttachmentService,
    private fb: FormBuilder,
    private el: ElementRef,
    public _generalService: GeneralService) {
    // Set the defaults
    this.action = data.action;
    this.verifyDutyStatusAndCacellationStatus = data.verifyDutyStatusAndCacellationStatus;
    if (this.action === 'edit') {
      this.dialogTitle = ' Edit Attachment';
      this.advanceTable = data.advanceTable;
      this.dutySlipID = data.dutySlipID;
      this.tripFeedBackID = data.tripFeedBackID;

      this.ImagePath = this.advanceTable.tripFeedBackAttachment;

    } else {
      this.dialogTitle = 'Add Attachment';
      this.advanceTable = new FeedBackAttachment({});
      this.dutySlipID=data.dutySlipID;

      this.advanceTable.activationStatus = true;
    
    }
    this.advanceTableForm = this.createContactForm();
    this.tripFeedBackID = data.tripFeedBackID;
    this.dutySlipID=data.dutySlipID;
    if (this.verifyDutyStatusAndCacellationStatus !== 'Changes allow') 
    {
      this.isSaveAllowed = true;
    } 
    else
    {
      this.isSaveAllowed = false;
    }
  }
  public ngOnInit(): void {

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
        tripFeedBackAttachmentID: [this.advanceTable.tripFeedBackAttachmentID],
        tripFeedBackID: [this.advanceTable.tripFeedBackID,],
        tripFeedBackAttachment: [this.advanceTable.tripFeedBackAttachment],
        activationStatus: [this.advanceTable.activationStatus],

      });
  }

  //   public noWhitespaceValidator(control: FormControl) {
  //     const isWhitespace = (control.value || '').trim().length === 0;
  //     const isValid = !isWhitespace;
  //     return isValid ? null : { 'whitespace': true };
  // }

  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public Post(): void {
    this.advanceTableForm.patchValue({ tripFeedBackID: this.tripFeedBackID });
    this.advanceTableService.add(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {

          this.dialogRef.close();
          this._generalService.sendUpdate('FeedBackAttachmentCreate:FeedBackAttachmentView:Success');//To Send Updates  

        },
        error => {
          this._generalService.sendUpdate('FeedBackAttachmentAll:FeedBackAttachmentView:Failure');//To Send Updates  
        }
      )
  }
  public Put(): void {
    this.advanceTableForm.patchValue({ tripFeedBackID: this.tripFeedBackID });
    this.advanceTableService.update(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {

          this.dialogRef.close();
          this._generalService.sendUpdate('FeedBackAttachmentUpdate:FeedBackAttachmentView:Success');//To Send Updates  

        },
        error => {
          this._generalService.sendUpdate('FeedBackAttachmentAll:FeedBackAttachmentView:Failure');//To Send Updates  
        }
      )
  }
  public confirmAdd(): void {
    if (this.action == "edit") {
      this.Put();
    }
    else {
      this.Post();
    }
  }
  // OnFeedBackAttachmentChangeGetcurrencies()
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
  getUom() {
    this._generalService.getUOM(this.UOMID).subscribe(
      data => {
        this.uomList = data;
        this.advanceTableForm.patchValue({ uom: this.uomList[0].uom });
      }
    )
  }

  getseviceName() {
    this._generalService.getSeviceName(this.ServiceID).subscribe(
      data => {
        this.additionalList = data;
        this.service = this.additionalList[0].additionalService;
        console.log(this.service)
      }
    )
  }

  /////////////////for Image Upload////////////////////////////
  public response: { dbPath: '' };
  public ImagePath: string = "";
  public uploadFinished = (event) => {
    this.response = event;
    this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({tripFeedBackAttachment: this.ImagePath })
  }

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

}



