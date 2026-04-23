// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { ReservationLocationTransferLogService } from '../../reservationLocationTransferLog.service';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';
import { ReservationLocationTransferLogModel} from '../../reservationLocationTransferLog.model';
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

export class FormDialogComponent 
{
  saveDisabled:boolean=true;
  showError: string;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: ReservationLocationTransferLogModel;
  ReservationID: any;
  TransferID: any;
  TransferName: any;
    status: string = '';
  buttonDisabled: boolean = false;
  dataSource: ReservationLocationTransferLogModel | null;

  public TransferedToLocationNameList?: OrganizationalEntityDropDown[] = [];
  filteredtransferedToLocationNameOptions: Observable<OrganizationalEntityDropDown[]>;
  
  TransferedToLocationID: any;
  employeeDataSource:EmployeeDropDown[] | [];
  LocationFrom: string;

  constructor(
    private datePipe: DatePipe,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<FormDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: ReservationLocationTransferLogService,
    private fb: FormBuilder,
    public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          //this.dialogTitle ='Reservation Location Transfer';       
          this.advanceTable = data.advanceTable;
          this.ReservationID = data.reservationID;
            // Extract and normalize status, control button state
    this.status = this.extractStatus(data?.status);
    const normalized = (this.status || '').toLowerCase().trim();
    this.buttonDisabled = normalized !== 'changes allow';
          this.advanceTableForm?.controls["transferedFromLocationName"].disable();          
          // this.advanceTableForm?.controls["transferDate"].disable();
          // this.advanceTableForm?.controls["transferTime"].disable();
          //this.advanceTableForm?.controls['transferedFromLocationName'].setValue(this.advanceTable.transferedFromLocationName);          
        } 
        else 
        {
          this.dialogTitle = 'Reservation Location Transfer';
          this.advanceTable = new ReservationLocationTransferLogModel({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
        
  }
  private extractStatus(input: any): string {
    try {
      if (typeof input === 'string') return input;
      if (input && typeof input.status === 'string') return input.status;
      if (input && input.status && typeof input.status.status === 'string') return input.status.status;
      return '';
    } catch { return ''; }
  }

  ngOnInit()
  {
    if(this.action === 'edit')
    {
      this.GetTransferedByEmployee();
      this.loadData();
      this.InitTransferToLocation();
      this.advanceTableForm?.controls["transferDate"].disable();
      this.advanceTableForm?.controls["transferTime"].disable();
    }
    
  }
   
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      reservationLocationTransferLogID: [this.advanceTable?.reservationLocationTransferLogID],
      reservationID: [this.advanceTable?.reservationID],
      transferedFromLocationID: [this.advanceTable?.transferedFromLocationID],
      transferedFromLocationName: [this.advanceTable?.transferedFromLocationName],
      transferedToLocationID: [this.advanceTable?.transferedToLocationID],
      transferedToLocationName: [this.advanceTable?.transferedToLocationName],
      transferDate: [],
      transferTime: [],
      transferRemark:[],
      transferedByEmployeeID:[],
      transferedByEmployeeName:[],
      //activationStatus: [this.advanceTable?.activationStatus],
    });
  }

transferLocationValidator(list: any[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {

    if (!control.value) return null;

    const value = control.value
      ?.toString()
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();

    const match = list.some(item =>
      item.organizationalEntityName
        ?.replace(/\s+/g, ' ')
        .trim()
        .toLowerCase() === value
    );

    return match ? null : { transferedToLocationNameInvalid: true };
  };
}




  //---------- Transfer To Location ---------
InitTransferToLocation() {

  this._generalService.GetLocationHub().subscribe(data => {

    this.TransferedToLocationNameList = data;

    const control = this.advanceTableForm.get('transferedToLocationName');

    control?.setValidators([
      Validators.required,
      this.transferLocationValidator(this.TransferedToLocationNameList)
    ]);

    control?.updateValueAndValidity();

    this.filteredtransferedToLocationNameOptions =
      control?.valueChanges.pipe(
        startWith(""),
        map(value => this._filterTransferToLocation(value || ''))
      );
  });
}

  private _filterTransferToLocation(value: string): any {
    const filterValue = value.toLowerCase();
    return this.TransferedToLocationNameList.filter(
      data => 
      {
        return data.organizationalEntityName.toLowerCase().includes(filterValue);
      }
    );
  }
  OnTransferToLocationSelect(selectedTransferToLocation: string)
  {
    const selectedTransferToLocationName = this.TransferedToLocationNameList.find(
    data => data.organizationalEntityName === selectedTransferToLocation);
    if (selectedTransferToLocation) 
    {
      this.getTransferToLocationID(selectedTransferToLocationName.organizationalEntityID);
    }
  }
  getTransferToLocationID(locationHubID: any) 
  {    
    this.TransferedToLocationID = locationHubID;
    this.advanceTableForm.patchValue({transferedToLocationID:this.TransferedToLocationID});
  }

  //---------- Transfered By Employee  ----------
  GetTransferedByEmployee()
  {
    this._generalService.getEmployeeID(this._generalService.getUserID()).subscribe(
    data=>
    {
      this.employeeDataSource=data;
      this.advanceTableForm.controls["transferedByEmployeeName"].disable();
      this.advanceTableForm.patchValue({transferedByEmployeeName:this.employeeDataSource[0].firstName+" "+this.employeeDataSource[0].lastName});
      this.advanceTableForm.patchValue({transferedByEmployeeID:this.employeeDataSource[0].employeeID});
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  public loadData() 
  {
    this.advanceTableService.getTransferLocationFromReservation(this.ReservationID).subscribe
    (
      data =>   
      {
        this.dataSource = data;
        this.advanceTableForm.patchValue({reservationLocationTransferLogID:this.dataSource.reservationLocationTransferLogID});
        this.advanceTableForm.patchValue({transferedByEmployeeID:this.dataSource.transferedByEmployeeID});
        this.advanceTableForm.patchValue({transferedByEmployeeName:this.dataSource.transferedByEmployeeName});
        
        this.advanceTableForm.patchValue({transferedFromLocationID:this.dataSource.transferedFromLocationID});
        this.advanceTableForm.patchValue({transferedFromLocationName:this.dataSource.transferedFromLocationName});  
        this.LocationFrom = this.dataSource.transferedFromLocationName;

        // this.advanceTableForm.patchValue({transferedToLocationID:this.dataSource.transferedToLocationID});
        // this.advanceTableForm.patchValue({transferedToLocationName:this.dataSource.transferedToLocationName});

        ////const transferDate = this.datePipe.transform(this.dataSource.transferDate, 'yyyy/MM/dd');
        this.advanceTableForm.patchValue({transferDate:this.dataSource.transferDate});

        ////const transferTime = this.datePipe.transform(this.dataSource.transferTime, 'HH:mm');
        this.advanceTableForm.patchValue({transferTime:this.dataSource.transferTime});
        //this.advanceTableForm.patchValue({transferRemark:this.dataSource.transferRemark});
        
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }

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

  public Put(): void
  {
    this.advanceTableForm.patchValue({reservationID:this.ReservationID});
    this.advanceTableForm.patchValue({transferedFromLocationID:this.dataSource.transferedToLocationID});
    this.advanceTableForm.patchValue({transferedToLocationID:this.TransferedToLocationID});
    this.advanceTableForm.patchValue({transferedByEmployeeID:this.dataSource.transferedByEmployeeID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
      response => 
        {
          
          this.showNotification(
            'snackbar-success',
            'Reservation Location Transfer Updated...!!!',
            'bottom',
            'center'
          ); 
          this.saveDisabled = true; 
          this.dialogRef.close();
        },
    error =>
    {
     this._generalService.sendUpdate('ReservationLocationTransferLogAll:ReservationLocationTransferLogView:Failure');//To Send Updates  
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
  }

}


