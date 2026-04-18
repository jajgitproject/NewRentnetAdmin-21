// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
// import { IncidenceTypeService } from '../../incidenceType.service';
import { FormControl, Validators, FormGroup, FormBuilder, AbstractControl, ValidatorFn, ValidationErrors} from '@angular/forms';
// import { IncidenceType } from '../../incidenceType.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { IncidenceType } from '../../incidenceType.model';
import { IncidenceTypeService } from '../../incidenceType.service';
import { DepartmentDropDown } from 'src/app/general/departmentDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
// import { IncidenceTypeService } from '../../incidenceType.service';
// import { IncidenceType } from '../../incidenceType.model';

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
  advanceTable: IncidenceType;
  saveDisabled:boolean = true;
  departmentID: any;
  public DepartmentList?: DepartmentDropDown[] = [];
    filteredDepartmentOptions: Observable<DepartmentDropDown[]>;
  department: any;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: IncidenceTypeService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        console.log(this.data);
      
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Incidence Type';       
          this.advanceTable = data.advanceTable;
          this.advanceTableForm?.controls['department'].setValue(this.advanceTable.department);
          console.log(this.advanceTable);
        } else 
        {
          this.dialogTitle = 'Incidence Type';
          this.advanceTable = new IncidenceType({});
          this.advanceTable.activationStatus=true;
          this.departmentID = data.departmentID;
          this.department = data.department;
          console.log(this.departmentID);
        }
        this.advanceTableForm = this.createContactForm();
  }

  public ngOnInit(): void
  {
    // this.advanceTableForm = this.createContactForm();
    // this.advanceTableForm.controls['incidenceType'].setValue(this.advanceTable.incidenceType);
    // this.advanceTableForm.controls['activationStatus'].setValue(this.advanceTable.activationStatus);
    // this.advanceTableForm.controls['department'].setValue(this.advanceTable.department);
    // this.advanceTableForm.controls['incidenceTypeID'].setValue(this.advanceTable.incidenceTypeID);
    // this.advanceTableForm.controls['departmentID'].setValue(this.departmentID);
    console.log(this.advanceTableForm.value);
   this.Initdepartment();
  
 }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      incidenceTypeID: [this.advanceTable.incidenceTypeID],
      department: [this.advanceTable.department],
      departmentID: [this.advanceTable.departmentID],
      incidenceType: [this.advanceTable.incidenceType,[this.noWhitespaceValidator]],
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
       if (!value || value.length < 3)
     {
        return [];   
      }
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
      console.log(departmentID);
      this.departmentID = departmentID;
      this.advanceTableForm.patchValue({ departmentID: departmentID });
    }
  
    departmentTypeValidator(DepartmentList: any[]): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value?.toLowerCase();
        const match = DepartmentList.some(group => group.department.toLowerCase() === value);
        return match ? null : { departmentInvalid: true };
      };
    }
  public Post(): void {
    // this.advanceTableForm.patchValue({departmentID : this.departmentID });
    this.saveDisabled = false; // Show spinner and disable button immediately

    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
        response => {
            this.saveDisabled = true; // Hide spinner and enable button
            this.dialogRef.close();
            this._generalService.sendUpdate('IncidenceTypeCreate:IncidenceTypeView:Success');
        },
        error => {
            this.saveDisabled = true; // Ensure button is re-enabled even on failure
            this._generalService.sendUpdate('IncidenceTypeAll:IncidenceTypeView:Failure');
        }
    );
}

public Put(): void {
  this.advanceTableForm.patchValue({ 
    departmentID: this.departmentID || this.advanceTable.departmentID, 

  });
    this.saveDisabled = false; // Show spinner and disable button immediately

    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
        response => {
            this.saveDisabled = true; // Hide spinner and enable button
            this.dialogRef.close();
            this._generalService.sendUpdate('IncidenceTypeUpdate:IncidenceTypeView:Success');
        },
        error => {
            this.saveDisabled = true; // Ensure button is re-enabled even on failure
            this._generalService.sendUpdate('IncidenceTypeAll:IncidenceTypeView:Failure');
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
}


