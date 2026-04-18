// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { DutyTollParkingEntryService } from '../../dutyTollParkingEntry.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { DutyTollParkingEntry } from '../../dutyTollParkingEntry.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { TollParkingTypeDropDown } from '../../tollParkingDropDown.model';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogComponent 
{
  saveDisabled:boolean=true;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: DutyTollParkingEntry;
  public TollParkingTypeList?: TollParkingTypeDropDown[] = [];
  public EmployeeList?: EmployeeDropDown[]=[];
  dutySlipID: any;
  DutySlipID: string;
  verifyDutyStatusAndCacellationStatus: any;
  isSaveAllowed: boolean = false;

  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: DutyTollParkingEntryService,
  private fb: FormBuilder,
  private snackBar: MatSnackBar,
  private route:ActivatedRoute,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        this.dutySlipID=data.dutySlipID;
        this.verifyDutyStatusAndCacellationStatus = data.verifyDutyStatusAndCacellationStatus;
        console.log(data)
        if(this.action==='approval')
        {
          this.dialogTitle ='Toll Parking For Duty Slip No.';       
          this.advanceTable = data.advanceTable;
          console.log(this.advanceTable)
        }
        
        if(this.action==='add') 
        {
          this.dialogTitle = 'Toll Parking For Duty Slip No.';
          this.advanceTable = new DutyTollParkingEntry({});
          this.advanceTable.activationStatus=true;
          
        }
        this.advanceTableForm = this.createContactForm();
        if (this.verifyDutyStatusAndCacellationStatus !== 'Changes allow') 
        {
          this.isSaveAllowed = true;
        } 
        else
        {
          this.isSaveAllowed = false;
        }
  }

  public ngOnInit(): void
  {
    this.route.queryParams.subscribe(paramsData =>{
      const encryptedDutySlipID = paramsData.dutySlipID;
      this.DutySlipID = this._generalService.decrypt(decodeURIComponent(encryptedDutySlipID));           
    });
    if(this.action==='add')
    {
      this.advanceTableForm.patchValue({dutySlipID:this.DutySlipID});
      this.advanceTableForm.patchValue({approvalStatus:'Approved'});
      //this.advanceTableForm.patchValue({approvalRemark:'N/A'});
      this.advanceTableForm.patchValue({approvalDate:new Date()});
      this.advanceTableForm.patchValue({activationStatus:true});
      this.InitTollParkingType();
      this.InitApprovedBy();
    }
    if(this.action==='approval')
    {
      this.advanceTableForm.patchValue({dutyTollParkingID:this.advanceTable.dutyTollParkingID});
      this.advanceTableForm.patchValue({tollParkingTypeID:this.advanceTable.tollParkingTypeID});
      this.advanceTableForm.patchValue({tollParkingType:this.advanceTable.tollParkingType});
      this.advanceTableForm.patchValue({dutySlipID:this.advanceTable.dutySlipID});
      this.advanceTableForm.patchValue({tollParkingAmount:this.advanceTable.tollParkingAmount});
      this.advanceTableForm.patchValue({paymentType:this.advanceTable.paymentType});
      this.advanceTableForm.patchValue({tollParkingImage:this.advanceTable.tollParkingImage});
      this.advanceTableForm.patchValue({approvalStatus:this.advanceTable.approvalStatus});
      this.advanceTableForm.patchValue({approvedByID:this.advanceTable.approvedByID});
      this.advanceTableForm.patchValue({approvedBy:this.advanceTable.firstName+' '+this.advanceTable.lastName});
      this.advanceTableForm.patchValue({approvalRemark:this.advanceTable.approvalRemark});
      this.advanceTableForm.patchValue({approvalDate:this.advanceTable.approvalDate});
      this.advanceTableForm.patchValue({activationStatus:this.advanceTable.activationStatus});
    }
       
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      dutyTollParkingID: [''],
      tollParkingTypeID: [''],
      tollParkingType:[''],
      dutySlipID: [''],
      tollParkingAmount: [''],
      paymentType: [''],
      tollParkingImage: [''],
      approvalStatus: [''],
      approvedByID: [''],
      approvedBy: [''],
      approvalRemark: [''],
      approvalDate: [''],
      activationStatus: [''],
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}

InitApprovedBy()
{
  this._generalService.getEmployeeID(this._generalService.getUserID()).subscribe(
    data=>
    {
      this.EmployeeList=data
      this.advanceTableForm.patchValue({approvedByID: this.EmployeeList[0].employeeID});
      this.advanceTableForm.patchValue({approvedBy: this.EmployeeList[0].firstName +" "+this.EmployeeList[0].lastName});
    }
  );
}

InitTollParkingType() {
  this._generalService.GetTollParkingType().subscribe(
    data =>
    {
      this.TollParkingTypeList = data;   
    },
  );
 }

  submit() 
  {
    //console.log(this.advanceTableForm.value);
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
   this.advanceTableForm.patchValue({dutySlipID:this.dutySlipID});
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        
        this.showNotification(
          'snackbar-success',
          'Duty Toll Parking Created...!!!',
          'bottom',
          'center'
        );
        this.saveDisabled=true;
        this.dialogRef.close();
    
  },
    error =>
    {
      this.showNotification(
        'snackbar-danger',
        'Operation Failed...!!!',
        'bottom',
        'center'
      );
      this.saveDisabled=true;
    }
  )
  }
  public Put(): void
  {
   
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
    
        
        this.showNotification(
          'snackbar-success',
          'Duty Toll Parking Updated...!!!',
          'bottom',
          'center'
        );
        this.saveDisabled=true;
        this.dialogRef.close();
       //this._generalService.sendUpdate('DutyTollParkingEntryUpdate:DutyTollParkingEntryView:Success');//To Send Updates  
       
    },
    error =>
    {
      this.showNotification(
        'snackbar-danger',
        'Operation Failed...!!!',
        'bottom',
        'center'
      );
      this.saveDisabled=true;
     //this._generalService.sendUpdate('DutyTollParkingEntryAll:DutyTollParkingEntryView:Failure');//To Send Updates  
    }
  )
  }
  public confirmAdd(): void 
  {
    this.saveDisabled = false;
       if(this.action=="approval")
       {
          this.Put();
       }
       else
       {
          this.Post();
       }
  }

  // GetDutyTollParking()
  // {
  //   this.advanceTableService.GetTollParkingData(this.dutySlipID).subscribe(
  //     (data:DutyTollParkingEntry)=>{
  //       this.advanceTable=data;
  //       this.advanceTableForm.patchValue({dutyTollParkingID:this.advanceTable.dutyTollParkingID});
  //       this.advanceTableForm.patchValue({tollParkingTypeID:this.advanceTable.tollParkingTypeID});
  //       this.advanceTableForm.patchValue({tollParkingType:this.advanceTable.tollParkingType});
  //       this.advanceTableForm.patchValue({dutySlipID:this.advanceTable.dutySlipID});
  //       this.advanceTableForm.patchValue({tollParkingAmount:this.advanceTable.tollParkingAmount});
  //       this.advanceTableForm.patchValue({paymentType:this.advanceTable.paymentType});
  //       this.advanceTableForm.patchValue({tollParkingImage:this.advanceTable.tollParkingImage});
  //       this.advanceTableForm.patchValue({approvedByID:this.advanceTable.approvedByID});
  //       this.advanceTableForm.patchValue({approvalDate:new Date()});
  //       this.advanceTableForm.patchValue({activationStatus:true});
  //     }
  //   )
  // }

  public response: { dbPath: '' };
  public ImagePath: string = "";

  public uploadFinished = (event) => 
  {
    this.response = event;
    this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({tollParkingImage:this.ImagePath});
  }

}


