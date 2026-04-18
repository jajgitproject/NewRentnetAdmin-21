// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { DutyInterstateTaxApprovalService } from '../../dutyInterstateTaxApproval.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { DutyInterstateTaxApproval, InterstateTax } from '../../dutyInterstateTaxApproval.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { StatesDropDown } from 'src/app/organizationalEntity/stateDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';
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

export class FormDialogComponent 
{
  showError: string;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: DutyInterstateTaxApproval;

  filteredStateOptions: Observable<StatesDropDown[]>;
  public StateList?: StatesDropDown[] = [];
  geoPointID: number;
  DutySlipID: any;
  ReservationID: any;

  isPaidCardVisible: boolean = false;
  isExistingCardVisible: boolean = false;
  //dataList:InterstateTax[]|[];
  dataList = [];
  RegistrationNumber: any;
  DropOffDate: any;
  PickupDate: any;
  //interStateTaxStartDate: any;
  //interStateTaxEndDate: any;
  amount: any;
  paidOn: any;
  public EmployeeList?: EmployeeDropDown[] = [];
  taxImage: any;
  //InterStateTaxID: number =1;
  registrationNumber:string;
  interStateTaxStartDate:string;
  interStateTaxEndDate:string;
  dataSource: DutyInterstateTaxApproval[]=[];
  activation: string;
  tableRecord: any;
  verifyDutyStatusAndCacellationStatus: any;
  isSaveAllowed: boolean = false;

  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: DutyInterstateTaxApprovalService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public route:ActivatedRoute,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        this.verifyDutyStatusAndCacellationStatus = data.verifyDutyStatusAndCacellationStatus;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Duty Interstate Tax';       
          this.advanceTable = data.advanceTable;
        } else 
        {
          this.dialogTitle = 'Add Interstate Tax to';
          this.advanceTable = new DutyInterstateTaxApproval({});
           // this.advanceTable.activationStatus=true;
        }
        console.log(this.advanceTable);
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
      // this.ReservationID   = paramsData.reservationID;   
      // this.DutySlipID   = paramsData.dutySlipID;
      // this.RegistrationNumber = paramsData.registrationNumber;
      // this.DropOffDate = paramsData.dropOffDate;
      // this.PickupDate = paramsData.pickupDate;
      const encryptedReservationID = paramsData.reservationID;
      const encryptedDutySlipID = paramsData.dutySlipID;
      const encryptedRegistrationNumber =  paramsData.registrationNumber
      const encryptedPickupDate =  paramsData.pickupDate
      const encryptedDropOffDate =  paramsData.dropOffDate

      this.ReservationID = this._generalService.decrypt(decodeURIComponent(encryptedReservationID));
      this.DutySlipID = this._generalService.decrypt(decodeURIComponent(encryptedDutySlipID));
      this.RegistrationNumber = this._generalService.decrypt(decodeURIComponent(encryptedRegistrationNumber));
      this.DropOffDate = this._generalService.decrypt(decodeURIComponent(encryptedDropOffDate));
      this.PickupDate = this._generalService.decrypt(decodeURIComponent(encryptedPickupDate));      
    });
    this.InitState();
    //this.advanceTableForm.patchValue({activationStatus:true});
    //this.advanceTableForm.patchValue({approvalStatus:"Accepted"});
    this.advanceTableForm.patchValue({dutySlipID:this.DutySlipID});
   // this.InitApprovedBy();
    this.DutyLoadData();
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      dutyInterstateTaxID: [this.advanceTable?.dutyInterstateTaxID || ''],
      dutySlipID: [this.advanceTable?.dutySlipID || ''],
      interStateTaxID: [this.advanceTable?.interStateTaxID || ''],
      //geoPointID: [this.advanceTable.geoPointID],
      taxStartDate: [this.advanceTable?.taxStartDate || ''],
      taxEndDate: [this.advanceTable?.taxEndDate || ''],
      paidUntilDate: [this.advanceTable?.paidUntilDate || ''],
      interStateTaxAmount: [this.advanceTable?.interStateTaxAmount || ''],
      amountToBeChargedInCurrentDuty: [this.advanceTable?.amountToBeChargedInCurrentDuty || ''],
      interStateTaxPaidBy: [this.advanceTable?.interStateTaxPaidBy || ''],
      approvedByID: [this.advanceTable?.approvedByID || ''],
      approvedBy: [this.advanceTable?.approvedBy || ''],
      approvalStatus: [this.advanceTable?.approvalStatus || ''],
      approvalDate: [this.advanceTable?.approvalDate || ''],
      approvalRemark: [this.advanceTable?.approvalRemark || ''],
      activationStatus: [this.advanceTable?.activationStatus || ''],
      stateID:[this.advanceTable?.stateID || ''],
      stateName:[this.advanceTable?.stateName || ''],
      dutyInterstateTaxImage:[this.advanceTable?.dutyInterstateTaxImage || ''],
      // interStateTaxStartDate:[''],
      // interStateTaxEndDate:[''],
      // registrationNumber:['']
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}

DutyLoadData()
  {
    console.log(this.DutySlipID);

    this.advanceTableService.LoadDutyInterstateTax(this.DutySlipID).subscribe(
      (data:DutyInterstateTaxApproval[])=>
      {
        this.dataSource=data;
        console.log(this.dataSource);
        this.advanceTableForm.patchValue({dutyInterstateTaxID:this.advanceTable?.dutyInterstateTaxID || this.dataSource[0].dutyInterstateTaxID});
        this.advanceTableForm.patchValue({dutySlipID:this.advanceTable?.dutySlipID || this.dataSource[0].dutySlipID});
        this.advanceTableForm.patchValue({taxStartDate:this.advanceTable?.taxStartDate || this.dataSource[0].taxStartDate});
        this.advanceTableForm.patchValue({taxEndDate:this.advanceTable?.taxEndDate || this.dataSource[0].taxEndDate});
        this.advanceTableForm.patchValue({interStateTaxAmount:this.advanceTable?.interStateTaxAmount || this.dataSource[0].interStateTaxAmount});
        this.advanceTableForm.patchValue({amountToBeChargedInCurrentDuty:this.advanceTable?.amountToBeChargedInCurrentDuty || this.dataSource[0].amountToBeChargedInCurrentDuty});
        this.advanceTableForm.patchValue({stateID: this.advanceTable?.stateID || this.dataSource[0].stateID});
        this.advanceTableForm.patchValue({stateName: this.advanceTable?.stateName || this.dataSource[0].stateName});
        this.advanceTableForm.patchValue({interStateTaxPaidBy:this.advanceTable?.interStateTaxPaidBy || this.dataSource[0].interStateTaxPaidBy});
        this.advanceTableForm.patchValue({approvedBy:this.advanceTable?.approvedBy || this.dataSource[0].approvedBy});
        this.advanceTableForm.patchValue({approvedByID:this.advanceTable?.approvedByID || this.dataSource[0].approvedByID});
        this.advanceTableForm.patchValue({approvalDate:new Date()});
        this.advanceTableForm.patchValue({activationStatus:this.advanceTable?.activationStatus || this.dataSource[0].activationStatus});
        this.advanceTableForm.patchValue({dutyInterstateTaxImage:this.advanceTable?.dutyInterstateTaxImage || this.dataSource[0].dutyInterstateTaxImage});
        this.advanceTableForm.patchValue({interStateTaxID:this.advanceTable?.interStateTaxID  ||this.dataSource[0].interStateTaxID});

        this.InitApprovedBy();
      }
    );
  }

InitApprovedBy()
{
  this._generalService.getEmployeeID(this._generalService.getUserID()).subscribe(
    data=>{
      this.EmployeeList=data;
      this.advanceTableForm.patchValue({approvedByID:this.EmployeeList[0].employeeID});
      this.advanceTableForm.patchValue({approvedBy:this.EmployeeList[0].firstName+' '+this.EmployeeList[0].lastName});
    }
  )
}

InitState()
 {
  this._generalService.getState().subscribe(
    data=>
    {
      this.StateList=data;
      console.log(this.StateList);
      this.filteredStateOptions = this.advanceTableForm.controls["state"].valueChanges.pipe(
        startWith(""),
        map(value => this._filterState(value || ''))
      ); 
    }
  );
 }

private _filterState(value: string): any {
  const filterValue = value.toLowerCase();
  return this.StateList.filter(
    customer =>
    {
      return customer.geoPointName.toLowerCase().indexOf(filterValue)===0;
    }
  );
}

getStateID(geoPointID: any) {
  this.geoPointID=geoPointID;
  this.advanceTableForm.patchValue({stateID:this.geoPointID});
}

  submit() 
  {
    //console.log(this.advanceTableForm.value);
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
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    { 
        this.dialogRef.close();
       this._generalService.sendUpdate('DutyInterstateTaxApprovalCreate:DutyInterstateTaxApprovalView:Success');//To Send Updates  
    
  },
    error =>
    {
       this._generalService.sendUpdate('DutyInterstateTaxApprovalAll:DutyInterstateTaxApprovalView:Failure');//To Send Updates  
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
       //this._generalService.sendUpdate('DutyInterstateTaxApprovalUpdate:DutyInterstateTaxApprovalView:Success');//To Send Updates 
       this.showNotification(
        'snackbar-success',
        'Duty Interstate Tax Approval Updated...!!!',
        'bottom',
        'center'
      );
       
    },
    error =>
    {
     //this._generalService.sendUpdate('DutyInterstateTaxApprovalAll:DutyInterstateTaxApprovalView:Failure');//To Send Updates
     this.showNotification(
      'snackbar-danger',
      'Operation Failed.....!!!',
      'bottom',
      'center'
    );  
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

  //********************* Image Upload *****************************//
  public response: { dbPath: '' };
  public ImagePath: string = "";

  public uploadFinished = (event) => 
  {
    this.response = event;
    this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({dutyInterstateTaxImage:this.ImagePath})
  }
}



