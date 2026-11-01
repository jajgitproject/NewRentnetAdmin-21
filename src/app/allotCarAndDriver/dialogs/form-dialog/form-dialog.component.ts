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
import { environment } from 'src/environments/environment';
import {
  extractComplianceFromAllotmentResponse,
  showCarDriverCompliancePopup
} from '../../compliance-popup';


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
    this.status = typeof data?.status === 'string' ? data.status : '';

    // ✅ normalize (important)
    this.normalizedStatus = this.status.toLowerCase().trim();

    // Disable Soft/Hard only when a blocking status is present.
    // Missing/empty status must keep buttons enabled (common when opened without status query param).
    this.buttonDisabled = this.normalizedStatus.length > 0 && this.normalizedStatus !== 'changes allow';

    console.log(this.action);


    // Set the defaults
    if (this.action === 'add' || this.action === 'update') {
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
  

   getDateTime(value: string): string {
    if (!value) return '';
    const lines = value.split('\n').map(x => x.trim()).filter(x => x);
    if (lines.length >= 2) 
    {
      const dateParts = lines[0].split('-'); // yyyy-MM-dd
      const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
      return `${formattedDate} & ${lines[1]}`;
    }
    return '';
  }
  

  ngOnInit(): void {
    if (this.data.Text !== 'AllotCarDriver') {
      this.InitDriver();
      this.InitVehicle();
    }
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

  private markAllotmentPerf(label: string): void {
    if (!environment.production) {
      console.info(`[AllotmentPerf] ${label}`);
    }
  }

  private onAllotSubmitSuccess(closeMessage: string): void {
    this.markAllotmentPerf('allotment_submit_done');
    this.showNotification('snackbar-success', closeMessage, 'bottom', 'center');
    this.isSubmitting = false;
    this.saveDisabled = true;
    this.dialogRef.close({ isClose: false });
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
        driverAcceptanceStatus: ['Pending'],
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

  private handleAllotSubmitError(error: any): void {
    this.isSubmitting = false;
    this.saveDisabled = true;
    const parsedError = this.parseErrorPayload(error);
    if (parsedError.message) {
      this.openShowError(parsedError.message);
    }
    this.showNotification('snackbar-danger', parsedError.message, 'bottom', 'center');
  }

  private parseErrorPayload(error: any): { status: string; message: string } {
    if (typeof error === 'string') {
      const text = error.trim();
      if (!text || text.toLowerCase() === 'ok' || text.toLowerCase() === 'error') {
        return { status: '', message: 'Allotment failed. Check the Network tab for the allotment API response.' };
      }
      return { status: '', message: text };
    }

    const payload = error?.error ?? error;
    const validationMessage = this.flattenValidationErrors(payload);
    const status = String(payload?.status ?? payload?.Status ?? '').toLowerCase();
    const rawMessage = String(payload?.message ?? payload?.Message ?? error?.statusText ?? '').trim();
    const message =
      validationMessage ||
      (!rawMessage || rawMessage.toLowerCase() === 'ok' || rawMessage.toLowerCase() === 'error'
        ? 'Allotment failed. Check the Network tab for the allotment API response.'
        : rawMessage);

    return { status, message };
  }

  private flattenValidationErrors(payload: any): string {
    const errors = payload?.errors;
    if (!errors || typeof errors !== 'object') {
      return '';
    }
    return Object.entries(errors)
      .map(([key, value]) => {
        const field = String(key || '').replace(/^\$\./, '');
        const text = Array.isArray(value) ? value.join(' ') : String(value ?? '');
        return field ? `${field}: ${text}` : text;
      })
      .filter((part) => !!part.trim())
      .join(' | ');
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
    this.confirmAppBasedDriverIfNeeded(() =>
      this.submitAllotment(this.data.allotmentType, 'Car And Driver Alloted...!!!')
    );
  }

  public SoftPost(): void {
    this.confirmAppBasedDriverIfNeeded(() =>
      this.submitAllotment('Soft', 'Car And Driver Alloted...!!!')
    );
  }

  public HardPost(): void {
    this.confirmAppBasedDriverIfNeeded(() =>
      this.submitAllotment('Hard', 'Car And Driver Alloted...!!! Notifications are being sent.')
    );
  }

  private isPreferAppBasedYes(value: any): boolean {
    if (value === true || value === 1 || value === '1') {
      return true;
    }
    const text = String(value ?? '').trim().toLowerCase();
    return text === 'yes' || text === 'true';
  }

  private getSelectedDriverAppBasedYes(): boolean {
    const driverStatus =
      this.advanceTableDIA?.appBasedDriver ??
      this.advanceTableDIA?.AppBasedDriver ??
      this.data?.driverAppBasedDriver ??
      this.data?.driverAppBasedStatus;
    return this.isPreferAppBasedYes(driverStatus);
  }

  private areBothCustomerAppBasedPreferencesNo(): boolean {
    const prefs = this.data?.reservationPreferences;
    if (prefs) {
      return !prefs.customerPreferYes && !prefs.customerPersonPreferYes;
    }
    return (
      !this.isPreferAppBasedYes(this.data?.customerPreferAppBasedDriver) &&
      !this.isPreferAppBasedYes(this.data?.customerPersonPreferAppBasedDriver)
    );
  }

  private shouldSkipAppBasedDriverAllotmentConfirm(): boolean {
    if (this.data?.Text !== 'AllotCarDriver') {
      return true;
    }
    if (this.getSelectedDriverAppBasedYes()) {
      return true;
    }
    if (this.areBothCustomerAppBasedPreferencesNo()) {
      return true;
    }
    return false;
  }

  private getAppBasedPreferenceDisplayLabels(): { customer: string; customerPerson: string } {
    const prefs = this.data?.reservationPreferences;
    if (prefs) {
      return {
        customer: prefs.customerPreferLabel ?? (prefs.customerPreferYes ? 'Yes' : 'No'),
        customerPerson:
          prefs.customerPersonPreferLabel ?? (prefs.customerPersonPreferYes ? 'Yes' : 'No'),
      };
    }
    return {
      customer: this.isPreferAppBasedYes(this.data?.customerPreferAppBasedDriver) ? 'Yes' : 'No',
      customerPerson: this.isPreferAppBasedYes(this.data?.customerPersonPreferAppBasedDriver)
        ? 'Yes'
        : 'No',
    };
  }

  private buildAppBasedDriverConfirmHtml(): string {
    const labels = this.getAppBasedPreferenceDisplayLabels();
    const escapeHtml = (value: string) =>
      String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    const customer = escapeHtml(labels.customer);
    const customerPerson = escapeHtml(labels.customerPerson);
    const labelStyle =
      'font-size:14px;line-height:1.45;color:#424242;text-align:left;white-space:nowrap;';
    const valueStyle =
      'font-size:14px;line-height:1.45;font-weight:600;color:#212121;margin-left:6px;white-space:nowrap;';
    const prefRow = 'margin:0 0 10px;text-align:left;line-height:1.45;';
    return `
      <div class="allot-app-based-confirm" style="width:100%;box-sizing:border-box;text-align:left;">
        <p style="${prefRow}">
          <span style="${labelStyle}">Customer Prefers App Based Driver:</span><span style="${valueStyle}">${customer}</span>
        </p>
        <p style="${prefRow}margin-bottom:16px;">
          <span style="${labelStyle}">Customer Person Prefers App Based Driver:</span><span style="${valueStyle}">${customerPerson}</span>
        </p>
        <div style="border-top:1px solid #e8e8e8;padding-top:14px;margin:0;">
          <p style="margin:0 0 10px;font-size:14px;line-height:1.5;color:#424242;text-align:left;">
            The Driver you have chosen is not App based.
          </p>
          <p style="margin:0;font-size:14px;line-height:1.5;font-weight:500;color:#212121;text-align:left;">
            Do you really want to continue?
          </p>
        </div>
      </div>
    `;
  }

  private alignAppBasedDriverConfirmPopup(popup: HTMLElement): void {
    const htmlContainer = popup.querySelector('.swal2-html-container') as HTMLElement;
    const content = popup.querySelector('.swal2-content') as HTMLElement;
    const icon = popup.querySelector('.swal2-icon') as HTMLElement;
    if (content) {
      content.style.alignItems = 'flex-start';
      content.style.justifyContent = 'flex-start';
      content.style.width = '100%';
      content.style.textAlign = 'left';
    }
    if (icon) {
      icon.style.marginTop = '0.25em';
      icon.style.marginBottom = '0.75em';
    }
    if (htmlContainer) {
      htmlContainer.style.display = 'block';
      htmlContainer.style.width = '100%';
      htmlContainer.style.maxWidth = '100%';
      htmlContainer.style.margin = '0';
      htmlContainer.style.padding = '0 0.5em 0 0.25em';
      htmlContainer.style.textAlign = 'left';
      htmlContainer.style.overflow = 'visible';
    }
  }

  private confirmAppBasedDriverIfNeeded(continueFn: () => void): void {
    if (this.buttonDisabled || this.isSubmitting) {
      return;
    }
    if (this.shouldSkipAppBasedDriverAllotmentConfirm()) {
      continueFn();
      return;
    }
    Swal.fire({
      html: this.buildAppBasedDriverConfirmHtml(),
      width: 500,
      padding: '1.35em 1.5em 1.15em',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      focusCancel: true,
      didOpen: (popup) => this.alignAppBasedDriverConfirmPopup(popup),
    }).then((result) => {
      if (result.isConfirmed) {
        continueFn();
      }
    });
  }

  private submitAllotment(allotmentType: string, successMessage: string): void {
    if (this.isSubmitting) {
      return;
    }
    if (this.buttonDisabled) {
      this.showNotification('snackbar-danger','Changes are not allowed. Status: ' + this.status,'bottom','center');
      return;
    }
    this.saveDisabled = false;
    this.isSubmitting=true;
    this.markAllotmentPerf('allotment_submit_start');
    this.CheckData();
    this.advanceTableForm.patchValue({allotmentType});

    const allotmentId = Number(this.data?.allotmentID);
    const useUpdate = this.action === 'update' && Number.isFinite(allotmentId) && allotmentId > 0;
    if (useUpdate) {
      this.advanceTableForm.patchValue({allotmentID: allotmentId});
    }
    const request$ = useUpdate
      ? this.advanceTableService.update(this.advanceTableForm.getRawValue())
      : this.advanceTableService.add(this.advanceTableForm.getRawValue());

    request$.subscribe(
      (response) => {
        const resolvedType =
          allotmentType ||
          this.data?.allotmentType ||
          this.advanceTableForm?.getRawValue()?.allotmentType;
        const isSoftOrHardAllotment =
          resolvedType === 'Hard' || resolvedType === 'Soft';
        const compliance = isSoftOrHardAllotment
          ? extractComplianceFromAllotmentResponse(response)
          : null;
        if (compliance) {
          showCarDriverCompliancePopup(compliance).then(() => {
            this.onAllotSubmitSuccess(successMessage);
          });
          return;
        }
        this.onAllotSubmitSuccess(successMessage);
      },
      error => {
        this.handleAllotSubmitError(error);
      }
    );
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


