// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { KamDetailsService } from '../../kamDetails.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { KamDetails } from '../../kamDetails.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../../../general/general.service';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { Observable, of } from 'rxjs';
import {
  createDisplayEmployeeFn,
  formatEmployeeDropdownLabel,
  initEmployeePrefixSearchOnControl,
  isEmployeeDropdownSelection,
  isEmployeeExited,
  isSelectedEmployeeExitedFromControl,
} from 'src/app/shared/customer-employee-autocomplete';

@Component({
  standalone: false,
  selector: 'app-kam-dialog',
  templateUrl: './kam-dialog.component.html',
  styleUrls: ['./kam-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class KamDialogComponent implements OnInit
{
  formatEmployeeDropdownLabel = formatEmployeeDropdownLabel;
  isEmployeeExited = isEmployeeExited;
  displayEmployeeFn = createDisplayEmployeeFn();

  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: KamDetails;

  employeeNameControl = new FormControl<string | EmployeeDropDown>('');
  public EmployeeList?: EmployeeDropDown[] = [];
  filteredEmployeeOptions: Observable<EmployeeDropDown[]> = of([]);
  selectedEmployeeMobile = '';
  selectedEmployeeEmail = '';
  selectedEmployeeID: number;

  constructor(
  public dialogRef: MatDialogRef<KamDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: KamDetailsService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='KamDetails';
          this.advanceTable = data.advanceTable;
        } else 
        {
          this.dialogTitle = 'KamDetails';
          this.advanceTable = new KamDetails({});
          this.advanceTable.activationStatus="Active";
        }
        this.advanceTableForm = this.createContactForm();
  }

  ngOnInit(): void {
    if (this.advanceTable?.updatedBy) {
      this.selectedEmployeeID = Number(this.advanceTable.updatedBy);
    }
  }

  isSelectedEmployeeExited(): boolean {
    return isSelectedEmployeeExitedFromControl(this.employeeNameControl, this.EmployeeList || []);
  }

  InitEmployeePrefix(): void {
    initEmployeePrefixSearchOnControl(this._generalService, this.employeeNameControl, {
      getEmployeeList: () => this.EmployeeList || [],
      setEmployeeList: (list) => { this.EmployeeList = list; },
      setFilteredOptions: (options) => { this.filteredEmployeeOptions = options; },
    });
  }

  onEmployeeSelected(employee: EmployeeDropDown): void {
    if (!isEmployeeDropdownSelection(employee)) {
      return;
    }
    this.employeeNameControl.setValue(employee, { emitEvent: false });
    this.selectedEmployeeID = employee.employeeID;
    this.selectedEmployeeMobile = employee.mobile || '';
    this.selectedEmployeeEmail = employee.email || '';
    this.advanceTableForm.patchValue({ updatedBy: employee.employeeID }, { emitEvent: false });
  }

  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      kamDetailsID: [this.advanceTable.kamDetailsID],
      kamDetails: [this.advanceTable.kamDetails,[this.noWhitespaceValidator]],
      activationStatus: [this.advanceTable.activationStatus],
      updatedBy: [this.advanceTable.updatedBy],
      updateDateTime: [this.advanceTable.updateDateTime]
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}

  submit() 
  {
  }
  onNoClick(): void 
  {
    this.dialogRef.close();
  }
  public Post(): void
  {
    if (this.selectedEmployeeID) {
      this.advanceTableForm.patchValue({ updatedBy: this.selectedEmployeeID });
    }
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    { 
       if(response.activationStatus.indexOf("Duplicate") !== -1)
       {
        this._generalService.sendUpdate('DataNotFound:DuplicacyError:Failure');
       }
       else 
       {
        this.dialogRef.close();
       this._generalService.sendUpdate('KamDetailsCreate:KamDetailsView:Success');
    }
  },
    error =>
    {
       this._generalService.sendUpdate('KamDetailsAll:KamDetailsView:Failure');
    }
  )
  }
  public Put(): void
  {
    if (this.selectedEmployeeID) {
      this.advanceTableForm.patchValue({ updatedBy: this.selectedEmployeeID });
    }
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
       if(response.activationStatus.indexOf("Duplicate") !== -1)
       {
        this._generalService.sendUpdate('DataNotFound:DuplicacyError:Failure');
       }
       else 
       {
        this.dialogRef.close();
       this._generalService.sendUpdate('KamDetailsUpdate:KamDetailsView:Success');
       }
    },
    error =>
    {
     this._generalService.sendUpdate('KamDetailsAll:KamDetailsView:Failure');
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
}

