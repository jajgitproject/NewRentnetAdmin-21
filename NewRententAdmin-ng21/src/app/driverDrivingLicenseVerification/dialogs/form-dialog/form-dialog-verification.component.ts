// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject, Input } from '@angular/core';
import { DriverDrivingLicenseVerificationService } from '../../driverDrivingLicenseVerification.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { DriverDrivingLicenseVerification } from '../../driverDrivingLicenseVerification.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CitiesDropDown } from 'src/app/organizationalEntity/citiesDropDown.model';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { AllCitiesDropDown } from 'src/app/customerPersonDrivingLicense/allCitiesDropDown.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DriverDrivingLicenseService } from 'src/app/driverDrivingLicense/driverDrivingLicense.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  standalone: false,
  selector: 'app-form-dialog-verification',
  templateUrl: './form-dialog-verification.component.html',
  styleUrls: ['./form-dialog-verification.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogVerificationComponent 
{
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: DriverDrivingLicenseVerification;
  searchTerm : FormControl = new FormControl();
  searchCityTerm : FormControl = new FormControl();
  PageNumber: number = 0;

  public EmployeeList?: EmployeeDropDown[]=[];

  image: any;
  fileUploadEl: any;
  addressGeoPointID: any;
  customerPersonName: any;
  issuingGeoPointID: any;
  driverName: any;
  SearchAddressCity: string = '';
  SearchIssuingCity: string = '';
  SearchActivationStatus : boolean=true;
  @Input() _pData !: any;
  dataSource: any;
  DriverDrivingLicenseVerificationService: any;
  activeData: string;
  saveDisabled:boolean = true;
  constructor(
  public dialogRef: MatDialogRef<FormDialogVerificationComponent>, 
  public dialog: MatDialog,
  private snackBar: MatSnackBar,
  public driverDrivingLicenseService: DriverDrivingLicenseService,
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: DriverDrivingLicenseVerificationService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
          this.dialogTitle = 'Driving License Details';
          this.advanceTable = data.advanceTable;
          console.log(this.advanceTable);
          this.uploadedByName();
          //this.advanceTable.licenseImage="";
          this.driverName=this.advanceTable.driver;
          
          this.advanceTable.verificationDate=new Date();
          if(this.advanceTable.activationStatus===true){
            this.advanceTable.status="Active";
          }
          if(this.advanceTable.activationStatus===false){
            this.advanceTable.status="Deleted";
          }
        this.advanceTableForm = this.createContactForm();

  }
  public ngOnInit(): void
  {
    //this.loadDatas();
  }

  GetAllDDLData(){
    this._generalService.GetDDLData(this.data.DriverDrivingLicenseID).subscribe(
      data=>
      {
        //this.advanceTable=data;
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
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      driverDrivingLicenseID: [this.advanceTable.driverDrivingLicenseID],
      driverID: [this.advanceTable.driverID],
      driverAddressCityID: [this.advanceTable.driverAddressCityID],
      permanentAddress: [this.advanceTable.permanentAddress],
      drivingLicenseNo: [this.advanceTable.drivingLicenseNo],
      licenseImage: [this.advanceTable.licenseImage],
      reasonOfLicenseImageNonAvailblity: [this.advanceTable.reasonOfLicenseImageNonAvailblity],
      licenseIssueCityID: [this.advanceTable.licenseIssueCityID],
      licenseAuthorityName: [this.advanceTable.licenseAuthorityName],
      uploadedByID: [this.advanceTable.uploadedByID],
      uploadedBy:[this.advanceTable.uploadedBy],
      uploadEditedDate: [this.advanceTable.uploadEditedDate],
      uploadRemark: [this.advanceTable.uploadRemark],
      activationStatus: [this.advanceTable.activationStatus],
      status: [this.advanceTable.status],
      verified: [this.advanceTable.verified],
      verifiedBy: [this.advanceTable.verifiedBy],
      verificationRemark: [this.advanceTable.verificationRemark],
      verificationDate: [this.advanceTable.verificationDate],
      addressCity: [this.advanceTable.addressCity],
      issuingCity: [this.advanceTable.issuingCity],
    });
  }

uploadedByName(){
  this._generalService.getEmployeeID(this._generalService.getUserID()).subscribe(
    data=>{
      this.EmployeeList=data;
      this.advanceTableForm.patchValue({uploadedBy:this.EmployeeList[0].firstName+' '+this.EmployeeList[0].lastName});
      this.advanceTableForm.patchValue({verifiedBy:this.EmployeeList[0].firstName+' '+this.EmployeeList[0].lastName});
    }
  );
}

  reset(): void 
  {
    this.advanceTableForm.reset();
  }
  onNoClick()
  {
    this.dialogRef.close();
  }
  public Put(): void
  {
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('DriverDrivingLicenseVerificationUpdate:DriverDrivingLicenseVerificationView:Success');//To Send Updates 
       this.saveDisabled = true; 
       this.showNotification(
        'snackbar-success',
        'Driver Driving License Verification Updated Successfully...!!!',
        'bottom',
        'center'
      );
      //window.location.reload();
    },
    error =>
    {
     this._generalService.sendUpdate('DriverDrivingLicenseVerificationAll:DriverDrivingLicenseVerificationView:Failure');//To Send Updates 
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

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

  submit() 
  {
    // emppty stuff
  }
  public confirmAdd(): void 
  {
    this.saveDisabled = false;
    this.Put();

  }
//   public loadDatas() 
//   {
//      this.driverDrivingLicenseService.getTableData(this.SearchAddressCity,this.SearchIssuingCity,this.SearchActivationStatus, this.PageNumber).subscribe
//    (
//      data =>   
//      {

//        this.dataSource = data;
//        //console.log(this.dataSource)
//        this.dataSource.forEach((ele)=>{
//          if(ele.activationStatus===true){
//            this.activeData="Active";
//          }
//          else{
//            this.activeData="Deleted"
//          }
//        })
      
//      },
//      (error: HttpErrorResponse) => { this.dataSource = null;}
//    );
//  }
 
}


