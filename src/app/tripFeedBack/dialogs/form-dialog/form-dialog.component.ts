// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { TripFeedBackService } from '../../tripFeedBack.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { TripFeedBack } from '../../tripFeedBack.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { TripFeedBackDropDown } from '../../tripFeedBackDropDown.model';
// import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import moment from 'moment';
//import { CityDropDown } from '../../cityDropDown.model';
import { UomDropDown } from 'src/app/additionalService/uomDropDown.model';
import { ServiceTypeDropDown } from 'src/app/general/serviceTypeDropDown.model';
import { AdditionalServiceDropDown } from 'src/app/general/additionalServiceDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
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

export class FormDialogComponent 
{
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: TripFeedBack;
  fName = '';
  contents: any[];
  mydata = [];
  name = '';
 
  // public CityList?: CityDropDown[] = [];
  // filteredCityOptions: Observable<CityDropDown[]>;
  searchCityTerm: FormControl = new FormControl();

  public uomList?: UomDropDown[] = [];
  public additionalList?: AdditionalServiceDropDown[] = [];
  public EmployeeList?: EmployeeDropDown[] = [];
  filteredEmployeeOptions: Observable<EmployeeDropDown[]>;
  searchEmployee: FormControl = new FormControl();
  image: any;
  fileUploadEl: any;
  UOMID: any;
  ServiceID: any;
  service: string;
  geoPointCityID: any;
  ReservationID: any;
  CustomerPersonID: any;
  employeeID: any;
  AllotmentID: any;
  InventoryID: any;
  DriverID: any;
  RegistrationNumber: any;
  DriverName: any;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: TripFeedBackService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle =' Edit Attachment To DutySlip No.';       
          this.advanceTable = data.advanceTable;
          
   
        } else 
        {
          this.dialogTitle = 'Add Attachment To DutySlip No.';
          this.advanceTable = new TripFeedBack({});
          this.advanceTable.activationStatus= true;
          this.uploadedByName();
          this.advanceTable.registrationNumber=data.registrationNumber;
          this.advanceTable.driverName=data.driverName;
          this.advanceTable.reservationID=data.reservationID;
          this.advanceTable.allotmentID=data.allotmentID;
        }
        this.advanceTableForm = this.createContactForm(); 
        this.ReservationID=data.reservationID;
        this.CustomerPersonID=data.customerPersonID;
        this.AllotmentID=data.allotmentID;
        this.InventoryID=data.inventoryID;
        this.DriverID=data.driverID;
        this.RegistrationNumber=data.registrationNumber;
        this.DriverName=data.driverName;
  }
  public ngOnInit(): void
  {
    this.InitEmployee();
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
  uploadedByName(){
    this._generalService.getEmployeeID(this._generalService.getUserID()).subscribe(
      data=>{
        this.EmployeeList=data;
        this.advanceTableForm.patchValue({feedbackEnteredBy:this.EmployeeList[0].firstName+' '+this.EmployeeList[0].lastName});
        
      }
    );
  }
    
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      tripTripFeedBackID: [this.advanceTable.tripTripFeedBackID],
      dutySlipID: 1,
      allotmentID : [this.advanceTable.allotmentID],
      reservationID: [this.advanceTable.reservationID,],
      driverID : [this.advanceTable.driverID],
      inventoryID: [this.advanceTable.inventoryID,],
      passengerID : 86,
      customerPersonID: [this.advanceTable.customerPersonID,],
      employeeID : [this.advanceTable.employeeID],
      feedbackPointsOutOfFive: [this.advanceTable.feedbackPointsOutOfFive,],
      feedbackRemark : [this.advanceTable.feedbackRemark],
      feedbackEnteredBy : [this.advanceTable.feedbackEnteredBy],
      dateOfFeedback: [this.advanceTable.dateOfFeedback,],
      timeOfFeedback : [this.advanceTable.timeOfFeedback],
      activationStatus: [this.advanceTable.activationStatus],
      registrationNumber: [this.advanceTable.registrationNumber],
      driverName:[this.advanceTable.driverName],
 
    });
  }
  InitEmployee() {
    this._generalService.GetEmployee().subscribe(
      data => {
        this.EmployeeList = data;
        this.filteredEmployeeOptions = this.searchEmployee.valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        );
      });
  }

  private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    return this.EmployeeList.filter(
      customer => {
        return customer.firstName.toLowerCase().indexOf(filterValue) === 0;
      }
    );
  }

  getTitles(employeeID: any) {
    this.employeeID = employeeID;
    // this.searchEmployee.setValue(this.employeeID);
  }
//   public noWhitespaceValidator(control: FormControl) {
//     const isWhitespace = (control.value || '').trim().length === 0;
//     const isValid = !isWhitespace;
//     return isValid ? null : { 'whitespace': true };
// }

  submit() 
  {
    // emppty stuff
  }
  onNoClick(): void 
  {
    this.dialogRef.close();
  }
  public Post(): void
  {
    this.advanceTableForm.patchValue({customerPersonID: this.CustomerPersonID});
    this.advanceTableForm.patchValue({reservationID: this.ReservationID});
    this.advanceTableForm.patchValue({allotmentID: this.AllotmentID});
    this.advanceTableForm.patchValue({inventoryID: this.InventoryID});
    this.advanceTableForm.patchValue({driverID: this.DriverID});
    this.advanceTableForm.patchValue({employeeID: this.employeeID })
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
     
      this.dialogRef.close();
       this._generalService.sendUpdate('TripFeedBackCreate:TripFeedBackView:Success');//To Send Updates  
    
  },
    error =>
    {
       this._generalService.sendUpdate('TripFeedBackAll:TripFeedBackView:Failure');//To Send Updates  
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
       this._generalService.sendUpdate('TripFeedBackUpdate:TripFeedBackView:Success');//To Send Updates  
       
    },
    error =>
    {
     this._generalService.sendUpdate('TripFeedBackAll:TripFeedBackView:Failure');//To Send Updates  
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
  // OnTripFeedBackChangeGetcurrencies()
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
  getUom(){
    this._generalService.getUOM(this.UOMID).subscribe(
      data=>{
       this.uomList=data;
       this.advanceTableForm.patchValue({uom:this.uomList[0].uom});
      }
    )
  }

  getseviceName(){
    this._generalService.getSeviceName(this.ServiceID).subscribe(
      data=>{
       this.additionalList=data;
       this.service= this.additionalList[0].additionalService;
      }
    )
  }

  /////////////////for Image Upload////////////////////////////
  public response: { dbPath: '' };
  public ImagePath: string = "";
  
  public uploadFinished = (event) => 
  {
    this.response = event;
    this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({tripTripFeedBack:this.ImagePath})
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



