// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { DriverDocumentVerificationService } from '../../driverDocumentVerification.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { DriverDocumentVerification } from '../../driverDocumentVerification.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { DriverDocumentVerificationDropDown } from '../../driverDocumentVerificationDropDown.model';
import { CitiesDropDown } from 'src/app/organizationalEntity/citiesDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { DocumentDropDown } from 'src/app/general/documentDropDown.model';

@Component({
  standalone: false,
  selector: 'app-form-dialog-verifications',
  templateUrl: './form-dialog-verifications.component.html',
  styleUrls: ['./form-dialog-verifications.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogVerificationsComponent 
{
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: DriverDocumentVerification;
  searchTerm : FormControl = new FormControl();
  searchCityTerm : FormControl = new FormControl();
  public DocumentList?: DocumentDropDown[] = [];
  public CityList?: CitiesDropDown[] = [];
  filteredOptions: Observable<CitiesDropDown[]>;

  public EmployeeList?: EmployeeDropDown[]=[];
  saveDisabled:boolean = true;
  image: any;
  fileUploadEl: any;
  addressGeoPointID: any;
  DriverName: string;
  DriverID!: number;
  constructor(
  public dialogRef: MatDialogRef<FormDialogVerificationsComponent>, 
  public dialog: MatDialog,
  private snackBar: MatSnackBar,
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: DriverDocumentVerificationService,
    private fb: FormBuilder,
    private el: ElementRef,
    
  public _generalService:GeneralService)
  { 
    this.DriverID= data.driverID,
  this.DriverName =data.DriverName;
        // Set the defaults
          this.dialogTitle = 'Document Verification';
          this.advanceTable = data.advanceTable;
          this.verifiedByName();
          console.log(this.advanceTable)
          this.advanceTable.verificationDate=new Date();
          if(this.advanceTable.activationStatus===true){
            this.advanceTable.status="Active";
          }

          if(this.advanceTable.activationStatus===false){
            this.advanceTable.status="Deleted";
          }
          // this.advanceTable.verified=null;
          
        this.advanceTableForm = this.createContactForm();
        console.log(this.advanceTable);
        console.log(this.action);   
  }
  
  public ngOnInit(): void
  {
    this.InitCities();
    this.intDocument();
  }

  intDocument(){
    this._generalService.getDocumentRequired().subscribe
    (
      data =>   
      {
        this.DocumentList = data;
        console.log( this.DocumentList)
      }
    );
  }
  
  InitCities(){
    this._generalService.GetCitiessAll().subscribe(
      data=>
      {
        this.CityList=data;
        this.filteredOptions = this.searchTerm.valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        ); 
      });
  }

  private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    return this.CityList.filter(
      customer => 
      {
        return customer.geoPointName.toLowerCase().indexOf(filterValue)===0;
      }
    );
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
  isImageUploaded(): boolean {
  return this.advanceTable.documentImage && 
         this.advanceTable.documentImage !== this._generalService.ImageURL + 'StaticFiles/Images/';
}
  
  createContactForm(): FormGroup 
  {
    console.log(this.advanceTable)
    return this.fb.group(
    {
      driverDocumentID: [this.advanceTable.driverDocumentID],
      driverID: [this.advanceTable.driverID],
      document: [this.advanceTable.document],
      documentID: [this.advanceTable.documentID],
      documentNumber: [this.advanceTable.documentNumber],
      documentIssuingAuthority: [this.advanceTable.documentIssuingAuthority],
      documentImage: [this.advanceTable.documentImage],
      documentImageNonAvailabilityReason: [this.advanceTable.documentImageNonAvailabilityReason],
      addressCityID: [this.advanceTable.addressCityID],
      documentExpiry: [this.advanceTable.documentExpiry],
      activationStatus: [this.advanceTable.activationStatus],
      verified: [this.advanceTable.verified || null],
      verifiedBy: [this.advanceTable.verifiedBy],
      verifiedByID: [this.advanceTable.verifiedByID],
      verificationRemark: [this.advanceTable.verificationRemark],
      verificationDate: [this.advanceTable.verificationDate],
      address: [this.advanceTable.address],
      status: [this.advanceTable.status],
      addressCity: [this.advanceTable.addressCity],
      pin: [this.advanceTable.pin],
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
  onNoClick()
  {
    this.dialogRef.close();
    this.ImagePath="";
  }
  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

  public Put(): void
  {

    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
        this.showNotification(
          'snackbar-success',
          'Driver Document Verification Updated Successfully...!!!',
          'bottom',
          'center'
        );
       this._generalService.sendUpdate('DriverDocumentVerificationUpdate:DriverDocumentVerificationView:Success');//To Send Updates 
       this.saveDisabled = true; 
       
    },
    error =>
    {
     this._generalService.sendUpdate('DriverDocumentVerificationAll:DriverDocumentVerificationView:Failure');//To Send Updates 
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
  verifiedByName(){
    this._generalService.getEmployeeID(this._generalService.getUserID()).subscribe(
      data=>{
        this.EmployeeList=data;
        this.advanceTableForm.patchValue({verifiedBy:this.EmployeeList[0].firstName+' '+this.EmployeeList[0].lastName});
      }
    );
  }
  public confirmAdd(): void 
  {
    this.saveDisabled = false;
       this.Put();
  }
  
  /////////////////for Image Upload////////////////////////////
  public response: { dbPath: '' };
  public ImagePath: string = "";
  
  public uploadFinished = (event) => 
  {
    this.response = event;
    this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({documentImage:this.ImagePath})
  }

}


