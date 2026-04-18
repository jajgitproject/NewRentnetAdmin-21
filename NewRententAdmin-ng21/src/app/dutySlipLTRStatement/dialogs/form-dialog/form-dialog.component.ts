// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DutySlipLTRStatementModel } from '../../dutySlipLTRStatement.model';
import { DutySlipLTRStatementService } from '../../dutySlipLTRStatement.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CityDropDown } from 'src/app/city/cityDropDown.model';

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
  advanceTable: DutySlipLTRStatementModel;
  gstPercentageID: number;
  DutySlipID: any;
  holidays: boolean[] = [];
  dataSaved: boolean = false;
  changedControls: boolean[] = [false];
  editControls:boolean[]=[false];
  dataUpdated: boolean = false;
  public dayDifferences: number[] = [];
  dataSource: DutySlipLTRStatementModel | null;
  ReservationID:any;
  ltrStatementID:any;
  distanceDifference: number;
  CustomerID:any;
  hours: number;
  dataSourceLoadData: DutySlipLTRStatementModel[] =[];
  guestName: string;
  public CityList?: CityDropDown[] = [];
  filteredStartCityOptions: Observable<CityDropDown[]> ;
  public CityEndList?: CityDropDown[] = [];
  filteredEndCityOptions: Observable<CityDropDown[]>;
  cityID: any;
  nightChargeable: boolean;
  index:number;
  PickupDate: any;
  PackageID: any;

  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: DutySlipLTRStatementService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        // console.log(this.editControls)
        // console.log(this.dataUpdated)
        // console.log(this.changedControls)
        // console.log(this.dataSaved)
        this.index=data.index
        if(this.dataSaved===true)
          {
            this.editControls[this.index]=true;
          }
          else{
            this.changedControls[this.index]=true;
          }
             
          this.dialogTitle ='Duty Slip LTR';       
          this.advanceTable = data.advanceTable;
         
        
          //   //this.changedControls=true;
          //   this.dialogTitle = 'Duty Slip LTR';
          //   this.advanceTable = data.advanceTable;         

          // }
         
     
        this.advanceTableForm = this.createContactForm();
        this.DutySlipID=data.DutySlipID;
        this.ReservationID=data.ReservationID;
        this.CustomerID=data.CustomerID;
        this.PickupDate = data.pickupDate;
        this.PackageID = data.packageID;
  }
  
  ngOnInit()
  {
    this.InitCitiesForStartCity();
    this.InitCitiesForEndCity();
    this.loadKMHR();

  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
    dutySlipLTRStatementID:[this.advanceTable.dutySlipLTRStatementID],
    dutySlipID:[this.advanceTable.dutySlipID],
    reservationID:[this.advanceTable.reservationID],
    guestName:[this.advanceTable.guestName],
    dutyStartCityID: [this.advanceTable.dutyStartCityID],
    dutyStartCity: [this.advanceTable.dutyStartCity],
    dutyStartAddress: [this.advanceTable.dutyStartAddress],
    dutyStartDate:[this.advanceTable.dutyStartDate],
    dutyStartTime:[this.advanceTable.dutyStartTime],
    dutyStartKM:[this.advanceTable.dutyStartKM],
    dutyEndCityID:[this.advanceTable.dutyEndCityID],
    dutyEndCity:[this.advanceTable.dutyEndCity],
    dutyEndAddress:[this.advanceTable.dutyEndAddress],
    dutyEndDate:[this.advanceTable.dutyEndDate],
    dutyEndTime:[this.advanceTable.dutyEndTime],
    dutyEndKM:[this.advanceTable.dutyEndKM],
    totalKm:[this.advanceTable.totalKm],
    totalHours:[this.advanceTable.totalHours],
    packageKM:[this.advanceTable.packageKM],
    packageHours:[this.advanceTable.packageHours],
    packageBaseRate:[this.advanceTable.packageBaseRate],
    extraKM:[this.advanceTable.extraKM],
    extraKMRate:[this.advanceTable.extraKMRate],
    extraKMAmount:[this.advanceTable.extraKMAmount],
    extraHour:[this.advanceTable.extraHour],
    extraHourRate:[this.advanceTable.extraHourRate],
    extraHourAmount:[this.advanceTable.extraHourAmount],
    totalToll:[this.advanceTable.totalToll],
    tollImages:[this.advanceTable.tollImages],
    totalParking:[this.advanceTable.totalParking],
    parkingImages:[this.advanceTable.parkingImages],
    totalInterStateTax:[this.advanceTable.totalInterStateTax],
    interStateTaxImages:[this.advanceTable.interStateTaxImages],
    driverAllowanceAmount:[this.advanceTable.driverAllowanceAmount],
    nightChargeAmount:[this.advanceTable.nightChargeAmount],
    totalAmount:[this.advanceTable.totalAmount],
    activationStatus:[this.advanceTable.activationStatus],
    numberOfNights:[this.advanceTable.numberOfNights],
    numberOfDays:[this.advanceTable.numberOfDays],
    driverAllowanceRate:[this.advanceTable.driverAllowanceRate],
    nightChargeRate:[this.advanceTable.nightChargeRate]
    });
  }

 
  
  
/////////////////for Image Upload////////////////////////////
public response: { dbPath: '' };
public ImagePath: string;
public ImagePath1: string = "";
public ImagePath2: string = "";

public uploadFinishedTollImage = (event,i:any) => 
{
  if(this.dataSaved===true)
  {
    this.editControls[this.index]=true;
  }
  else{
    this.changedControls[this.index]=true;
  }
  
  this.response = event;
  this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
  this.advanceTableForm.patchValue({
    [`tollImages`]: this.ImagePath
});
}

public uploadFinishedParkingImage = (event) => 
{
  if(this.dataSaved===true)
  {
    this.editControls[this.index]=true;
  }
  else{
    this.changedControls[this.index]=true;
  }
  this.response = event;
  this.ImagePath1 = this._generalService.getImageURL() + this.response.dbPath;
  //this.advanceTableForm.patchValue({parkingImages:this.ImagePath1})
  this.advanceTableForm.patchValue({
    [`parkingImages`]: this.ImagePath1
});
}

public uploadFinishedInterStateTaxImages = (event,i:any) => 
{
  if(this.dataSaved===true)
  {
    this.editControls[this.index]=true;
  }
  else{
    this.changedControls[this.index]=true;
  }
  this.response = event;
  this.ImagePath2 = this._generalService.getImageURL() + this.response.dbPath;
  //this.advanceTableForm.patchValue({interStateTaxImages:this.ImagePath2})
  this.advanceTableForm.patchValue({
    [`interStateTaxImages`]: this.ImagePath2
});
}

/////////////////for Image Upload ends////////////////////////////

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}

  submit() {}

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

    this.advanceTableForm.patchValue({dutySlipID:this.DutySlipID});
    this.advanceTableForm.patchValue({reservationID:this.ReservationID});
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
      (response) => {
        this.ltrStatementID = response.dutySlipLTRStatementID;
        this.dataSaved = true;
        this.changedControls[this.index] = false;
        this.editControls[this.index]=true;
        this._generalService.sendUpdate('DutySlipLTRStatementCreate:DutySlipLTRStatementView:Success');
    },
    (error) => {
      this.dataSaved = false;
      this._generalService.sendUpdate('DutySlipLTRStatementAll:DutySlipLTRStatementView:Failure');
  }
    )
  }


  public Put(): void
  {

    this.advanceTableForm.patchValue({dutySlipLTRStatementID:this.ltrStatementID});
    this.advanceTableForm.patchValue({dutySlipID:this.DutySlipID || this.advanceTable.dutySlipID});
    this.advanceTableForm.patchValue({reservationID:this.ReservationID || this.advanceTable.reservationID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
      (response) => {
        this.ltrStatementID = response.dutySlipLTRStatementID;
        this.dataUpdated = true;
        this.changedControls[this.index] = false;
        this.editControls[this.index]=true;
        this._generalService.sendUpdate('DutySlipLTRStatementUpdate:DutySlipLTRStatementView:Success');
    },
    (error) => {
        this.dataUpdated = false;
        this._generalService.sendUpdate('DutySlipLTRStatementAll:DutySlipLTRStatementView:Failure');
    }
    )
  }


  public confirmAdd(): void 
  {
    if(this.editControls[this.index]===true)
    {
      this.Put();
      }
      else
      {
        this.Post();
      }
  }
  //----------- City Drop Down For Start City-----------

  InitCitiesForStartCity() {
    this._generalService.GetCitiessAll().subscribe(
      (data) => {
        this.CityList = data;
       
          const controlName = `dutyStartCity`;
          this.filteredStartCityOptions= this.advanceTableForm.controls[controlName]?.valueChanges.pipe(
            startWith(""),
            map((value) => this._filterCity(value || ""))
          );
      },
      (error) => {
        console.error("Error fetching city data", error);
      }
    );
  }
  
  private _filterCity(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.CityList.filter((data) =>
      data.geoPointName.toLowerCase().startsWith(filterValue)
    );
  }
  
  getStartCityID(geoPointID: any, i: number)
  {
    this.cityID = geoPointID;
    this.advanceTableForm.patchValue({
      dutyStartCityID: this.cityID,
    });
  }
  
  
  //----------- City Drop Down For End City-----------
  InitCitiesForEndCity() 
  {
    this._generalService.GetCitiessAll().subscribe(
      data => {
        this.CityEndList = data; 
       
            const controlName = `dutyEndCity`;
            this.filteredEndCityOptions = this.advanceTableForm.controls[controlName]?.valueChanges.pipe(
              startWith(""),
              map((value) => this._filterEndCity(value || ""))
            );
          },
      error => {}
    );
  }
  private _filterEndCity(value: string): any {
    const filterValue = value.toLowerCase();
    return this.CityEndList.filter((data) =>
      data.geoPointName.toLowerCase().startsWith(filterValue)
    );
  }
  getEndCityID(geoPointID: any, i:number) 
  {
    this.cityID=geoPointID;
    this.advanceTableForm.patchValue({
      dutyEndCityID: this.cityID,
    });
  }
  ///--------------------------------------------

  onDateChange(rowIndex: number): void {
    if(this.dataSaved===true)
    {
      this.editControls[rowIndex]=true;
    }
    else{
      this.changedControls[rowIndex]=true;
    }
    
    let startDate:Date;
    startDate = this.advanceTableForm.get(`dutyStartDate${rowIndex}`)?.value;
    let startTime:Date;
    startTime=this.advanceTableForm.get(`dutyStartTime${rowIndex}`)?.value;

    let dropOffDate:Date;
    dropOffDate=this.advanceTableForm.get(`dutyEndDate${rowIndex}`)?.value;

    let dropOffTime:Date;
    dropOffTime=this.advanceTableForm.get(`dutyEndTime${rowIndex}`)?.value;
    if (startTime && startDate) {
      this.dataSource.dutyStartDateString = this._generalService.getTimeApplicable(startDate);
      this.dataSource.dutyStartTimeString = this._generalService.getTimeApplicable(startTime);
      
    }
    this.dataSource.dutyStartCityID=this.advanceTableForm.get(`dutyStartCityID${rowIndex}`)?.value;
    this.dataSource.dutyStartAddress=this.advanceTableForm.get(`dutyStartAddress${rowIndex}`)?.value;  
    this.dataSource.dutyStartKM=this.advanceTableForm.get(`dutyStartKM${rowIndex}`)?.value;
    

    this.dataSource.dutySlipID=this.DutySlipID;

    //const formattedDropOffTime=this.advanceTableForm.get(`dutyEndTime${rowIndex}`)?.value;
    if(dropOffDate && dropOffTime)
    {
      this.dataSource.dutyEndTimeString=this._generalService.getTimeApplicable(dropOffTime);
      this.dataSource.dutyEndDateString=this._generalService.getTimeApplicable(dropOffDate);
    }
    
    this.dataSource.dutyEndCityID=this.advanceTableForm.get(`dutyEndCityID${rowIndex}`)?.value;
    this.dataSource.dutyEndAddress=this.advanceTableForm.get(`dutyEndAddress${rowIndex}`)?.value;
    this.dataSource.dutyEndKM=this.advanceTableForm.get(`dutyEndKM${rowIndex}`)?.value;

    this.advanceTableService.getDataByDate(this.dataSource).subscribe(
        (data: DutySlipLTRStatementModel) => {
            if (data) {
              this.advanceTableForm.patchValue({
                    [`dutySlipLTRStatementID${rowIndex}`]: data.dutySlipLTRStatementID,
                    [`dutySlipID${rowIndex}`]: data.dutySlipID,
                    [`reservationID${rowIndex}`]: data.reservationID,
                    [`guestName${rowIndex}`]: data.guestName,
                    [`dutyStartCityID${rowIndex}`]: data.dutyStartCityID,
                    [`dutyStartCity${rowIndex}`]: data.dutyStartCity,
                    [`dutyStartAddress${rowIndex}`]: data.dutyStartAddress,
                    [`dutyStartDate${rowIndex}`]: data.dutyStartDate, 
                    [`dutyStartTime${rowIndex}`]: data.dutyStartTime,
                    [`dutyStartKM${rowIndex}`]: data.dutyStartKM,
                    [`dutyEndCityID${rowIndex}`]: data.dutyEndCityID,
                    [`dutyEndCity${rowIndex}`]: data.dutyEndCity,
                    [`dutyEndAddress${rowIndex}`]: data.dutyEndAddress,
                    [`dutyEndDate${rowIndex}`]: data.dutyEndDate,
                    [`dutyEndTime${rowIndex}`]: data.dutyEndTime,
                    [`dutyEndKM${rowIndex}`]: data.dutyEndKM,
                    [`totalKm${rowIndex}`]: data.totalKm,
                    [`totalHours${rowIndex}`]: data.totalHours,
                    [`packageKM${rowIndex}`]: data.packageKM,
                    [`packageHours${rowIndex}`]: data.packageHours,
                    [`packageBaseRate${rowIndex}`]: data.packageBaseRate,
                    [`extraKM${rowIndex}`]: data.extraKM,
                    [`extraKMRate${rowIndex}`]: data.extraKMRate,
                    [`extraKMAmount${rowIndex}`]: data.extraKMAmount,
                    [`extraHour${rowIndex}`]: data.extraHour,
                    [`extraHourRate${rowIndex}`]: data.extraHourRate,
                    [`extraHourAmount${rowIndex}`]: data.extraHourAmount,
                    [`totalToll${rowIndex}`]: data.totalToll,
                    [`tollImages${rowIndex}`]: data.tollImages,
                    [`totalParking${rowIndex}`]: data.totalParking,
                    [`parkingImages${rowIndex}`]: data.parkingImages,
                    [`totalInterStateTax${rowIndex}`]: data.totalInterStateTax,
                    [`interStateTaxImages${rowIndex}`]: data.interStateTaxImages,
                    [`driverAllowanceRate${rowIndex}`]: data.driverAllowanceAmount,
                    [`driverAllowanceAmount${rowIndex}`]: data.driverAllowanceAmount,
                    [`numberOfNights${rowIndex}`]: 0,
                    [`numberOfDays${rowIndex}`]: 0,
                    [`nightChargeRate${rowIndex}`]: data.nightChargeAmount,
                    [`nightChargeAmount${rowIndex}`]: data.nightChargeAmount,
                    [`totalAmount${rowIndex}`]: data.totalAmount,
                    [`activationStatus${rowIndex}`]: data.activationStatus,
                });
            }
        },
        (error: HttpErrorResponse) => {
            console.error("Error fetching data for the selected date:", error);
        }
    );
}

//--------------------

public loadDataForDropOff() {
  this.advanceTableService.getLTRData(this.ReservationID).subscribe(
    (data: any) => {
      this.dataSourceLoadData = data;
      let initialEndDate = new Date(this.dataSourceLoadData[0].pickupDate);

      const formatDateToYYYYMMDD = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-based
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      for (let i = 0; i < this.dayDifferences.length; i++) {
        let dropOffDate: Date;

        if (i === 0) {
          dropOffDate=initialEndDate;
        } else {

          dropOffDate = new Date(initialEndDate); 
          dropOffDate.setDate(initialEndDate.getDate() + i); 
        }

        this.advanceTableForm.patchValue({
          dutyEndDate:  formatDateToYYYYMMDD(dropOffDate),
        });
      }
      this.loadDateTimeKM();
    },
    (error: HttpErrorResponse) => {
      this.dataSource = null;
    }
  );
}


public loadDateTimeKM() {
  this.advanceTableService.getDateTimeKM(this.DutySlipID).subscribe(
      (data: any) => {
          const locationOutDate = new Date(data.locationOutDate);
          const locationOutTime = new Date(data.locationOutTime);
          //const locationOutKM = data.locationOutKM;
          const locationOutKM =0;
          const dropOffDate = new Date(data.dropOffDate);
          const dropOffTime = new Date(data.dropOffTime);
          //const dropOffKM = data.dropOffKM;
          const dropOffKM =0;

          const locoutDateTime = new Date(locationOutDate);
          locoutDateTime.setHours(locationOutTime.getHours());
          locoutDateTime.setMinutes(locationOutTime.getMinutes());

          const dropOffDateTime = new Date(dropOffDate);
          dropOffDateTime.setHours(dropOffTime.getHours());
          dropOffDateTime.setMinutes(dropOffTime.getMinutes());

          const timeDifference = dropOffDateTime.getTime() - locoutDateTime.getTime();
          this.hours = Math.floor(timeDifference / (1000 * 60 * 60));
          const minutes = String(Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
          this.distanceDifference = dropOffKM - locationOutKM;

          // Patch values for each day
          for (let i = 0; i < this.dayDifferences.length; i++) {
              this.advanceTableForm.patchValue({
                 dutyStartKM: locationOutKM, // Bind to each row
                 dutyEndKM: dropOffKM,       // Bind to each row
                 totalKm: this.distanceDifference, // Bind to each row
                 totalHours: this.hours      // Bind to each row
              });
              // this.getTotalKMs(i);
          }
          this.loadKMHR();
      },
      (error: HttpErrorResponse) => { 
          console.error('Error loading date and time KM:', error);
          this.dataSource = null; 
      }
  );
}

getTotalKMs()
{
  if(this.dataSaved===true)
  {
    this.editControls[this.index]=true;
  }
  else
  {
    this.changedControls[this.index]=true;
  }
  
    const dutyStartKM=this.advanceTableForm.get(`dutyStartKM`)?.value;
    const dutyEndKM=this.advanceTableForm.get(`dutyEndKM`)?.value;
    this.distanceDifference=dutyEndKM-dutyStartKM;
    this.advanceTableForm.patchValue({
      totalKm: this.distanceDifference    // Bind to each row
  });

   this.loadKMHR();
 // this.getDateTime();
  //this.onTotalTollParkingInterStateChange(i);
  //this.loadTotalAmount();
}


public loadKMHR() {
  this.advanceTableService.getKMHR(this.CustomerID,this.PackageID,this.PickupDate).subscribe(
      (data: any) => {
          this.dataSource = data;
          
          this.nightChargeable=this.dataSource.nightChargeable;
              
          this.loadTotalAmount();
      },
      (error: HttpErrorResponse) => {
          console.error('Error loading KM and HR:', error);
          this.dataSource = null; 
      }
  );
}

loadTotalAmount() {
      const extraKMAmount = this.advanceTableForm.value[`extraKMAmount`] || 0;
      const extraHourAmount = this.advanceTableForm.value[`extraHourAmount`] || 0;
      const totalAmtForIndex = extraKMAmount + extraHourAmount;
      this.advanceTableForm.patchValue({ totalAmount: totalAmtForIndex });

}


  onTotalTollParkingInterStateChange() {
    if(this.dataSaved===true)
    {
      this.editControls[this.index]=true;
    }
    else{
      this.changedControls[this.index]=true;
    }
    
    const extraKMAmount = this.advanceTableForm.get(`extraKMAmount`)?.value || 0;
    const extraHourAmount = this.advanceTableForm.get(`extraHourAmount`)?.value || 0;
    
    const totaltoll = Number(this.advanceTableForm.get(`totalToll`)?.value) || 0;
    const totalParking = Number(this.advanceTableForm.get(`totalParking`)?.value) || 0;
    const totalIST = Number(this.advanceTableForm.get(`totalInterStateTax`)?.value) || 0;

    const driverAllowanceAmount = Number(this.advanceTableForm.get(`driverAllowanceAmount`)?.value) || 0;
    const nightChargeAmount = Number(this.advanceTableForm.get(`nightChargeAmount`)?.value) || 0;

    const totalAmount = extraKMAmount + extraHourAmount + totaltoll + totalParking + totalIST + driverAllowanceAmount + nightChargeAmount;

    this.advanceTableForm.patchValue({
        [`totalAmount`]: totalAmount
    });
    this.getDateTime();
}

public loadDatesDiff() {
  this.advanceTableService.getPickupDropoffDate(this.DutySlipID).subscribe(
    (data: any) => {
      const dropoffDate: Date = new Date(data.dropoffDate);
      const pickupDate: Date = new Date(data.pickupDate);
      const timeDifference: number = dropoffDate.getTime() - pickupDate.getTime(); 
      const days: number = timeDifference / (1000 * 3600 * 24);
      this.dayDifferences = Array.from({ length: days }, (_, i) => i + 1);
      this.dayDifferences.forEach((_, i) => {
        this.advanceTableForm.addControl(`dutyStartCity`, new FormControl('', Validators.required));
        this.advanceTableForm.addControl(`holiday`, new FormControl(false)); // Initialize checkbox as false
        this.advanceTableForm.addControl(`dutyStartAddress`, new FormControl(''));
        this.advanceTableForm.addControl(`dutyStartDate`, new FormControl(''));
        this.advanceTableForm.addControl(`dutyStartTime`, new FormControl(''));
        this.advanceTableForm.addControl(`dutyStartKM`, new FormControl(''));
        this.advanceTableForm.addControl(`dutyEndCity`, new FormControl(''));
        this.advanceTableForm.addControl(`dutyEndAddress`, new FormControl(''));
        this.advanceTableForm.addControl(`dutyEndDate`, new FormControl(''));
        this.advanceTableForm.addControl(`dutyEndTime`, new FormControl(''));
        this.advanceTableForm.addControl(`dutyEndKM`, new FormControl(''));
        this.advanceTableForm.addControl(`totalKm`, new FormControl(''));
        this.advanceTableForm.addControl(`totalHours`, new FormControl(''));

        this.advanceTableForm.addControl(`packageKM`, new FormControl(''));
        this.advanceTableForm.addControl(`packageHours`, new FormControl(''));
        this.advanceTableForm.addControl(`packageBaseRate`, new FormControl(''));
        this.advanceTableForm.addControl(`extraKM`, new FormControl(''));
        this.advanceTableForm.addControl(`extraKMRate`, new FormControl(''));
        this.advanceTableForm.addControl(`extraKMAmount`, new FormControl(''));
        this.advanceTableForm.addControl(`extraHourRate`, new FormControl(''));
        this.advanceTableForm.addControl(`extraHourAmount`, new FormControl(''));
        this.advanceTableForm.addControl(`totalToll`, new FormControl(''));
        this.advanceTableForm.addControl(`extraHour`, new FormControl(''));
        this.advanceTableForm.addControl(`tollImages`, new FormControl(null));
        this.advanceTableForm.addControl(`totalParking`, new FormControl(''));
        this.advanceTableForm.addControl(`parkingImages`, new FormControl(null));
        this.advanceTableForm.addControl(`totalInterStateTax`, new FormControl(''));
        this.advanceTableForm.addControl(`interStateTaxImages`, new FormControl(null));
        this.advanceTableForm.addControl(`numberOfDays`, new FormControl(''));
        this.advanceTableForm.addControl(`driverAllowanceRate`, new FormControl(''));
        this.advanceTableForm.addControl(`driverAllowanceAmount`, new FormControl(''));
        this.advanceTableForm.addControl(`numberOfNights`, new FormControl(''));
        this.advanceTableForm.addControl(`nightChargeRate`, new FormControl(''));
        this.advanceTableForm.addControl(`nightChargeAmount`, new FormControl(''));
        this.advanceTableForm.addControl(`totalAmount`, new FormControl(''));
        this.advanceTableForm.addControl(`activationStatus`, new FormControl(true));
      });
      //this.loadData();
      
    },
    (error: HttpErrorResponse) => {
      console.error(error.message);
    }
  );
}

// public loadData() {
// this.advanceTableService.getLTRData(this.ReservationID).subscribe(
//   (data: any) => {
//     this.dataSourceLoadData = data;
//     let initialStartDate = new Date(this.dataSourceLoadData[0].pickupDate);
   
//       const pickupCity = this.dataSourceLoadData[0].pickupCity;
//       const pickupAddress = this.dataSourceLoadData[0].pickupAddress;
//       let pickupDate: Date;

//       if (i === 0) {
//         pickupDate = initialStartDate;
//       } else {
//         pickupDate = new Date(initialStartDate); 
//         pickupDate.setDate(initialStartDate.getDate() + i);
//       }
      
//       const pickupTime = this.dataSourceLoadData[0].pickupTime;
//       const dropOffSpot = this.dataSourceLoadData[0].dropOffSpot;
//       const dropOffAddress = this.dataSourceLoadData[0].dropOffAddress;
//       //const dropOffDate = this.dataSourceLoadData[0].dropOffDate;
//       const dropOffTime = this.dataSourceLoadData[0].dropOffTime;
//       const pickupCityID = this.dataSourceLoadData[0].pickupCityID;
//       const dropOffSpotID = this.dataSourceLoadData[0].dropOffSpotID;
//       this.guestName = this.dataSourceLoadData[0].customerName;
//       if (!this.advanceTableForm.get(`dutyStartCityID`)) {
//         this.advanceTableForm.addControl(`dutyStartCityID`, new FormControl(''));
//       }
//       if (!this.advanceTableForm.get(`dutyEndCityID`)) {
//         this.advanceTableForm.addControl(`dutyEndCityID`, new FormControl(''));
//       }
//       if (!this.advanceTableForm.get(`guestName`)) {
//         this.advanceTableForm.addControl(`guestName`, new FormControl(''));
//       }

//       this.advanceTableForm.patchValue({
//        dutyStartCityID: pickupCityID,
//        dutyStartCity: pickupCity,
//        dutyStartAddress: pickupAddress,
//        dutyStartDate: pickupDate.toISOString().split('T')[0],
//        dutyStartTime: pickupTime,
//        dutyEndDate:  pickupDate.toISOString().split('T')[0],
//        dutyEndCityID: dropOffSpotID,
//        dutyEndCity: dropOffSpot,
//        dutyEndAddress: dropOffAddress,
//        dutyEndTime: dropOffTime,
//        guestName: this.guestName
//       });
    
//     //this.loadDataForDropOff();
//     this.loadDateTimeKM();
//   },
//   (error: HttpErrorResponse) => {
//     this.dataSource = null;
//   }
// );
// }

getDateTime()
{

  const dutyStartDate=this.advanceTableForm.get(`dutyStartDate`)?.value;
  const dutyStartTime=this.advanceTableForm.get(`dutyStartTime`)?.value;

  const dutyEndDate=this.advanceTableForm.get(`dutyEndDate`)?.value;
  const dateObject = new Date(dutyEndDate);

  // Extract year, month, and day
  const year = dateObject.getFullYear();
  const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(dateObject.getDate()).padStart(2, '0');
  // Format as YYYY-MM-DD
  const EndDate = `${year}-${month}-${day}`;

  const dutyEndTime=this.advanceTableForm.get(`dutyEndTime`)?.value;
  const timeObject = new Date(dutyEndTime);
  // Get the time part (HH:mm:ss)
  const EndTime = timeObject.toTimeString().split(' ')[0];

  // console.log(this.nightChargeable)
  const endDate: Date = new Date(EndDate);
  const startDate: Date = new Date(dutyStartDate);
  const timeDifference: number = endDate.getTime() - startDate.getTime(); 
  const days: number = timeDifference / (1000 * 3600 * 24);

  if(this.nightChargeable === true)
  {
    if(dutyStartDate === EndDate)
      {
        this.advanceTableForm.patchValue({numberOfDays: 1});
        this.advanceTableForm.patchValue({driverAllowanceAmount: 1 * (this.advanceTableForm.get(`driverAllowanceRate`)?.value)});
        this.advanceTableForm.patchValue({numberOfNights: 0});
        this.advanceTableForm.patchValue({nightChargeRate: 0});
        this.advanceTableForm.patchValue({nightChargeAmount: 0});
        //this.advanceTableForm.patchValue({totalAmount: (this.advanceTableForm.get(`driverAllowanceAmount`)?.value) + (this.advanceTableForm.get(`nightChargeAmount`)?.value)});
      }
      else
      {
        this.advanceTableForm.patchValue({numberOfDays: days + 1});
        this.advanceTableForm.patchValue({driverAllowanceAmount: (days + 1) * (this.advanceTableForm.get(`driverAllowanceRate`)?.value)});
        this.advanceTableForm.patchValue({numberOfNights: days});
        this.advanceTableForm.patchValue({nightChargeAmount: days * (this.advanceTableForm.get(`nightChargeRate`)?.value)});
        //this.advanceTableForm.patchValue({[`totalAmount: (this.advanceTableForm.get(`driverAllowanceAmount`)?.value) + (this.advanceTableForm.get(`nightChargeAmount`)?.value)});
      }
  }
  else
  {
    if(dutyStartDate === EndDate)
      {
        this.advanceTableForm.patchValue({numberOfDays: 1});
        this.advanceTableForm.patchValue({driverAllowanceAmount: 1 * (this.advanceTableForm.get(`driverAllowanceRate`)?.value)});
        this.advanceTableForm.patchValue({numberOfNights: 0});
        this.advanceTableForm.patchValue({nightChargeRate: 0});
        this.advanceTableForm.patchValue({nightChargeAmount: 0});
        //this.advanceTableForm.patchValue({totalAmount: (this.advanceTableForm.get(`driverAllowanceAmount`)?.value) + (this.advanceTableForm.get(`nightChargeAmount`)?.value)});
      }
      else
      {
        this.advanceTableForm.patchValue({numberOfDays: days + 1});
        this.advanceTableForm.patchValue({driverAllowanceAmount: (days + 1) * (this.advanceTableForm.get(`driverAllowanceRate`)?.value)});
        this.advanceTableForm.patchValue({numberOfNights: 0});
        this.advanceTableForm.patchValue({nightChargeRate: 0});
        this.advanceTableForm.patchValue({nightChargeAmount: 0});
        //this.advanceTableForm.patchValue({totalAmount: (this.advanceTableForm.get(`driverAllowanceAmount`)?.value) + (this.advanceTableForm.get(`nightChargeAmount`)?.value)});
      }
  }
  this.onTotalTollParkingInterStateChange();
  //this.loadTotalAmount();
}

}


