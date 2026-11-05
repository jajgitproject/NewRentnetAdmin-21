// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { LumpsumRateDetailsService } from '../../lumpsumRateDetails.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { LumpsumRateDetails} from '../../lumpsumRateDetails.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../../../general/general.service';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { Observable, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  selector: 'app-lumpsumRateDetails-dialog',
  templateUrl: './lumpsumRateDetails.component.html',
  styleUrls: ['./lumpsumRateDetails.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class LumpsumRateDetailsDialogComponent 
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
  advanceTable: LumpsumRateDetails;
  reservationDiscountDetailsByEmployeesID: any;
  ReservationID: any;

  public EmployeeList?: EmployeeDropDown[] = [];
  filteredCreatedByOptionss: Observable<EmployeeDropDown[]> = of([]);

  constructor(
  public dialogRef: MatDialogRef<LumpsumRateDetailsDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: LumpsumRateDetailsService,
  private snackBar: MatSnackBar,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        this.action = data.action;
        
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Lumpsum Rate';
          this.advanceTable = data.advanceTable;
          this.ImagePath = this.advanceTable.attachment;
      
        } else 
        {
          this.dialogTitle = 'Lumpsum Rate';
          this.advanceTable = new LumpsumRateDetails({});
          this.advanceTable.activationStatus=true;
          this.ReservationID = data.reservationID;
        }
        this.status=data?.status?.status || data?.status || data;
         if(this.status === 'Changes allow'){
    this.buttonDisabled = false;
} else {
    this.buttonDisabled = true;
}
        this.advanceTableForm = this.createContactForm();
  }

  public ngOnInit(): void
  {
    const employeeCtrl = this.advanceTableForm.get('lumpsumRateApprovedByEmployee');
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
    return isSelectedEmployeeExitedFromForm(this.advanceTableForm, 'lumpsumRateApprovedByEmployee', this.EmployeeList || []);
  }

  private patchApprovedEmployeeForEdit(): void {
    patchEmployeeNameForEditById(
      this._generalService,
      this.advanceTable?.lumpsumRateApprovedByEmployeeID,
      this.advanceTableForm,
      'lumpsumRateApprovedByEmployee',
      {
        getEmployeeList: () => this.EmployeeList || [],
        setEmployeeList: (list) => { this.EmployeeList = list; },
        setFilteredOptions: (options) => { this.filteredCreatedByOptionss = options; },
        onEmployeeId: (id) => {
          this.reservationDiscountDetailsByEmployeesID = id;
          this.advanceTableForm.patchValue({ lumpsumRateApprovedByEmployeeID: id }, { emitEvent: false });
        },
      }
    );
  }

  InitApprovedEmployeePrefix(): void {
    initEmployeeNamePrefixSearch(this._generalService, this.advanceTableForm, 'lumpsumRateApprovedByEmployee', {
      getEmployeeList: () => this.EmployeeList || [],
      setEmployeeList: (list) => { this.EmployeeList = list; },
      setFilteredOptions: (options) => { this.filteredCreatedByOptionss = options; },
    });
  }

  onEmployeeSelected(selected: EmployeeDropDown): void {
    if (isEmployeeDropdownSelection(selected)) {
      const list = this.EmployeeList || [];
      if (!list.some((e) => Number(e.employeeID) === Number(selected.employeeID))) {
        this.EmployeeList = [selected, ...list];
      }
    }
    onEmployeeAutocompleteSelected(
      this.advanceTableForm,
      'lumpsumRateApprovedByEmployee',
      selected,
      (id) => {
        this.reservationDiscountDetailsByEmployeesID = id;
        this.advanceTableForm.patchValue({ lumpsumRateApprovedByEmployeeID: id }, { emitEvent: false });
      }
    );
    this.advanceTableForm.get('lumpsumRateApprovedByEmployee')?.updateValueAndValidity({ emitEvent: false });
  }

  private prepareEmployeeForSave(raw: Record<string, unknown>): void {
    coerceEmployeeFieldToApiString(raw, 'lumpsumRateApprovedByEmployee', this.EmployeeList || []);
    const employee = findEmployeeByDropdownInput(
      this.advanceTableForm.get('lumpsumRateApprovedByEmployee')?.value,
      this.EmployeeList || []
    );
    if (employee?.employeeID) {
      raw.lumpsumRateApprovedByEmployeeID = employee.employeeID;
      this.reservationDiscountDetailsByEmployeesID = employee.employeeID;
    }
  }

  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      reservationLumpsumRateID: [this.advanceTable.reservationLumpsumRateID],
      reservationID: [this.advanceTable.reservationID],
      activationStatus: [this.advanceTable.activationStatus],
      lumpsumRatePercentage: [this.advanceTable.lumpsumRatePercentage],
      lumpsumRateApprovedByEmployeeID: [this.advanceTable.lumpsumRateApprovedByEmployeeID],
      attachment:[this.advanceTable.attachment],
      lumpsumRateApprovedByEmployee:[this.advanceTable.lumpsumRateApprovedByEmployee, [Validators.required]],
      
    });
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
    this.advanceTableForm.patchValue({reservationID:this.ReservationID});
    const requestObject = this.advanceTableForm.getRawValue();
    this.prepareEmployeeForSave(requestObject);
    this.advanceTableService.add(requestObject)  
    .subscribe(
    response => 
    { 
      this.showNotification(
        'snackbar-success',
        'Lumpsum Rate Details Created...!!!',
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
        'Opertion Failed...!!!',
        'bottom',
        'center'
      );
      this.saveDisabled=true;
    }
  )
  }
  public Put(): void
  {
    this.advanceTableForm.patchValue({reservationID:this.advanceTable.reservationID});
    const requestObject = this.advanceTableForm.getRawValue();
    this.prepareEmployeeForSave(requestObject);
    if (!requestObject.lumpsumRateApprovedByEmployeeID) {
      requestObject.lumpsumRateApprovedByEmployeeID =
        this.reservationDiscountDetailsByEmployeesID || this.advanceTable.lumpsumRateApprovedByEmployeeID;
    }
    this.advanceTableService.update(requestObject)  
    .subscribe(
    response => 
    {
     
     this.showNotification(
        'snackbar-success',
        'Lumpsum Rate Details Update...!!!',
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
        'Opertion Failed...!!!',
        'bottom',
        'center'
      ); 
      this.saveDisabled=true;
    }
  )
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
    this.saveDisabled=false;
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

