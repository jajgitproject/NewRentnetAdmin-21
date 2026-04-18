// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, ViewChild } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { DutyAllotmentDetails, DutySlipQualityCheckedByExecutive } from '../../dutySlipQualityCheckedByExecutive.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { DutySlipQualityCheckedByExecutiveService } from '../../dutySlipQualityCheckedByExecutive.service';
import { DutyQualityDropDown } from '../../dutySlipQualityCheckedByExecutiveDropDown.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { MatMenuTrigger } from '@angular/material/menu';
import { HttpErrorResponse } from '@angular/common/http';
import { DutySlipQualityCheckService } from 'src/app/dutySlipQualityCheck/dutySlipQualityCheck.service';
import { DutyAmenitieModel } from 'src/app/dutySlipQualityCheck/dutySlipQualityCheck.model';
import { VerifiedDutyAmenitieDialogComponent } from '../verifiedDutyAmenitie-dialog/verifiedDutyAmenitie-dialog.component';
@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogComponent 
{
  displayedColumns = [
      'amenitie.amenitie',
      'amenitieRemark',
      'amenitieImage',
      'amenitieVerified',
      'actions'
    ];
  showError: string;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: DutySlipQualityCheckedByExecutive;
  driverRegistrationData:DutyAllotmentDetails[]=[];
  dutyQualityCheckData:DutySlipQualityCheckedByExecutive[]=[];
  dutySlipID: any;
  reservationID: any;
  allotmentID: number;
  dutyQualityCheckList:any;
  dutyQualityCheckDataList: number;
  saveDisabled:boolean=true;
  dataSource: DutyAmenitieModel[] | null;
  PageNumber: number = 0;
  SearchActivationStatus : boolean=true;
  sortingData: number;
  sortType: string;
  verifyDutyStatusAndCacellationStatus: any;
  isSaveAllowed: boolean = false;

  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: DutySlipQualityCheckedByExecutiveService,
    private fb: FormBuilder,
      public dialog: MatDialog,
    private snackBar: MatSnackBar,
  public _generalService:GeneralService,
  public dutySlipQualityCheckService: DutySlipQualityCheckService)
  {
        // Set the defaults
        this.action = data.action;
        //console.log(data)
        this.allotmentID=data.allotmentID;
        this.reservationID=data.reservationID;
        this.verifyDutyStatusAndCacellationStatus = data.verifyDutyStatusAndCacellationStatus;
          this.dialogTitle = 'Verify Quality Check';
          this.advanceTable = new DutySlipQualityCheckedByExecutive({});
          this.advanceTable.activationStatus=true;
        //}

        this.dutySlipID=data.dutySlipID;
        this.advanceTableForm = this.createContactForm();
        // if (this.verifyDutyStatusAndCacellationStatus !== 'Changes allow') 
        // {
        //   this.isSaveAllowed = true;
        // } 
        // else
        // {
        //   this.isSaveAllowed = false;
        // }
        const status = (this.verifyDutyStatusAndCacellationStatus || '')
  .trim()
  .toLowerCase();

this.isSaveAllowed = status === 'changes allow';
  }
    @ViewChild(MatMenuTrigger)
       contextMenu: MatMenuTrigger;
       contextMenuPosition = { x: '0px', y: '0px' };
  
  locationTimeSet(event)
  {
    if(this.action==='edit')
    {
      let time=this.advanceTableForm.value.pickupTime;
      let minutes=90;
      let millisecondsToSubtract = minutes * 60 * 1000;
      let newDate = new Date(time - millisecondsToSubtract);
      this.advanceTableForm.patchValue({locationOutTime:newDate});
    }
    else
    {
      let time=event.getTime();
      let minutes=90;
      let millisecondsToSubtract = minutes * 60 * 1000;
      let newDate = new Date(time - millisecondsToSubtract);
      this.advanceTableForm.patchValue({locationOutTime:newDate});
    }
    
  }
  ngOnInit() {
   
   this.InitDutyQualityCheckID();
   this.loadDataForDutyAmenities();
  }
  InitDriverAndRegistration()
  {
    this._generalService.GetDutyAllotmentInfo(this.dutyQualityCheckList).subscribe(
      data=>{
        this.driverRegistrationData=data;
        //console.log(this.driverRegistrationData);
        this.advanceTableForm.patchValue({dutyQualityCheckID:this.driverRegistrationData[0].dutyQualityCheckID});
        this.advanceTableForm.patchValue({dutySlipID:this.driverRegistrationData[0].dutySlipID});
        this.advanceTableForm.patchValue({driverID:this.driverRegistrationData[0].driverID});
        this.advanceTableForm.patchValue({driverName:this.driverRegistrationData[0].driverName});
        this.advanceTableForm.patchValue({inventoryID:this.driverRegistrationData[0].inventoryID});
        this.advanceTableForm.patchValue({carRegNo:this.driverRegistrationData[0].carRegNo});
        this.advanceTableForm.patchValue({qcDate:this.driverRegistrationData[0].qcDate});
        this.advanceTableForm.patchValue({qcTime:this.driverRegistrationData[0].qcTime});
        this.advanceTableForm.patchValue({bodyTemperatureInDegreeCelcius:this.driverRegistrationData[0].bodyTemperatureInDegreeCelcius});
        this.advanceTableForm.patchValue({selfieWithUniform:this.driverRegistrationData[0].selfieWithUniform});
        this.advanceTableForm.patchValue({frontPhoto:this.driverRegistrationData[0].frontPhoto});
        this.advanceTableForm.patchValue({interiorsWithAmenities:this.driverRegistrationData[0].interiorsWithAmenities});
        this.advanceTableForm.patchValue({isolatedCabin:this.driverRegistrationData[0].isolatedCabin});
        this.advanceTableForm.patchValue({bodyTemperatureImage:this.driverRegistrationData[0].bodyTemperatureImage});
        this.advanceTableForm.patchValue({selfDeclaration:this.driverRegistrationData[0].selfDeclaration===true?'Yes':'No'});
        this.advanceTableForm.patchValue({driverRemark:this.driverRegistrationData[0].driverRemark});
      }
    );
  }

  InitDutyQualityCheckDataDetails()
  {
    this.advanceTableService.getdutyQualityCheckDataDetails(this.allotmentID).subscribe(
      data=>{
        this.dutyQualityCheckData=data;
      //console.log(this.dutyQualityCheckData);
        this.advanceTableForm.patchValue({dutyQualityCheckID:this.dutyQualityCheckData[0].dutyQualityCheckID});
        this.advanceTableForm.patchValue({dutySlipID:this.dutyQualityCheckData[0].dutySlipID});
        this.advanceTableForm.patchValue({driverID:this.dutyQualityCheckData[0].driverID});
        this.advanceTableForm.patchValue({driverName:this.dutyQualityCheckData[0].driverName});
        this.advanceTableForm.patchValue({inventoryID:this.dutyQualityCheckData[0].inventoryID});
        this.advanceTableForm.patchValue({carRegNo:this.dutyQualityCheckData[0].carRegNo});
        this.advanceTableForm.patchValue({qcDate:this.dutyQualityCheckData[0].qcDate});
        this.advanceTableForm.patchValue({qcTime:this.dutyQualityCheckData[0].qcTime});
        this.advanceTableForm.patchValue({bodyTemperatureInDegreeCelcius:this.dutyQualityCheckData[0].bodyTemperatureInDegreeCelcius});
        this.advanceTableForm.patchValue({selfieWithUniform:this.dutyQualityCheckData[0].selfieWithUniform});
        this.advanceTableForm.patchValue({frontPhoto:this.dutyQualityCheckData[0].frontPhoto});
        this.advanceTableForm.patchValue({interiorsWithAmenities:this.dutyQualityCheckData[0].interiorsWithAmenities});
        this.advanceTableForm.patchValue({isolatedCabin:this.dutyQualityCheckData[0].isolatedCabin});
        this.advanceTableForm.patchValue({bodyTemperatureImage:this.dutyQualityCheckData[0].bodyTemperatureImage});
        this.advanceTableForm.patchValue({selfDeclaration:this.dutyQualityCheckData[0].selfDeclaration===true?'Yes':'No'});
        this.advanceTableForm.patchValue({driverRemark:this.dutyQualityCheckData[0].driverRemark});
        this.advanceTableForm.patchValue({qCCheckedByExecutivePassed:this.dutyQualityCheckData[0].qcCheckedByExecutivePassed});
        this.advanceTableForm.patchValue({verificationRemark:this.dutyQualityCheckData[0].qcCheckedByExecutiveRemark});
      }
    );
  }
  InitDutyQualityCheckID(){
    this._generalService.GetDutyQualityCheckID(this.allotmentID).subscribe(
      data=>{
        this.dutyQualityCheckList=data;
        this.InitDriverAndRegistration();
        this.InitDutyQualityCheckDataDetails();
        //console.log(this.dutyQualityCheckList);
       
      }
    );
   }
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      dutyQualityCheckID: [this.advanceTable.dutyQualityCheckID],
      qCCheckedByExecutiveID:[this.advanceTable.qCCheckedByExecutiveID],
      driverID:[this.advanceTable.driverID],
      driverName:[this.advanceTable.driverName],
      inventoryID:[this.advanceTable.inventoryID],
      carRegNo:[this.advanceTable.carRegNo],
      bodyTemperatureInDegreeCelcius:[this.advanceTable.bodyTemperatureInDegreeCelcius],
      driverRemark:[this.advanceTable.driverRemark],
      selfDeclaration:[this.advanceTable.selfDeclaration],
      qcDate:[this.advanceTable.qcDate],
      qcTime:[this.advanceTable.qcTime],
      qCCheckedByExecutivePassed:[this.advanceTable.qCCheckedByExecutivePassed],
      verificationRemark: [this.advanceTable.verificationRemark],
      bodyTemperatureImage: [this.advanceTable.bodyTemperatureImage],
      interiorsWithAmenities: [this.advanceTable.interiorsWithAmenities],
      frontPhoto: [this.advanceTable.frontPhoto],
      isolatedCabin: [this.advanceTable.isolatedCabin],
      selfieWithUniform: [this.advanceTable.selfieWithUniform],
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
    //console.log(this.advanceTableForm.value);
  }
  onNoClick(): void 
  {
    if(this.action==='edit'){
      this.dialogRef.close();

    }

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
            this.dialogRef.close(response);
            this.showNotification(
              'snackbar-success',
              'Duty Slip Quality CheckedBy Executive Updated...!!!',
              'bottom',
              'center'
            );
            this.saveDisabled = true;
        },
        error =>
        {
          this.showNotification(
            'snackbar-danger',
            'Operation Failed...!!!',
            'bottom',
            'center'
          );
          this.saveDisabled = true;
    }
   )
  }
  public confirmAdd(): void 
  {
    this.saveDisabled = false;
       if(this.action=="edit")
       {
          this.Put();
       }
      //  else
      //  {
      //     this.Post();
      //  }
  }
    /////////////////for Image Upload////////////////////////////
    public response: { dbPath: '' };
    public ImagePath: string = "";
    public ImagePath1: string = "";
    public ImagePath2: string = "";
    public ImagePath3: string = "";
    public ImagePath4: string = "";
    
    public uploadFinished = (event) => 
    {
      this.response = event;
      this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
      this.advanceTableForm.patchValue({selfieWithUniform:this.ImagePath})
    }
    public isolatedCabin = (event) => 
  {
    this.response = event;
    this.ImagePath1 = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({isolatedCabin:this.ImagePath1})
  }

  public FrontIcon = (event) => 
  {
    this.response = event;
    this.ImagePath2 = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({frontPhoto:this.ImagePath2})
  }
   public BodyTemperature  = (event) => 
  {
    this.response = event;
    this.ImagePath3 = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({bodyTemperatureImage:this.ImagePath3})
  }
  
  public InteriorsIcon  = (event) => 
  {
    this.response = event;
    this.ImagePath4 = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({interiorsWithAmenities:this.ImagePath4})
  }
     onContextMenu(event: MouseEvent, item: DutyAmenitieModel) {
         event.preventDefault();
         this.contextMenuPosition.x = event.clientX + 'px';
         this.contextMenuPosition.y = event.clientY + 'px';
         this.contextMenu.menuData = { item: item };
         this.contextMenu.menu.focusFirstItem('mouse');
         this.contextMenu.openMenu();
       }
   public loadDataForDutyAmenities() 
     {
      this.dutySlipQualityCheckService.getDutyAmenities(this.dutySlipID,this.SearchActivationStatus, this.PageNumber).subscribe
      (
        data =>   
        {
            this.dataSource = data;
            console.log(this.dataSource)
        },
        (error: HttpErrorResponse) => { this.dataSource = null;}
      );
    }
      NextCall()
    {
      if (this.dataSource?.length>0) 
      {
        this.PageNumber++;
        this.loadDataForDutyAmenities();
      }
    }
    PreviousCall()
    {
      if(this.PageNumber>0)
      {
        this.PageNumber--;
        this.loadDataForDutyAmenities(); 
      } 
    }
      SortingData(coloumName:any) {
   
    if (this.sortingData == 1) {

      this.sortingData = 0;
      this.sortType = "Ascending"
    }
    else {
      this.sortingData = 1;
      this.sortType = "Descending";
    }
    this.dutySlipQualityCheckService.getDutyAmenitiesSort(this.dutySlipID,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
       
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
   editDutyAmenitie(item:any)
      {
        const dialogRef = this.dialog.open(VerifiedDutyAmenitieDialogComponent, 
            {
              data: 
                {
                  advanceTable : item,
                  dutySlipID: this.dutySlipID,
                  action: 'edit'
                }
        });
        dialogRef.afterClosed().subscribe((result: any) => {
          this.loadDataForDutyAmenities();
          });
      }
}


