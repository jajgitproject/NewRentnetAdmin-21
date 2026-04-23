// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { AllotCarAndDriverService } from '../../allotCarAndDriver.service';
import { FormControl, Validators, FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AllotCarAndDriver } from '../../allotCarAndDriver.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../../../general/general.service';
import { Observable } from 'rxjs';
import { VehicleDropDown } from 'src/app/vehicle/vehicleDropDown.model';
import { map, startWith } from 'rxjs/operators';
import { DriverDropDown } from 'src/app/customerPersonDriverRestriction/driverDropDown.model';
import { DriverInventoryAssociation } from 'src/app/driverInventoryAssociation/driverInventoryAssociation.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { ShowErrorComponent } from '../../showError/form-dialog/showError.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  standalone: true,
    selector: 'app-form-dialog',
    templateUrl: './form-dialog.component.html',
    styleUrls: ['./form-dialog.component.sass'],
    imports: [
      CommonModule,
      ReactiveFormsModule,
      MatDialogModule,
      MatFormFieldModule,
      MatInputModule,
      MatAutocompleteModule,
      MatButtonModule,
      MatIconModule,
      MatProgressSpinnerModule,
    ],
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
  })

export class FormDialogComponent implements OnInit {
  saveDisabled:boolean=true;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: AllotCarAndDriver;
  advanceTableDIA: DriverInventoryAssociation;
  isSubmitting = false;
  status: string = '';
  normalizedStatus: string = '';
  buttonDisabled: boolean = false; // when status not "Changes allow"

  filteredDriverOptions: Observable<DriverDropDown[]>;
  public DriverList?: DriverDropDown[] = [];
  driverID: any;
  public isChecked = true;
  filteredVehicleOptions: Observable<VehicleDropDown[]>;
  public VehicleList?: VehicleDropDown[] = [];
  vehicleID: any;
  driverName: any;
  vehicleName: any;
  openDriverWithCar: any;
allotmentType: any;

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: AllotCarAndDriverService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    public _generalService: GeneralService) {
    this.action = data.action;
    // status gating
    // this.status = data?.status;
    // this.buttonDisabled = this.status ? this.status.toLowerCase() !== 'changes allow' : false;
    this.status = data?.status || '';

    // ✅ normalize (important)
    this.normalizedStatus = this.status.toLowerCase().trim();

    // ✅ button logic
    this.buttonDisabled = this.normalizedStatus !== 'changes allow';



    // Set the defaults
    if (this.action === 'add' || this.action === 'update') {
      debugger
      this.advanceTableDIA = data.advanceTable;
      this.dialogTitle = 'Allot Car And Driver';
      this.allotmentType =data.allotmentType
      this.advanceTable = new AllotCarAndDriver({});
      this.advanceTable.reservationID = data.reservationID;
      this.advanceTable.inventoryID = this.advanceTableDIA.inventoryID;
      this.advanceTable.registrationNumber = this.advanceTableDIA.inventoryName;
      this.advanceTable.vehicleID = this.advanceTableDIA.vehicleID;
      this.advanceTable.vehicleName = this.advanceTableDIA.vehicle;
      this.advanceTable.vehicleCategoryID = this.advanceTableDIA.vehicleCategoryID;
      this.advanceTable.vehicleCategoryName = this.advanceTableDIA.vehicleCategory;
      this.advanceTable.inventoryOwnedSupplied = this.advanceTableDIA.ownedSupplied;
      this.advanceTable.inventorySupplierID = this.advanceTableDIA.inventorySupplierID;
      this.advanceTable.inventorySupplierName = this.advanceTableDIA.inventorySupplierName;
      if (data.Text === 'AllotCarDriver') {
        this.advanceTable.driverInventoryAssociationID = this.advanceTableDIA.driverInventoryAssociationID;
      }
      else {
        this.advanceTable.driverInventoryAssociationID = 0;
      }

      this.advanceTable.driverID = this.advanceTableDIA.driverID;
      this.advanceTable.driverName = this.advanceTableDIA.driverName;
      this.advanceTable.driverOwnedSupplier = this.advanceTableDIA.driverOwnedSupplier;
      this.advanceTable.driverSupplierID = this.advanceTableDIA.driverSupplierID;
      this.advanceTable.driverSupplierName = this.advanceTableDIA.driverSupplierName;
      //this.advanceTable.allotmentStatus='Alloted';

    }
    this.advanceTableForm = this.createContactForm();
  }
  

  ngOnInit(): void {
    this.InitDriver();
    this.InitVehicle();
    if (this.data.Text === 'AllotCarDriver') {
      this.advanceTableForm.controls["driverName"].disable();
      this.advanceTableForm.controls["vehicleName"].disable();
    }
    this.advanceTableForm.controls["registrationNumber"].disable();
    this.advanceTableForm.controls["vehicleCategoryName"].disable();
    this.advanceTableForm.controls["inventoryOwnedSupplied"].disable();
    this.advanceTableForm.controls["inventorySupplierName"].disable();
    this.advanceTableForm.controls["driverOwnedSupplier"].disable();
    this.advanceTableForm.controls["driverSupplierName"].disable();
    if (this.data.Text === 'openDriverWithCar') {
      this.advanceTableForm.controls["driverName"].disable();
    }

    if (this.data.Text === 'opencarWithDriver') {
      this.advanceTableForm.controls["vehicleName"].disable();
    }
  }

  InitDriver() {
    this._generalService.GetDriver().subscribe(
      data => {
        this.DriverList = data;
        this.filteredDriverOptions = this.advanceTableForm.controls['driverName'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterDriver(value || ''))
        );
      });
  }

  private _filterDriver(value: string): any {
    const filterValue = value.toLowerCase();
    return this.DriverList.filter(
      customer => {
        return customer.driverName.toLowerCase().indexOf(filterValue) === 0;
      }
    );
  }

  getDriverID(driverID: any, driverName: any) {
    this.driverID = driverID;
    this.driverName = driverName;
    this.advanceTableForm.patchValue({ driverID: this.driverID });
    this.advanceTableForm.patchValue({ driverName: this.driverName });
  }

  InitVehicle() {
    this._generalService.GetVehicle().subscribe(
      data => {
        this.VehicleList = data;
        this.filteredVehicleOptions = this.advanceTableForm.controls['vehicleName'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterVehicle(value || ''))
        );
      });
  }

  private _filterVehicle(value: string): any {
    const filterValue = value.toLowerCase();
    return this.VehicleList.filter(
      customer => {
        return customer.vehicle.toLowerCase().indexOf(filterValue) === 0;
      }
    );
  }

  getVehicleID(vehicleID: any, vehicle: any) {
    this.vehicleID = vehicleID;
    this.vehicleName = vehicle;
    this.advanceTableForm.patchValue({ vehicleID: this.vehicleID });
    this.advanceTableForm.patchValue({ vehicleName: this.vehicleName });
  }

  createContactForm(): FormGroup {
    return this.fb.group(
      {
        allotmentID: [this.advanceTable.allotmentID],
        reservationID: [this.advanceTable.reservationID],
        inventoryID: [this.advanceTable.inventoryID],
        registrationNumber: [this.advanceTable.registrationNumber],
        vehicleID: [this.advanceTable.vehicleID],
        vehicleName: [this.advanceTable.vehicleName],
        vehicleCategoryID: [this.advanceTable.vehicleCategoryID],
        vehicleCategoryName: [this.advanceTable.vehicleCategoryName],
        inventoryOwnedSupplied: [this.advanceTable.inventoryOwnedSupplied],
        inventorySupplierID: [this.advanceTable.inventorySupplierID],
        inventorySupplierName: [this.advanceTable.inventorySupplierName],
        driverInventoryAssociationID: [this.advanceTable.driverInventoryAssociationID],
        driverID: [this.advanceTable.driverID],
        driverName: [this.advanceTable.driverName],
        driverOwnedSupplier: [this.advanceTable.driverOwnedSupplier],
        driverSupplierID: [this.advanceTable.driverSupplierID],
        driverSupplierName: [this.advanceTable.driverSupplierName],
        dateOfAllotment: [this.advanceTable.dateOfAllotment],
        timeofAllotment: [this.advanceTable.timeofAllotment],
        allotmentByEmployeeID: [this.advanceTable.allotmentByEmployeeID],
        allotmentRemark: [this.advanceTable.allotmentRemark],

        isDriverAcceptanceRequired: [this.advanceTable.isDriverAcceptanceRequired],
        driverAcceptanceStatus: [this.advanceTable.driverAcceptanceStatus],
        acceptanceNotificationSentToDriver: [this.advanceTable.acceptanceNotificationSentToDriver],
    
        acceptanceNotificationSentToDriverRemark: [this.advanceTable.acceptanceNotificationSentToDriverRemark],
  
        driverAcceptanceRemark: [this.advanceTable.driverAcceptanceRemark],

        driverAcceptanceEnteredByEmployeeID: [this.advanceTable.driverAcceptanceEnteredByEmployeeID],
        allotmentType:[this.advanceTable.allotmentType]
      });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  onNoClick() {
    this.advanceTableForm.reset();
  }


  submit() {
  }
  CheckData() {
    if (this.advanceTableForm.value.isDriverAcceptanceRequired === true) {
      this.advanceTableForm.patchValue({isDriverAcceptanceRequired : true});
      this.advanceTableForm.patchValue({driverAcceptanceStatus : "Pending"});
      this.advanceTableForm.patchValue({acceptanceNotificationSentToDriver : true})   
      this.advanceTableForm.patchValue({driverAcceptanceEnteredByEmployeeID:0});
      this.advanceTableForm.patchValue({driverAcceptanceRemark:null});
      this.advanceTableForm.patchValue({driver:"Accepted by Reservation Executive"});
      // this.advanceTableForm.patchValue({driverAcceptanceDate : null});
      // this.advanceTableForm.patchValue({driverAcceptanceTime : null});
    }
    else{
      this.advanceTableForm.patchValue({isDriverAcceptanceRequired : false});
      this.advanceTableForm.patchValue({driverAcceptanceStatus : "Accepted"});
      this.advanceTableForm.patchValue({acceptanceNotificationSentToDriver : true});
      this.advanceTableForm.patchValue({driverAcceptanceRemark:"Accepted by Reservation Executive"});
      this.advanceTableForm.patchValue({driverAcceptanceEnteredByEmployeeID : this._generalService.getUserID()}); 
    }

  }
  public Post(): void {
    if (this.buttonDisabled) {
      this.showNotification('snackbar-danger','Changes are not allowed. Status: ' + this.status,'bottom','center');
      return;
    }
    this.saveDisabled = false;
    this.isSubmitting=true;
    this.CheckData();
    if(this.action==='add')
    {
      this.advanceTableForm.patchValue({allotmentType:this.data.allotmentType})
    this.advanceTableService.add(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.showNotification(
            'snackbar-success',
            'Car And Driver Alloted...!!!',
            'bottom',
            'center'
          );
          this.saveDisabled = true;
          this.dialogRef.close({ isClose: false });
        },
        error => {
          debugger;
          if(error.error.status === "error")
          {
           this.openShowError(error.error.message);
          }
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
    else{
      this.advanceTableForm.patchValue({allotmentID:this.data.allotmentID})
      this.advanceTableForm.patchValue({allotmentType:this.data.allotmentType})
    this.advanceTableService.update(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          
          this.showNotification(
            'snackbar-success',
            'Car And Driver Alloted...!!!',
            'bottom',
            'center'
          );
          this.saveDisabled = true;
          this.dialogRef.close({ isClose: false });
        },
        error => {
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
    
  }

  openShowError(message:string)
    {
      const dialogRef = this.dialog.open(ShowErrorComponent, 
      {
        height:'30%',
        data: 
          {
            message : message
          }
      });
    }

  showNotification(allotCarAndDriverName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: allotCarAndDriverName
    });
  }

 
}


