// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { BillingInstructionsDetailsService } from '../../billingInstructionsDetails.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { BillingInstructionsDetails } from '../../billingInstructionsDetails.model';
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
  selector: 'app-billing-instructions-details-dialog',
  templateUrl: './billing-instruction-dialog.component.html',
  styleUrls: ['./billing-instruction-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class BillingInstructionsDetailsDialogComponent 
{
  formatEmployeeDropdownLabel = formatEmployeeDropdownLabel;
  isEmployeeExited = isEmployeeExited;
  displayEmployeeFn = createDisplayEmployeeFn();

  saveDisabled:boolean=true;
  buttonDisabled:boolean=false;
  status: any;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: BillingInstructionsDetails;
  reservationBillingInstructionByEmployeesID: any;
  ReservationID: any;

  public EmployeeList?: EmployeeDropDown[] = [];
  filteredCreatedByOptionss: Observable<EmployeeDropDown[]> = of([]);

  constructor(
  public dialogRef: MatDialogRef<BillingInstructionsDetailsDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: BillingInstructionsDetailsService,
  private snackBar: MatSnackBar,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        this.action = data.action;
        
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Billing Instruction';       
          this.advanceTable = data.advanceTable;
          this.ImagePath = this.advanceTable.reservationBillingInstructionAttachment;
      
        } else 
        {
          this.dialogTitle = 'Billing Instruction';
          this.advanceTable = new BillingInstructionsDetails({});
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
    const employeeCtrl = this.advanceTableForm.get('reservationBillingInstructionByEmployee');
    employeeCtrl?.setValidators([
      Validators.required,
      employeeNameControlValidator(() => this.EmployeeList || []),
    ]);
    employeeCtrl?.updateValueAndValidity({ emitEvent: false });

    if (this.action === 'edit') {
      this.patchEmployeeForEdit();
    }
  }

  isSelectedEmployeeExited(): boolean {
    return isSelectedEmployeeExitedFromForm(
      this.advanceTableForm,
      'reservationBillingInstructionByEmployee',
      this.EmployeeList || []
    );
  }

  private patchEmployeeForEdit(): void {
    patchEmployeeNameForEditById(
      this._generalService,
      this.advanceTable?.reservationBillingInstructionByEmployeeID,
      this.advanceTableForm,
      'reservationBillingInstructionByEmployee',
      {
        getEmployeeList: () => this.EmployeeList || [],
        setEmployeeList: (list) => { this.EmployeeList = list; },
        setFilteredOptions: (options) => { this.filteredCreatedByOptionss = options; },
        onEmployeeId: (id) => {
          this.reservationBillingInstructionByEmployeesID = id;
          this.advanceTableForm.patchValue({ reservationBillingInstructionByEmployeeID: id }, { emitEvent: false });
        },
      }
    );
  }

  InitEmployeePrefix(): void {
    initEmployeeNamePrefixSearch(this._generalService, this.advanceTableForm, 'reservationBillingInstructionByEmployee', {
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
      'reservationBillingInstructionByEmployee',
      selected,
      (id) => {
        this.reservationBillingInstructionByEmployeesID = id;
        this.advanceTableForm.patchValue({ reservationBillingInstructionByEmployeeID: id }, { emitEvent: false });
      }
    );
    this.advanceTableForm.get('reservationBillingInstructionByEmployee')?.updateValueAndValidity({ emitEvent: false });
  }

  private prepareEmployeeForSave(raw: Record<string, unknown>): void {
    coerceEmployeeFieldToApiString(raw, 'reservationBillingInstructionByEmployee', this.EmployeeList || []);
    const employee = findEmployeeByDropdownInput(
      this.advanceTableForm.get('reservationBillingInstructionByEmployee')?.value,
      this.EmployeeList || []
    );
    if (employee?.employeeID) {
      raw.reservationBillingInstructionByEmployeeID = employee.employeeID;
      this.reservationBillingInstructionByEmployeesID = employee.employeeID;
    }
  }

  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      reservationBillingInstructionID: [this.advanceTable.reservationBillingInstructionID],
      reservationID: [this.advanceTable.reservationID],
      activationStatus: [this.advanceTable.activationStatus],
      reservationBillingInstruction: [this.advanceTable.reservationBillingInstruction],
      reservationBillingInstructionAttachment: [this.advanceTable.reservationBillingInstructionAttachment],
      reservationBillingInstructionByEmployeeID: [this.advanceTable.reservationBillingInstructionByEmployeeID],
      reservationBillingInstructionByEmployee:[this.advanceTable.reservationBillingInstructionByEmployee, [Validators.required]],
      
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
        'Billing Instructions Details Created Successfully...!!!',
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
        'Operation Failed...!!!',
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
    if (!requestObject.reservationBillingInstructionByEmployeeID) {
      requestObject.reservationBillingInstructionByEmployeeID =
        this.reservationBillingInstructionByEmployeesID || this.advanceTable.reservationBillingInstructionByEmployeeID;
    }
    this.advanceTableService.update(requestObject)  
    .subscribe(
    response => 
    {
     
     this.showNotification(
        'snackbar-success',
        'Billing Instructions Details Update...!!!',
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
     this.advanceTableForm.patchValue({ reservationBillingInstructionAttachment: this.ImagePath })
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

