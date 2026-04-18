// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject, ViewChild } from '@angular/core';
import { DutySlipQualityCheckService } from '../../dutySlipQualityCheck.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
//import { AllotmentDetails, DutySlipDetials, DutySlipQualityCheck } from '../../dutySlipQualityCheck.model';
import { AllotmentDetails, DutyAmenitieModel, DutySlipQualityCheck } from '../../dutySlipQualityCheck.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
//import { VehicleInterStateTaxDropDown } from '../../vehicleInterStateTaxDropDown.model';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import { QualificationDropDown } from 'src/app/general/qualificationDropDown.model';
import { StateDropDown } from 'src/app/state/stateDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DutyAllotmentDetails } from 'src/app/dutySlipQualityCheckedByExecutive/dutySlipQualityCheckedByExecutive.model';
import moment from 'moment';
import { DutyAmenitieDialogComponent } from '../dutyAmenitie-dialog/dutyAmenitie-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';
import { MatMenuTrigger } from '@angular/material/menu';
import { DeleteDADialogComponent } from '../deleteDA/deleteDA.component';
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
      'activationStatus',
      //'actions'
    ];
  dataSource: DutyAmenitieModel[] | null;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: DutySlipQualityCheck;
  fName = '';
  contents: any[];
  mydata = [];
  name = '';
  saveDisabled:boolean=true;
  status: any; // raw status passed from parent
  buttonDisabled: boolean = false; // derived gating flag

  image: any;
  fileUploadEl: any;
  InventoryID: any;
  RegistrationNumber: any;
  dutySlipID:any;
  reservationID:any;

  AllotmentID: any;
  DriverID: any;
  DriverName: any;
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  sortingData: number;
  sortType: string;

  public StateList?: StateDropDown[] = [];
  searchState:FormControl = new FormControl();
  filteredStateOptions: Observable<StateDropDown[]>;
  interStateTaxStateID: any;
  driverRegistrationData:AllotmentDetails[]=[];
  driverQualityCheckData:DutyAllotmentDetails[]=[];
  //dutySlipData:DutySlipDetials[]=[];
  driverID: any;
  allotmentID: any;
  driverName: any;
  inventoryID: any;
  registrationNumber: any;
  dutyQualityCheckList:any;
  dutyAmeniteAdvanceTable : DutyAmenitieModel | null;

  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  private snackBar: MatSnackBar,
  public dialog: MatDialog,
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: DutySlipQualityCheckService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        // Extract and normalize status for gating
        // this.status = this.extractStatus(data?.status);
        // console.log('Quality Check Dialog received status:', this.status);
        // this.buttonDisabled = this.status?.toLowerCase?.() !== 'changes allow';
        this.status = this.extractStatus(data?.status);

const normalized = (this.status || '').trim().toLowerCase();

// TRUE matlab block (disable button)
this.buttonDisabled = normalized !== 'changes allow';
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Quality Check';     
          this.InitDutyQualityCheckID();  
           //this.advanceTable = data.advanceTable;
          // this.ImagePath=this.advanceTable.selfieWithUniform;
          // this.ImagePath1=this.advanceTable.frontPhoto;
          // this.ImagePath2=this.advanceTable.interiorsWithAmenities;
          // this.ImagePath3=this.advanceTable.isolatedCabin;
          // this.ImagePath4=this.advanceTable.bodyTemperatureImage;
          // this.advanceTable.registrationNumber=data.registrationNumber;
          // this.advanceTable.driverName=data.driverName;
          
          //this.ImagePath=this.advanceTable.interStateTaxImage;
          //this.searchState.setValue(this.advanceTable.state);

          // let Date=moment(this.advanceTable.qCDate).format('DD/MM/yyyy');
          // this.onBlurQCDateEdit(Date);
        } else 
        {
          this.dialogTitle = 'Quality Check';
          this.advanceTable = new DutySlipQualityCheck({});
          this.advanceTable.activationStatus=true;
          // this.advanceTable.registrationNumber=data.registrationNumber;
          // this.advanceTable.driverName=data.driverName;
        }
        this.advanceTableForm = this.createContactForm();
        this.dutySlipID=data.dutySlipID;
        this.reservationID=data.reservationID;
        this.AllotmentID=data.allotmentID;
        this.DriverID=data.driverID;
        this.DriverName=data.driverName;
        this.InventoryID=data.inventoryID;
        this.RegistrationNumber=data.registrationNumber;
        //console.log(this.dutySlipID,this.reservationID);
  }
   @ViewChild(MatMenuTrigger)
    contextMenu: MatMenuTrigger;
    contextMenuPosition = { x: '0px', y: '0px' };
  public ngOnInit(): void
  { 
    if(this.action==='add')
    {
      this.advanceTableForm.patchValue({driverID:this.DriverID});
    this.advanceTableForm.patchValue({driverName:this.DriverName});
    this.advanceTableForm.patchValue({inventoryID:this.InventoryID});
    this.advanceTableForm.patchValue({registrationNumber:this.RegistrationNumber});
    this.advanceTableForm.patchValue({activationStatus:true});
    }
    this.loadDataDutyAmenities();
  }

  InitDutyQualityCheckID(){
    this._generalService.GetDutyQualityCheckID(this.data.allotmentID).subscribe(
      data=>{
        this.dutyQualityCheckList=data;
        console.log(this.dutyQualityCheckList)
        this.InitDriverAndRegistration();
        let Date=moment(this.advanceTable.qCDate).format('DD/MM/yyyy');
          this.onBlurQCDateEdit(Date);
        //console.log(this.dutyQualityCheckList);
       
      }
    );
   }

  InitDriverAndRegistration()
  {
    this._generalService.GetDutyAllotmentInfo(this.dutyQualityCheckList).subscribe(
      data=>{
        this.driverQualityCheckData=data;
        this.advanceTableForm.patchValue({dutyQualityCheckID:this.driverQualityCheckData[0].dutyQualityCheckID});
        this.advanceTableForm.patchValue({dutySlipID:this.driverQualityCheckData[0].dutySlipID});
        this.advanceTableForm.patchValue({driverID:this.driverQualityCheckData[0].driverID});
        this.advanceTableForm.patchValue({driverName:this.driverQualityCheckData[0].driverName});
        this.advanceTableForm.patchValue({inventoryID:this.driverQualityCheckData[0].inventoryID});
        this.advanceTableForm.patchValue({registrationNumber:this.driverQualityCheckData[0].carRegNo});
        this.advanceTableForm.patchValue({qCDate:this.driverQualityCheckData[0].qcDate});
        this.advanceTableForm.patchValue({qCTime:this.driverQualityCheckData[0].qcTime});
        this.advanceTableForm.patchValue({bodyTemperatureInDegreeCelcius:this.driverQualityCheckData[0].bodyTemperatureInDegreeCelcius});
        this.ImagePath=this.driverQualityCheckData[0].selfieWithUniform;
        this.ImagePath1=this.driverQualityCheckData[0].frontPhoto;
        this.ImagePath2=this.driverQualityCheckData[0].interiorsWithAmenities
        this.ImagePath3=this.driverQualityCheckData[0].isolatedCabin;
        this.ImagePath4=this.driverQualityCheckData[0].bodyTemperatureImage;
        this.advanceTableForm.patchValue({selfDeclaration:this.driverQualityCheckData[0].selfDeclaration});
        this.advanceTableForm.patchValue({driverRemark:this.driverQualityCheckData[0].driverRemark});
        this.advanceTableForm.patchValue({activationStatus:this.driverQualityCheckData[0].activationStatus});
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

  onTimeInput(event: any): void {
    const inputValue = event.target.value;
    const parsedTime = new Date(`1970-01-01T${inputValue}`);
    if (!isNaN(parsedTime.getTime())) {
        this.advanceTableForm.get('qCTime').setValue(parsedTime);
    }
}
  
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

  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      dutyQualityCheckID: [''],
      dutySlipID:  [''],
      allotmentID:  [''],
      driverID:  [''],
      driverName: [''],
      inventoryID:  [''],
      registrationNumber:  [''],
      qCDate: [this.advanceTable?.qCDate],
      qCTime: [this.advanceTable?.qCTime],
      selfieWithUniform: [''],
      frontPhoto: [''],
      interiorsWithAmenities: [''],
      isolatedCabin: [''],
      bodyTemperatureInDegreeCelcius: [0.0],
      bodyTemperatureImage: [''],
      selfDeclaration: [''],
      driverRemark: [''],
      activationStatus: ['']
    });
  }

  keyPressNumbersDecimal(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  // InitDuty()
  // {
  //   this._generalService.GetDutySlipInfo().subscribe(
  //     data=>{
  //       this.dutySlipData=data;
  //       console.log(this.dutySlipData);
  //       this.advanceTableForm.patchValue({dutySlipID:this.dutySlipData[0].dutySlipID});
  //       this.advanceTableForm.patchValue({reservationID:this.dutySlipData[0].reservationID});
  //     }
  //   );
  // }

  // InitDriverAndRegistration()
  // {
  //   this._generalService.GetAllotmentInfo().subscribe(
  //     data=>{
  //       this.driverRegistrationData=data;
  //       //console.log(this.driverRegistrationData);
  //       //this.advanceTableForm.patchValue({dutySlipID:this.driverRegistrationData[0].dutySlipID});
  //       //this.advanceTableForm.patchValue({reservationID:this.driverRegistrationData[0].reservationID});
  //       this.advanceTableForm.patchValue({allotmentID:this.driverRegistrationData[0].allotmentID});
  //       this.advanceTableForm.patchValue({driverID:this.driverRegistrationData[0].driverID});
  //       this.advanceTableForm.patchValue({driverName:this.driverRegistrationData[0].driverName});
  //       this.advanceTableForm.patchValue({inventoryID:this.driverRegistrationData[0].inventoryID});
  //       this.advanceTableForm.patchValue({registrationNumber:this.driverRegistrationData[0].registrationNumber});
  //     }
  //   );
  // }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}

  submit() 
  {
    // emppty stuff
  }

  // reset(): void 
  // {
  //   this.advanceTableForm.reset();
  // }

  onNoClick()
  {
    this.dialogRef.close()
  }

  public Post(): void
  {
    this.advanceTableForm.patchValue({dutySlipID:this.dutySlipID});
    this.advanceTableForm.patchValue({allotmentID:this.AllotmentID});
    //this.advanceTableForm.patchValue({interStateTaxStateID:this.interStateTaxStateID});
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close(response);
        this.showNotification(
          'snackbar-success',
          'Duty Slip Quality Check Created...!!!',
          'bottom',
          'center'
        );
        this.saveDisabled = true;
    },
    error =>
    {
      this.showNotification(
        'snackbar-danger',
        'Operation Failed.....!!!',
        'bottom',
        'center'
      );
      this.saveDisabled = true;
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
    this.advanceTableForm.patchValue({dutySlipID:this.dutySlipID});
    this.advanceTableForm.patchValue({allotmentID:this.AllotmentID});
    this.advanceTableForm.patchValue({selfieWithUniform:this.ImagePath});
    this.advanceTableForm.patchValue({frontPhoto:this.ImagePath1});
    this.advanceTableForm.patchValue({interiorsWithAmenities:this.ImagePath2});
    this.advanceTableForm.patchValue({isolatedCabin:this.ImagePath3});
    this.advanceTableForm.patchValue({bodyTemperatureImage:this.ImagePath4});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close(response);
       //this._generalService.sendUpdate('DutySlipQualityCheckUpdate:DutySlipQualityCheckView:Success');//To Send Updates  
       this.showNotification(
        'snackbar-success',
        'Duty Slip Quality Check Updated...!!!',
        'bottom',
        'center'
      );
      this.saveDisabled = true;
    },
    error =>
    {
     
      this.showNotification(
        'snackbar-danger',
        'Operation Failed.....!!!',
        'bottom',
        'center'
      );
      this.saveDisabled = true;
     // this._generalService.sendUpdate('DutySlipQualityCheckAll:DutySlipQualityCheckView:Failure');//To Send Updates  
    }
  )
  }
  public confirmAdd(): void 
  {
   if (this.buttonDisabled) {
    console.log('Save blocked due to status not allowing changes:', this.status);
    return;
   }
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
  
  /////////////////for Image Upload////////////////////////////
  public response: { dbPath: '' };
  public ImagePath: string = "";
  public ImagePath1: string = "";
  public ImagePath2: string = "";
  public ImagePath3: string = "";
  public ImagePath4: string = "";
  
  public uploadFinishedSelfie = (event) => 
  {
    this.response = event;
    this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({selfieWithUniform:this.ImagePath})
  }

  public uploadFinishedFront = (event) => 
  {
    this.response = event;
    this.ImagePath1 = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({frontPhoto:this.ImagePath1})
  }

  public uploadFinishedInteriors = (event) => 
  {
    this.response = event;
    this.ImagePath2 = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({interiorsWithAmenities:this.ImagePath2})
  }
  public uploadFinishedFrontCabin = (event) => 
  {
    this.response = event;
    this.ImagePath3 = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({isolatedCabin:this.ImagePath3})
  }

  public uploadFinishedBodyTemp = (event) => 
  {
    this.response = event;
    this.ImagePath4 = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({bodyTemperatureImage:this.ImagePath4})
  }

  //Date
  onBlurQCDate(value: string): void {
  value= this._generalService.resetDateiflessthan12(value);    
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm.get('qCDate')?.setValue(formattedDate);    
    }
    else
    {
      this.advanceTableForm.get('qCDate')?.setErrors({ invalidDate: true });
    }
  }
                   
    onBlurQCDateEdit(value: string): void {  
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
      if (validDate) 
      {
        const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
        if(this.action==='edit')
        {
          this.advanceTable.qCDate=formattedDate
        }
        else
        {
          this.advanceTableForm.get('qCDate')?.setValue(formattedDate);
        }  
      } 
      else 
      {
        this.advanceTableForm.get('qCDate')?.setErrors({ invalidDate: true });
      }
    }

    openDutyAmenitie()
    {
      const dialogRef = this.dialog.open(DutyAmenitieDialogComponent, 
        
          {
            data: 
              {
                advanceTable : this.dutyAmeniteAdvanceTable,
                dutySlipID: this.dutySlipID,
                action: 'add',
                status: this.status
              }
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        this.loadDataDutyAmenities();
        });
    }

    editDutyAmenitie(item:any)
    {
      const dialogRef = this.dialog.open(DutyAmenitieDialogComponent, 
          {
            data: 
              {
                advanceTable : item,
                dutySlipID: this.dutySlipID,
                action: 'edit',
                status: this.status
              }
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        this.loadDataDutyAmenities();
        });
    }

    deleteDutyAmenitie(row)
    {
      //this.amenitieID = row.id;
      const dialogRef = this.dialog.open(DeleteDADialogComponent, 
      {
        data: row
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        this.loadDataDutyAmenities();
        });
    }

    public loadDataDutyAmenities() 
    {
      this.advanceTableService.getDutyAmenities(this.dutySlipID,this.SearchActivationStatus, this.PageNumber).subscribe
      (
        data =>   
        {
            this.dataSource = data;
            console.log(this.dataSource)
        },
        (error: HttpErrorResponse) => { this.dataSource = null;}
      );
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
    this.advanceTableService.getDutyAmenitiesSort(this.dutySlipID,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
       
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }

  onContextMenu(event: MouseEvent, item: DutyAmenitieModel) {
      event.preventDefault();
      this.contextMenuPosition.x = event.clientX + 'px';
      this.contextMenuPosition.y = event.clientY + 'px';
      this.contextMenu.menuData = { item: item };
      this.contextMenu.menu.focusFirstItem('mouse');
      this.contextMenu.openMenu();
    }
    NextCall()
    {
      if (this.dataSource?.length>0) 
      {
        this.PageNumber++;
        this.loadDataDutyAmenities();
      }
    }
    PreviousCall()
    {
      if(this.PageNumber>0)
      {
        this.PageNumber--;
        this.loadDataDutyAmenities(); 
      } 
    }

    private extractStatus(input: any): string | null {
      if (input === undefined || input === null) return null;
      try {
        if (typeof input === 'string') return input;
        if (input?.status) {
          if (typeof input.status === 'string') return input.status;
          if (input.status?.status) return input.status.status;
        }
        return input?.toString?.() || null;
      } catch (e) {
        console.log('Status extraction error (QualityCheck):', e);
        return null;
      }
    }
}



