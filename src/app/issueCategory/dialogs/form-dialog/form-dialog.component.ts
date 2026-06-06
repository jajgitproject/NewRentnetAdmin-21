// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { IssueCategoryService } from '../../issueCategory.service';
import { FormControl, Validators, FormGroup, FormBuilder, AbstractControl, ValidatorFn, ValidationErrors} from '@angular/forms';
import { IssueCategory } from '../../issueCategory.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { IssueCategoryDropDown } from '../../issueCategoryDropDown.model';
import { IncidenceTypeDropDown } from 'src/app/incidenceType/incidenceTypeDropDown.model';

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
  advanceTable: IssueCategory;
  saveDisabled:boolean = true;
  severityOptions: string[] = ['Low', 'Medium', 'High', 'Critical'];
  incidenceTypeID: any; // Declare incidenceTypeID as a property
    departmentID: any;
    public DepartmentList?: DepartmentDropDown[] = [];
      filteredDepartmentOptions: Observable<DepartmentDropDown[]>;
    department: any;

  public incidenceTypeList?: IncidenceTypeDropDown[] = [];
filteredIncidenceTypeOptions: Observable<IncidenceTypeDropDown[]>;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: IssueCategoryService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Issue Category';       
          this.advanceTable = data.advanceTable;
          this.advanceTableForm?.controls['incidenceType'].setValue(this.advanceTable.incidenceType);
        } else 
        {
          this.dialogTitle = 'Issue Category';
          this.advanceTable = new IssueCategory({});
          this.advanceTable.activationStatus=true;
         this.advanceTable.incidenceTypeID = data.incidenceTypeID;
         this.advanceTable.incidenceType = data.incidenceType;
        }
        this.advanceTableForm = this.createContactForm();
  }
  
  public ngOnInit(): void
  {
 
   this.Initdepartment();
  
 }

  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      issueCategoryID: [this.advanceTable.issueCategoryID],
      incidenceTypeID: [this.advanceTable.incidenceTypeID],
      departmentID:[this.advanceTable.departmentID],
      department:[this.advanceTable.department],
      incidenceType: [this.advanceTable.incidenceType],
      issueCategory: [this.advanceTable.issueCategory,[this.noWhitespaceValidator]],
      severity: [this.advanceTable.severity, Validators.required],
      activationStatus: [this.advanceTable.activationStatus],
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
    if(this.action==='add'){
      this.advanceTableForm.reset();

    }
    else if(this.action==='edit'){
      this.dialogRef.close();
    }
  }
   Initdepartment() {
      this._generalService.GetDepartments().subscribe(
        data => {
          this.DepartmentList = data;
          this.advanceTableForm.controls['department'].setValidators([Validators.required,
            this.departmentTypeValidator(this.DepartmentList)
          ]);
          this.advanceTableForm.controls['department'].updateValueAndValidity();
          this.filteredDepartmentOptions =  this.advanceTableForm.controls['department'].valueChanges.pipe(
            startWith(""),
            map(value => this._filterDepartment(value || ''))
          );
        });
    }
  
    private _filterDepartment(value: string): any {
      const filterValue = value.toLowerCase();
      
      return this.DepartmentList.filter(
        customer => {
          return customer.department.toLowerCase().includes(filterValue);
        }
      );
    }
  
    onDepartment(selectedDepartment: string) {
      const selectdepartment = this.DepartmentList.find(
        department => department.department === selectedDepartment
      );
    
      if (selectdepartment) {
        this.getdepartmentID(selectdepartment.departmentID);
      }
    }
  
    getdepartmentID(departmentID: any) {
      this.departmentID = departmentID;
      this.advanceTableForm.patchValue({ departmentID: departmentID });
      this.InitIncidenceType(this.departmentID);
    }
  
    departmentTypeValidator(DepartmentList: any[]): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value?.toLowerCase();
        const match = DepartmentList.some(group => group.department.toLowerCase() === value);
        return match ? null : { departmentInvalid: true };
      };
    }
  public Post(): void {
    this.saveDisabled = false; // Show spinner before making API call

    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
        response => {
            this.saveDisabled = true; // Hide spinner
            this.dialogRef.close();
            this._generalService.sendUpdate('IssueCategoryCreate:IssueCategoryView:Success');
        },
        error => {
            this.saveDisabled = true; // Hide spinner
            this._generalService.sendUpdate('IssueCategoryAll:IssueCategoryView:Failure');
        }
    );
}

public Put(): void {
  this.advanceTableForm.patchValue({ incidenceTypeID: this.incidenceTypeID  || this.advanceTable.incidenceTypeID });
    this.saveDisabled = false; // Show spinner before making API call

    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
        response => {
            this.saveDisabled = true; // Hide spinner
            this.dialogRef.close();
            this._generalService.sendUpdate('IssueCategoryUpdate:IssueCategoryView:Success');
        },
        error => {
            this.saveDisabled = true; // Hide spinner
            this._generalService.sendUpdate('IssueCategoryAll:IssueCategoryView:Failure');
        }
    );
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

  InitIncidenceType(departmentID) {
    this._generalService.getIncidenceTypeByDepartment(departmentID).subscribe(data => {
      this.incidenceTypeList = data;
      this.advanceTableForm.controls['incidenceType'].setValidators([
        Validators.required,
        this.incidenceTypeValidator(this.incidenceTypeList)
      ]);
      this.advanceTableForm.controls['incidenceType'].updateValueAndValidity();
  
      this.filteredIncidenceTypeOptions = this.advanceTableForm.controls['incidenceType'].valueChanges.pipe(
        startWith(""),
        map(value => this._filterIncidenceType(value || ''))
      );
    });
  }
  
  private _filterIncidenceType(value: string): any[] {
    const filterValue = value.toLowerCase();
    //  if (!value || value.length < 3)
    //  {
    //     return [];   
    //   }
    return this.incidenceTypeList?.filter(item =>
      item.incidenceType?.toLowerCase().includes(filterValue)
    );
  }
  
  onIncidenceType(selectedincidenceType: string) {
    const selected = this.incidenceTypeList.find(item => item.incidenceType === selectedincidenceType);
    if (selected) {
      this.getIncidenceTypeID(selected.incidenceTypeID);
    }
  }
  
  getIncidenceTypeID(incidenceTypeID: any) {
    this.incidenceTypeID = incidenceTypeID;
    this.advanceTableForm.patchValue({ incidenceTypeID:incidenceTypeID });
  }
  
  incidenceTypeValidator(list: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = list.some(item => item.incidenceType?.toLowerCase() === value);
      return match ? null : { incidenceTypeInvalid: true };
    };
  }

}



