// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { DutyInterstateTaxService } from '../../dutyInterstateTax.service';
import { FormControl, Validators, FormGroup, FormBuilder, AbstractControl, ValidatorFn, ValidationErrors} from '@angular/forms';
import { DutyInterstateTax, InterstateTax } from '../../dutyInterstateTax.model';
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
//import { InterStateTaxDropDown } from 'src/app/general/interStateTaxDropDown.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RegistrationDropDown } from 'src/app/interstateTaxEntry/registrationDropDown.model';
import { InterstateTaxEntryService } from 'src/app/interstateTaxEntry/interstateTaxEntry.service';
import { InterstateTaxEntry } from 'src/app/interstateTaxEntry/interstateTaxEntry.model';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class DITFormDialogComponent 
{
  saveDisabled:boolean=true;
  showError: string;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: DutyInterstateTax;
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;

  filteredStateOptions: Observable<StatesDropDown[]>;
  public StateList?: StatesDropDown[] = [];

  filteredUnpaidStateOptions: Observable<StatesDropDown[]>;
  public UnpaidStateList?: StatesDropDown[] = [];

  geoPointID: number;
  DutySlipID: any;
  ReservationID: any;

  isPaidCardVisible: boolean = false;
  isExistingCardVisible: boolean = false;
  dataList:InterstateTaxEntry[]=null;
   //public dataList?:InterStateTaxDropDown;
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
  registrationNumber:string='';
  interStateTaxStartDate:string ='';
  interStateTaxEndDate:string='';

  filteredRegistrationNumberOptions:Observable<RegistrationDropDown[]>;
  public RegistrationNumberList?: RegistrationDropDown[] = [];
  RegistrationNo:FormControl=new FormControl();
  vehicleID: any;
  geoPointName: FormControl = new FormControl();
  errorMessage: string;
  verifyDutyStatusAndCacellationStatus: any;
  isSaveAllowed: boolean = false;

  constructor(
  public dialogRef: MatDialogRef<DITFormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: DutyInterstateTaxService,
  public _interstateTaxEntryService: InterstateTaxEntryService,
    private fb: FormBuilder,
    public route:ActivatedRoute, 
    private snackBar: MatSnackBar,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        this.verifyDutyStatusAndCacellationStatus = data.verifyDutyStatusAndCacellationStatus;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Duty Interstate Tax';       
          this.advanceTable = data.advanceTable;
          // let startDate=moment(this.advanceTable.taxStartDate).format('DD/MM/yyyy');
          // this.onBlurPaidFromEdit(startDate);
          let endDate=moment(this.advanceTable.taxEndDate).format('DD/MM/yyyy');
          this.onBlurUpdateDateEdit(endDate);
        } else 
        {
          this.dialogTitle = 'Add Interstate Tax to';
          this.advanceTable = new DutyInterstateTax({});
          //this.advanceTable.activationStatus=true;
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
    console.log(this.ReservationID)
    this.InitState();
    this.InitStateOnSearch();
    //this.advanceTableForm.patchValue({approvalRemark:'N/A'});
    this.advanceTableForm.patchValue({approvalDate:new Date()});
    this.advanceTableForm.patchValue({activationStatus:true});
    this.advanceTableForm.patchValue({approvalStatus:"Accepted"});
    this.advanceTableForm.patchValue({dutySlipID:this.DutySlipID});
    this.InitApprovedBy();
    this.InitRegistrationNumber();
    //this.GetInterstateTaxImage();
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      dutyInterstateTaxID: [''],
      dutySlipID: [''],
      interStateTaxID: [0],
      //geoPointID: [this.advanceTable.geoPointID],
      taxStartDate: [''],
      taxEndDate: [''],
      paidUntilDate: [''],
      interStateTaxAmount: [''],
      amountToBeChargedInCurrentDuty: [''],
      interStateTaxPaidBy: [''],
      approvedByID: [''],
      approvedBy: [''],
      approvalStatus: [''],
      approvalDate: [''],
      approvalRemark: [''],
      activationStatus: [''],
      stateID:[0],
      state:[''],
      dutyInterstateTaxImage:[''],
      interStateTaxStartDate:[''],
      interStateTaxEndDate:[''],
      registrationNumber:['']
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}

// GetDataForInterstateTax()
//   {
//     var interStateTaxStartDate=moment(this.interStateTaxStartDate).format('yyyy-MM-DD');
//     var interStateTaxEndDate=moment(this.interStateTaxEndDate).format('yyyy-MM-DD');
//     var registrationNumber=this.registrationNumber;
//     console.log(interStateTaxStartDate,interStateTaxEndDate,registrationNumber);

//     this.advanceTableService.LoadInterstateTaxData(interStateTaxStartDate,interStateTaxEndDate,registrationNumber).subscribe(
//       (data)=>
//       {
//         this.dataList=data;       
//           this.advanceTableForm.patchValue({interStateTaxAmount: this.dataList.amount});
//           this.advanceTableForm.patchValue({taxStartDate: this.dataList.interStateTaxStartDate});
//           this.advanceTableForm.patchValue({taxEndDate: this.dataList.interStateTaxEndDate});
//           this.advanceTableForm.patchValue({dutyInterstateTaxImage: this.dataList.interStateTaxImage});
//           this.advanceTableForm.patchValue({interStateTaxID: this.dataList.interStateTaxID});  
//       }
//     );
//   }

  GetDataForInterstate()
  {
    if(this.interStateTaxStartDate === "")
      {
        var interStateTaxStartDate = "";
      }
    else
    {
      var interStateTaxStartDate=moment(this.interStateTaxStartDate).format('yyyy-MM-DD');
    }

    if(this.interStateTaxEndDate === "")
      {
        var interStateTaxEndDate = "";
      }
    else
    {
      var interStateTaxEndDate=moment(this.interStateTaxEndDate).format('yyyy-MM-DD');
    }
    var GeoPointName=this.geoPointName.value;
    var registrationNumber=this.RegistrationNumber;

    this._interstateTaxEntryService.getTableData(registrationNumber,GeoPointName,interStateTaxStartDate,interStateTaxEndDate,this.SearchActivationStatus, this.PageNumber).subscribe(
      data=>
      {
        
          this.dataList=data;   
          console.log(this.dataList)  
          if(this.dataList===null)  
          {
            this.errorMessage='No Interstate Tax Available';
          } 
          this.advanceTableForm.patchValue({interStateTaxAmount: this.dataList[0].amount});
          this.advanceTableForm.patchValue({taxStartDate: this.dataList[0].interStateTaxStartDate});
          this.advanceTableForm.patchValue({taxEndDate: this.dataList[0].interStateTaxEndDate});
          this.advanceTableForm.patchValue({dutyInterstateTaxImage: this.dataList[0].interStateTaxImage});
          this.advanceTableForm.patchValue({interStateTaxID: this.dataList[0].interstateTaxID});
          this.advanceTableForm.patchValue({stateID: this.dataList[0].geoPointID});
          this.advanceTableForm.patchValue({state: this.dataList[0].state});  
      }
    );
  }

  TaxData(item: any)
  {
    this.advanceTableForm.patchValue({interStateTaxAmount: this.dataList[item].amount});
    this.advanceTableForm.patchValue({taxStartDate: this.dataList[item].interStateTaxStartDate});
    this.advanceTableForm.patchValue({taxEndDate: this.dataList[item].interStateTaxEndDate});
    this.advanceTableForm.patchValue({dutyInterstateTaxImage: this.dataList[item].interStateTaxImage});
    this.advanceTableForm.patchValue({interStateTaxID: this.dataList[item].interstateTaxID});
    this.advanceTableForm.patchValue({stateID: this.dataList[item].geoPointID});
    this.advanceTableForm.patchValue({state: this.dataList[item].state}); 
    console.log(this.dataList[item])
    document.getElementById("exampleModalCenter").click();
  }

  InitRegistrationNumber(){
    this._generalService.GetRegistrationForDropDown().subscribe(
      data=>
      {
        this.RegistrationNumberList=data;
        this.filteredRegistrationNumberOptions = this.RegistrationNo.valueChanges.pipe(
          startWith(""),
          map(value => this._filterVehicle(value || ''))
        ); 
      });
  }
  
  private _filterVehicle(value: string): any {
    const filterValue = value.toLowerCase();
    // Only show results if 3 or more characters are typed
    if (filterValue.length < 3) {
      return [];
    }
    return this.RegistrationNumberList.filter(
      customer => 
      {
        return customer.registrationNumber.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }
   
  // GetInterstateTaxImage()
  // {
  //   this.advanceTableService.LoadInterstateTaxImage(this.InterStateTaxID).subscribe(
  //     data =>{
  //       this.taxImage=data;
  //       console.log(this.taxImage);

  //     }
  //   )
  // }

toggleExisting() {
   this.isExistingCardVisible = !this.isExistingCardVisible;
   this.isPaidCardVisible = false;
  // if (this.isExistingCardVisible) 
  // {
  //   this.loadDataForApp();
  // }
}

togglePaid(){
  this.isPaidCardVisible = !this.isPaidCardVisible;
  this.isExistingCardVisible = false;
  // if (this.isExistingCardVisible) 
  // {
  //   this.loadDataForApp();
  // }
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
stateValidator(StateList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // No value to validate, return null (no error)
      }
      const value = control.value?.toLowerCase();
      const match = StateList.some(group => group.geoPointName.toLowerCase() === value);
      return match ? null : { stateInvalid: true };
    };
  }


InitState()
 {
  this._generalService.getState().subscribe(
    data=>
    {
      this.StateList=data;
      this.advanceTableForm.controls['state'].setValidators([this.stateValidator(this.StateList)]);
      this.filteredStateOptions = this.advanceTableForm.controls["state"].valueChanges.pipe(
        startWith(""),
        map(value => this._filterState(value || ''))
      ); 
    }
  );
 }

private _filterState(value: string): any {
  const filterValue = value.toLowerCase();
  if (filterValue.length < 3) {
    return [];
  }
  return this.StateList.filter(
    customer =>
    {
      return customer.geoPointName.toLowerCase().includes(filterValue);
    }
  );
}

OnStateSelect(selectedState: string)
{
  const StateName = this.StateList.find(
  data => data.geoPointName === selectedState
  );
  if (selectedState) 
  {
    this.getStateID(StateName.geoPointID);
  }
}
getStateID(geoPointID: any) {
  this.geoPointID=geoPointID;
  this.advanceTableForm.patchValue({stateID:this.geoPointID});
}

InitStateOnSearch()
 {
  this._generalService.getState().subscribe(
    data=>
    {
      this.UnpaidStateList=data;
      this.filteredUnpaidStateOptions = this.geoPointName.valueChanges.pipe(
        startWith(""),
        map(value => this._filterStateOnSearch(value || ''))
      ); 
    }
  );
 }

private _filterStateOnSearch(value: string): any {
  const filterValue = value.toLowerCase();
  // Only show results if 3 or more characters are typed
  if (filterValue.length < 3) {
    return [];
  }
  return this.StateList.filter(
    customer =>
    {
      return customer.geoPointName.toLowerCase().indexOf(filterValue)===0;
    }
  );
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

  public Post(): void
  {
    debugger
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    { 
        
       this.showNotification(
        'snackbar-success',
        'Duty Interstate Tax Created...!!!',
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
        'Operation Failed.....!!!',
        'bottom',
        'center'
      );
      this.saveDisabled=true;
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
  public Put(): void
  {
   debugger
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {  
       this._generalService.sendUpdate('DutyInterstateTaxUpdate:DutyInterstateTaxView:Success');//To Send Updates  
       this.saveDisabled = true;
       this.dialogRef.close();
    },
    error =>
    {
     this._generalService.sendUpdate('DutyInterstateTaxAll:DutyInterstateTaxView:Failure');//To Send Updates  
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

  //Paid Until
  onBlurUpdateDate(value: string): void {
      value= this._generalService.resetDateiflessthan12(value);
    
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
        this.advanceTableForm.get('taxEndDate')?.setValue(formattedDate);    
    } else {
      this.advanceTableForm.get('taxEndDate')?.setErrors({ invalidDate: true });
    }
    }

    onBlurUpdateDateEdit(value: string): void {  
      const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
      if (validDate) {
        const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
        if(this.action==='edit')
        {
          this.advanceTable.taxEndDate=formattedDate
        }
        else{
          this.advanceTableForm.get('taxEndDate')?.setValue(formattedDate);
        }
        
      } else {
        this.advanceTableForm.get('taxEndDate')?.setErrors({ invalidDate: true });
      }
    }

  //Paid From
  onBlurPaidFrom(value: string): void {
    value= this._generalService.resetDateiflessthan12(value);
  
  const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
  if (validDate) {
    const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm.get('taxStartDate')?.setValue(formattedDate);    
  } else {
    this.advanceTableForm.get('taxStartDate')?.setErrors({ invalidDate: true });
  }
  }

  onBlurPaidFromEdit(value: string): void {  
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      if(this.action==='edit')
      {
        this.advanceTable.taxStartDate=formattedDate
      }
      else{
        this.advanceTableForm.get('taxStartDate')?.setValue(formattedDate);
      }
      
    } else {
      this.advanceTableForm.get('taxStartDate')?.setErrors({ invalidDate: true });
    }
  }
}



