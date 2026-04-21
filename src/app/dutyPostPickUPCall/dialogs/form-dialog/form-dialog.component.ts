// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { DutyPostPickUPCallService } from '../../dutyPostPickUPCall.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { DutyPostPickUPCallModel} from '../../dutyPostPickUPCall.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { DatePipe, formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { OrganizationalEntityDropDown } from 'src/app/organizationalEntityMessage/organizationalEntityDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class DutyPostFormDialogComponent 
{
  // saveDisabled:boolean=true;
  showError: string;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: DutyPostPickUPCallModel;
  ReservationID: any;
  TransferID: any;
  TransferName: any;
  dataSource: DutyPostPickUPCallModel | null;

  public TransferedToLocationNameList?: OrganizationalEntityDropDown[] = [];
  filteredtransferedToLocationNameOptions: Observable<OrganizationalEntityDropDown[]>;
  
  TransferedToLocationID: any;
  employeeDataSource:EmployeeDropDown[] | [];
  LocationFrom: string;
  DutySlipID: any;
  dutySlipID: number;
  verifyDutyStatusAndCacellationStatus: string;
  isSaveAllowed: boolean = false;

  constructor(
    private datePipe: DatePipe,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<DutyPostFormDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: DutyPostPickUPCallService,
    private fb: FormBuilder,
    public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        this.verifyDutyStatusAndCacellationStatus = data.verifyDutyStatusAndCacellationStatus;
        this.dialogTitle = 'Post PickUP Call';
        // this.postPickUPCallLoadData();
        if (this.action === 'edit') 
        {     
          this.advanceTable = data.dutyPostPickUPCall;
          this.DutySlipID = data.dutySlipID;
       
        } 
        else 
        {
          
          this.advanceTable = new DutyPostPickUPCallModel({});
          this.advanceTable.activationStatus=true;
          this.DutySlipID = data.dutySlipID;
        }
        this.advanceTableForm = this.createContactForm();
        // if (this.verifyDutyStatusAndCacellationStatus !== 'Changes allow') 
        // {
        //   this.isSaveAllowed = true;
        // } 
        // else
        // {
        //   this.isSaveAllowed = false;
        // }
                 const status = (this.verifyDutyStatusAndCacellationStatus ?? '')
  .trim()
  .toLowerCase()
  .replace(/[^a-z\s]/g, ''); // 👈 ye line important hai

this.isSaveAllowed = status === 'changes allow';
  }

  ngOnInit()
  {
    // if(this.action === 'edit')
    // {
    //   this.GetTransferedByEmployee();
    //   // this.loadData();
    //   this.InitTransferToLocation();
    //   this.advanceTableForm?.controls["transferDate"].disable();
    //   this.advanceTableForm?.controls["transferTime"].disable();
    // }
    
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      dutyPostPickUPCallID: [this.advanceTable?.dutyPostPickUPCallID],
      dutySlipID: [this.DutySlipID],
      postPickUpCallMode: [this.advanceTable?.postPickUpCallMode],
      postPickUpCallDetails: [this.advanceTable?.postPickUpCallDetails],
      postPickUpCallDate: [this.advanceTable?.postPickUpCallDate],
      postPickUpCallTime: [this.advanceTable?.postPickUpCallTime],
      postPickUpCallByID:[this._generalService.getUserID()],
      //transferedByEmployeeName:[],
      activationStatus: [true],
    });
  }

  // public postPickUPCallLoadData() 
  // {
  //   this.advanceTableService.getDataDutyPostPickUpCall(this.dutySlipID).subscribe
  //   (
  //     data =>   
  //     {
  //       this.dataSource = data;
  //       this.advanceTableForm.patchValue({dutyPostPickUPCallID:this.dataSource.dutyPostPickUPCallID});
  //       this.advanceTableForm.patchValue({dutySlipID:this.dataSource.dutySlipID});
  //       this.advanceTableForm.patchValue({postPickUpCallMode:this.dataSource.postPickUpCallMode});
        
  //       this.advanceTableForm.patchValue({postPickUpCallDetails:this.dataSource.postPickUpCallDetails});
  //       this.advanceTableForm.patchValue({postPickUpCallDate:this.dataSource.postPickUpCallDate});  
        
  //       // this.advanceTableForm.patchValue({transferedToLocationID:this.dataSource.transferedToLocationID});
  //       // this.advanceTableForm.patchValue({transferedToLocationName:this.dataSource.transferedToLocationName});

  //       ////const transferDate = this.datePipe.transform(this.dataSource.transferDate, 'yyyy/MM/dd');
  //       this.advanceTableForm.patchValue({postPickUpCallTime:this.dataSource.postPickUpCallTime});

  //       ////const transferTime = this.datePipe.transform(this.dataSource.transferTime, 'HH:mm');
  //       this.advanceTableForm.patchValue({postPickUpCallByID:this.dataSource.postPickUpCallByID});
  //       // this.advanceTableForm.patchValue({transferRemark:this.dataSource.transferRemark});
        
  //     },
  //     (error: HttpErrorResponse) => { this.dataSource = null;}
  //   );
  // }

  submit() 
  {
  }
  onNoClick(): void 
  {
    if(this.action==='add'){
      this.advanceTableForm.reset();

    }
    else if(this.action==='edit'){
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

  public Post(): void
  {
    this.advanceTableService.add(this.advanceTableForm.getRawValue()).subscribe(
    response => 
    {
     
      this.dialogRef.close(response);
        this.showNotification(
          'snackbar-success',
          'Duty Post PickUP Call Created...!!!',
          'bottom',
          'center'
        );
      // this.saveDisabled = true; 
    },
    error =>
    {
      this.showNotification(
        'snackbar-danger',
        'Operation Failed.....!!!',
        'bottom',
        'center'
      );
      // this.saveDisabled = true; 
    }
    )
  }

  public Put(): void
  {
    this.advanceTableService.update(this.advanceTableForm.getRawValue()).subscribe(
    response => 
    {
      // this.dialogRef.close();
      this.dialogRef.close(response);
      this.showNotification(
        'snackbar-success',
        'Duty Post PickUP Call Updated...!!!',
        'bottom',
        'center'
      );     
      // this.saveDisabled = true; 
    },
    error =>
    {
     this.showNotification(
        'snackbar-danger',
        'Operation Failed.....!!!',
        'bottom',
        'center'
      );
    //  this.saveDisabled = true; 
    }
    )
  }

  public confirmAdd(): void 
  {
    // this.saveDisabled = false;
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


