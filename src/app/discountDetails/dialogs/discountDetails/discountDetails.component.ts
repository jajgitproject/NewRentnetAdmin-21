import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { DiscountDetailsService } from '../../discountDetails.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { DiscountDetails} from '../../discountDetails.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../../../general/general.service';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { Observable, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { atLeastOneRequiredNotBoth } from './atLeastOneRequiredNotBoth.component';
import Swal from 'sweetalert2';
import {
  coerceEmployeeFieldToApiString,
  createDisplayEmployeeFn,
  employeeNameControlValidator,
  findEmployeeByDropdownInput,
  formatEmployeeDropdownLabel,
  initEmployeeNamePrefixSearch,
  isEmployeeDropdownSelection,
  isEmployeeExited,
  isSelectedEmployeeExitedFromForm,
  onEmployeeAutocompleteSelected,
  patchEmployeeNameForEditById,
} from 'src/app/shared/customer-employee-autocomplete';

@Component({
  standalone: false,
  selector: 'app-discountDetails-dialog',
  templateUrl: './discountDetails.component.html',
  styleUrls: ['./discountDetails.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class DiscountDetailsDialogComponent 
{
  formatEmployeeDropdownLabel = formatEmployeeDropdownLabel;
  isEmployeeExited = isEmployeeExited;
  displayApprovedEmployeeFn = createDisplayEmployeeFn();

  saveDisabled:boolean=true;
  buttonDisabled:boolean=false;
  status: any;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: DiscountDetails;
  reservationDiscountDetailsByEmployeesID: any;
  ReservationID: any;
  AllotmentID: any;

  public EmployeeList?: EmployeeDropDown[] = [];
  filteredCreatedByOptionss: Observable<EmployeeDropDown[]> = of([]);

  constructor(
  public dialogRef: MatDialogRef<DiscountDetailsDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: DiscountDetailsService,
  private snackBar: MatSnackBar,
    private fb: FormBuilder,
        public route:ActivatedRoute,
  public _generalService:GeneralService)
  {
        this.action = data.action;
        
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Reservation Discount';       
          this.advanceTable = data.advanceTable;
          this.ImagePath = this.advanceTable.attachment;
      
        } else 
        {
          this.dialogTitle = 'Reservation Discount';
          this.advanceTable = new DiscountDetails({});
          this.advanceTable.activationStatus=true;
          this.ReservationID = data.reservationID;
        }
        this.status = data.verifyDutyStatusAndCacellationStatus || data?.status?.status || data?.status;
         if(this.status === 'Changes allow'){
    this.buttonDisabled = false;
} else {
    this.buttonDisabled = true;
}
        this.advanceTableForm = this.createContactForm();
  }
  public ngOnInit(): void
  {
    this.route.queryParams.subscribe(paramsData =>{
      const encryptedAllotmentID = paramsData.allotmentID;
      const encryptedReservationID = paramsData.reservationID;
      if (encryptedAllotmentID && encryptedReservationID) {
        this.AllotmentID = this._generalService.decrypt(decodeURIComponent(encryptedAllotmentID));
        this.ReservationID = this._generalService.decrypt(decodeURIComponent(encryptedReservationID));
      }
    });

    const employeeCtrl = this.advanceTableForm.get('discountApprovedByEmployee');
    employeeCtrl?.setValidators([
      Validators.required,
      employeeNameControlValidator(() => this.EmployeeList || []),
    ]);
    employeeCtrl?.updateValueAndValidity({ emitEvent: false });

    if (this.action === 'edit') {
      this.patchApprovedEmployeeForEdit();
    }
  }

  isSelectedApprovedEmployeeExited(): boolean {
    return isSelectedEmployeeExitedFromForm(this.advanceTableForm, 'discountApprovedByEmployee', this.EmployeeList || []);
  }

  private patchApprovedEmployeeForEdit(): void {
    patchEmployeeNameForEditById(
      this._generalService,
      this.advanceTable?.discountApprovedByEmployeeID,
      this.advanceTableForm,
      'discountApprovedByEmployee',
      {
        getEmployeeList: () => this.EmployeeList || [],
        setEmployeeList: (list) => { this.EmployeeList = list; },
        setFilteredOptions: (options) => { this.filteredCreatedByOptionss = options; },
        onEmployeeId: (id) => {
          this.reservationDiscountDetailsByEmployeesID = id;
          this.advanceTableForm.patchValue({ discountApprovedByEmployeeID: id }, { emitEvent: false });
        },
      }
    );
  }

  InitApprovedEmployeePrefix(): void {
    initEmployeeNamePrefixSearch(this._generalService, this.advanceTableForm, 'discountApprovedByEmployee', {
      getEmployeeList: () => this.EmployeeList || [],
      setEmployeeList: (list) => { this.EmployeeList = list; },
      setFilteredOptions: (options) => { this.filteredCreatedByOptionss = options; },
    });
  }

  OnDisApprovedBySelect(selected: EmployeeDropDown): void {
    if (isEmployeeDropdownSelection(selected)) {
      const list = this.EmployeeList || [];
      if (!list.some((e) => Number(e.employeeID) === Number(selected.employeeID))) {
        this.EmployeeList = [selected, ...list];
      }
    }
    onEmployeeAutocompleteSelected(
      this.advanceTableForm,
      'discountApprovedByEmployee',
      selected,
      (id) => {
        this.reservationDiscountDetailsByEmployeesID = id;
        this.advanceTableForm.patchValue({ discountApprovedByEmployeeID: id }, { emitEvent: false });
      }
    );
    this.advanceTableForm.get('discountApprovedByEmployee')?.updateValueAndValidity({ emitEvent: false });
  }

  private prepareEmployeeForSave(raw: Record<string, unknown>): void {
    coerceEmployeeFieldToApiString(raw, 'discountApprovedByEmployee', this.EmployeeList || []);
    const employee = findEmployeeByDropdownInput(
      this.advanceTableForm.get('discountApprovedByEmployee')?.value,
      this.EmployeeList || []
    );
    if (employee?.employeeID) {
      raw.discountApprovedByEmployeeID = employee.employeeID;
      this.reservationDiscountDetailsByEmployeesID = employee.employeeID;
    }
  }

  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      reservationDiscountID: [this.advanceTable.reservationDiscountID],
      reservationID: [this.ReservationID || 0],
      allotmentID: [this.AllotmentID || 0],
      activationStatus: [this.advanceTable.activationStatus],
      discountPercentage: [this.advanceTable.discountPercentage || null],
      fixedAmountDiscount: [this.advanceTable.fixedAmountDiscount || null],
      isAllowedOnPackageRate: [this.advanceTable.isAllowedOnPackageRate || null],
      isAllowedOnExtras: [this.advanceTable.isAllowedOnExtras || null],
      discountApprovedByEmployeeID: [this.advanceTable.discountApprovedByEmployeeID],
      attachment:[this.advanceTable.attachment],
      discountApprovedByEmployee:[this.advanceTable.discountApprovedByEmployee, [Validators.required]]      
    }, { validator: atLeastOneRequiredNotBoth });
  }

  submit() 
  {
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
    if(this.AllotmentID)
    {
 this.advanceTableForm.patchValue({allotmentID:this.AllotmentID});
    
  }
    const requestObject = this.advanceTableForm.getRawValue();
    this.prepareEmployeeForSave(requestObject);
    this.advanceTableService.add(requestObject)  
    .subscribe(
    response => 
    { 
      if (response && response.activationStatus && typeof response.activationStatus === 'string' && response.activationStatus.includes("Duplicate")) 
      {
        Swal.fire({
                    title: '',
                    icon: 'warning',
                    html: `<b>Please delete previous record to add new.</b>`
                  })
        this.saveDisabled = true;
      }
      else
      {
        this.showNotification(
          'snackbar-success',
          'Discount Details Created...!!!',
          'bottom',
          'center'
        );
      this.saveDisabled = true;
      this.dialogRef.close(true);
      }
    },
    error =>
    {
      this.showNotification(
        'snackbar-danger',
        'Operation Field...!!!',
        'bottom',
        'center'
      );
      this.saveDisabled = true;
    }
  )
  }
  public Put(): void
  {
    const requestObject = this.advanceTableForm.getRawValue();
    this.prepareEmployeeForSave(requestObject);
    if (!requestObject.discountApprovedByEmployeeID) {
      requestObject.discountApprovedByEmployeeID =
        this.reservationDiscountDetailsByEmployeesID || this.advanceTable.discountApprovedByEmployeeID;
    }
    this.advanceTableService.update(requestObject)  
    .subscribe(
    response => 
    {
     
     this.showNotification(
        'snackbar-success',
        'Discount Details Update...!!!',
        'bottom',
        'center'
      );
      this.saveDisabled = true;
      this.dialogRef.close(true);
    },
    error =>
    {
      this.showNotification(
        'snackbar-danger',
        'Opertion Field...!!!',
        'bottom',
        'center'
      ); 
      this.saveDisabled = true;
    }
  )
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
   public response: { dbPath: '' };
   public ImagePath: string = "";
   public uploadFinished = (event) => {
     this.response = event;
     this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
     this.advanceTableForm.patchValue({ attachment: this.ImagePath })
   }
 
  public confirmAdd(): void 
  {
    this.advanceTableForm.markAllAsTouched();
    if (!this.advanceTableForm.valid) {
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
}

