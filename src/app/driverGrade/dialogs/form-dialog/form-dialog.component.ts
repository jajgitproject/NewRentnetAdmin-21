// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { DriverGradeService } from '../../driverGrade.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { DriverGrade } from '../../driverGrade.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { DriverGradeDropDown } from '../../driverGradeDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogComponent 
{
  saveDisabled:boolean=true;
  showError: string;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: DriverGrade;
  public DriverGradeList?: DriverGradeDropDown[] = [];
  searchTerm:  FormControl = new FormControl();
  filteredOptions: Observable<DriverGradeDropDown[]>;
  driverGradeID: any;
  public DriverGradeLists?: DriverGradeDropDown[] = [];
  searchPerviousTerm:  FormControl = new FormControl();
  filteredPerviousOptions: Observable<DriverGradeDropDown[]>;
  driverPerviousID: any;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: DriverGradeService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Driver Grade';       
          this.advanceTable = data.advanceTable;
          this.searchTerm.setValue(this.advanceTable.nextGrade);
          this.searchPerviousTerm.setValue(this.advanceTable.previousGrade);
        } else 
        {
          this.dialogTitle = 'Driver Grade';
          this.advanceTable = new DriverGrade({});
          this.advanceTable.activationStatus=true;
          
        }
        this.advanceTableForm = this.createContactForm();
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      driverGradeID: [this.advanceTable.driverGradeID],
      driverGradeName: [this.advanceTable.driverGradeName,],
      nextGradeID: [this.advanceTable.nextGradeID],
      nextGrade: [this.advanceTable.nextGrade],
      previousGrade: [this.advanceTable.previousGrade],
      previousGradeID: [this.advanceTable.previousGradeID],
      activationStatus: [this.advanceTable.activationStatus],
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}
public ngOnInit(): void
{
  this.initDriverGrade();
  this.initPerviousGrade();
}

initDriverGrade() {
    
  this._generalService.getDriverGrade().subscribe(
    data =>
    {
      this.DriverGradeList = data;
      this.filteredOptions = this.advanceTableForm.controls['nextGrade'].valueChanges.pipe(
        startWith(""),
        map(value => this._filter(value || ''))
      );
    },
    error =>
    {
     
    }
  );
}
private _filter(value: string): any {
  const filterValue = value.toLowerCase();
  return this.DriverGradeList.filter(
    customer => 
    {
      return customer.driverGradeName.toLowerCase().indexOf(filterValue)===0;
    }
  );
  
};
getTierID(driverGradeID: any) {
  this.driverGradeID=driverGradeID;
}

customerTypeValidator(DriverGradeList: any[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value?.toLowerCase();
    const match = DriverGradeList.some(group => group.driverGradeName.toLowerCase() === value);
    return match ? null : { nextGradeTypeInvalid: true };
  };
}
initPerviousGrade() {
    
  this._generalService.getDriverGrade().subscribe(
    data =>
    {
      this.DriverGradeLists = data;
      this.filteredPerviousOptions = this.advanceTableForm.controls['previousGrade'].valueChanges.pipe(
        startWith(""),
        map(value => this._filterPervious(value || ''))
      );
    },
    error =>
    {
     
    }
  );
}
private _filterPervious(value: string): any {
  const filterValue = value.toLowerCase();
  return this.DriverGradeLists.filter(
    customer => 
    {
      return customer.driverGradeName.toLowerCase().indexOf(filterValue)===0;
    }
  );  
};

getPerviousID(driverGradeID: any) {
  this.driverPerviousID=driverGradeID;
}

perviousrTypeValidator(DriverGradeLists: any[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value?.toLowerCase();
    const match = DriverGradeLists.some(group => group.driverGradeName.toLowerCase() === value);
    return match ? null : { perviousTypeInvalid: true };
  };
}
  submit() 
  {
  }
  onNoClick(): void 
  {
    if(this.action==='add')
    {
      this.advanceTableForm.reset();
    }
    else if(this.action==='edit')
    {
      this.dialogRef.close();
    }  
  }
  public Post(): void
  {
    this.advanceTableForm.patchValue({nextGradeID:this.driverGradeID });
    this.advanceTableForm.patchValue({previousGradeID:this.driverPerviousID });
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
     
        this.dialogRef.close();
       this._generalService.sendUpdate('DriverGradeCreate:DriverGradeView:Success');//To Send Updates 
       this.saveDisabled = true; 
    
  },
    error =>
    {
       this._generalService.sendUpdate('DriverGradeAll:DriverGradeView:Failure');//To Send Updates 
       this.saveDisabled = true; 
    }
  )
  }
  public Put(): void
  {
    this.advanceTableForm.patchValue({nextGradeID:this.driverGradeID || this.advanceTable.nextGradeID });
    this.advanceTableForm.patchValue({previousGradeID:this.driverPerviousID || this.advanceTable.previousGradeID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
    
        this.dialogRef.close();
       this._generalService.sendUpdate('DriverGradeUpdate:DriverGradeView:Success');//To Send Updates  
       this.saveDisabled = true;
       
    },
    error =>
    {
     this._generalService.sendUpdate('DriverGradeAll:DriverGradeView:Failure');//To Send Updates  
     this.saveDisabled = true;

    }
  )
  }
  public confirmAdd(): void 
  {
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


