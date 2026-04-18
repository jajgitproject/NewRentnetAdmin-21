// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { DutyExpenseService } from '../../dutyExpense.service';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';
import { DutyExpenseModel } from '../../dutyExpense.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ExpenseDropDown } from '../../expenseDropDown.model';
import { UomDropDown } from 'src/app/uom/uomDropDown.model';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  advanceTable: DutyExpenseModel;
  expenseID:number;
  uomid:number;
  filteredExpenseOptions:Observable<ExpenseDropDown[]>;
  public ExpenseList:ExpenseDropDown[]=[];

  filteredUOMOptions:Observable<UomDropDown[]>;
  public UOMList:UomDropDown[]=[];
  DutySlipID: number;
  verifyDutyStatusAndCacellationStatus: any;
  isSaveAllowed: boolean = false;

  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: DutyExpenseService,
    private fb: FormBuilder,
    public route:ActivatedRoute,
    private snackBar: MatSnackBar,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        this.verifyDutyStatusAndCacellationStatus = data.verifyDutyStatusAndCacellationStatus;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Duty Expense';       
          this.advanceTable = data.advanceTable;
        } else 
        {
          this.dialogTitle = 'Duty Expense';
          this.advanceTable = new DutyExpenseModel({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
        this.DutySlipID=data.dutySlipID;
        if (this.verifyDutyStatusAndCacellationStatus !== 'Changes allow') 
        {
          this.isSaveAllowed = true;
        } 
        else
        {
          this.isSaveAllowed = false;
        }
  }

  ngOnInit()
  {
    this.InitExpense();
    this.InitUOM();
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      dutyExpenseID: [this.advanceTable.dutyExpenseID],
      dutySlipID: [this.advanceTable.dutySlipID],
      expenseID: [this.advanceTable.expenseID],
      expense: [this.advanceTable.expense],
      uomid: [this.advanceTable.uomid],
      uom: [this.advanceTable.uom],
      uomUnits: [this.advanceTable.uomUnits],
      amountPerUnit: [this.advanceTable.amountPerUnit],
      amount: [this.advanceTable.amount],
      chargeableOrNonChargeable: [this.advanceTable.chargeableOrNonChargeable],
      activationStatus: [this.advanceTable.activationStatus]
    });
  }
  
  //============ Calculate Amount =========================//
  calculateAmount() {
    const uomUnits = this.advanceTableForm.get('uomUnits').value;
    const amountPerUnit = this.advanceTableForm.get('amountPerUnit').value;
    var amount;
    if (uomUnits !== 0)
    {
      amount = (uomUnits * amountPerUnit).toFixed(2);
      this.advanceTableForm.patchValue({amount:amount});
    }
  }

  //============ Calculate Unit =========================//
  calculateAmountPerUnit() {
    const uomUnits = this.advanceTableForm.get('uomUnits').value;
    const amount = this.advanceTableForm.get('amount').value;
    var amountPerUnit;
    if (uomUnits !== 0)
    {
      amountPerUnit = (amount / uomUnits).toFixed(2);
      this.advanceTableForm.patchValue({amountPerUnit:amountPerUnit});
    }
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}

//---------Expense-----------------
InitExpense(){
  this._generalService.GetExpense().subscribe(
    data=>
    {
      this.ExpenseList=data;
      this.advanceTableForm.controls['expense'].setValidators([Validators.required,
        this.expenseValidator(this.ExpenseList)
      ]);
      this.filteredExpenseOptions = this.advanceTableForm.controls['expense'].valueChanges.pipe(
        startWith(""),
        map(value => this._filterExpense(value || ''))
      ) 
    });
}

private _filterExpense(value: string): any {
  const filterValue = value.toLowerCase();
  return this.ExpenseList.filter(
    data => 
    {
      return data.expense.toLowerCase().includes(filterValue);
    }
  );
}

OnExpenseSelect(selectedExpense: string)
{
  const ExpenseName = this.ExpenseList.find(
  data => data.expense === selectedExpense
  );
  if (selectedExpense) 
  {
    this.getExpenseID(ExpenseName.expenseID);
  }
}

getExpenseID(expenseID:any)
{
  this.expenseID=expenseID;
  this.advanceTableForm.patchValue({expenseID:this.expenseID});
}

expenseValidator(ExpenseList: any[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value?.toLowerCase();
    const match = ExpenseList.some(group => group.expense.toLowerCase() === value);
    return match ? null : { expenseInvalid: true };
  };
}

//---------UOM-----------------
// InitUOM()
// {
//   this._generalService.GetUOM().subscribe(
//     data =>
//      {
//       this.UOMList = data;
//       this.filteredUOMOptions = this.advanceTableForm.controls['uom'].valueChanges.pipe(
//         startWith(""),
//         map(value => this._filterUom(value || ''))
//       )    
//      });
// }

InitUOM()
{
  this._generalService.GetUOM().subscribe(
    data =>
     {
      this.UOMList = data; 
      this.advanceTableForm.controls['uom'].setValidators([Validators.required,
        this.uomTypeValidator(this.UOMList)
      ]);
      this.advanceTableForm.controls['uom'].updateValueAndValidity(); 
      this.filteredUOMOptions = this.advanceTableForm.controls['uom'].valueChanges.pipe(
        startWith(""),
        map(value => this._filterUom(value || ''))
      );     
     },
     error =>
     {
     }
  );
}

 private _filterUom(value: string): any {
  const filterValue = value.toLowerCase();
  return this.UOMList.filter(
    data => 
    {
      return data.uom.toLowerCase().includes(filterValue);
    }
  );
}

OnUOMSelect(selectedUOM: string)
{
  const UOMName = this.UOMList.find(
  data => data.uom === selectedUOM
  );
  if (selectedUOM) 
  {
    this.getUomID(UOMName.uomID);
  }
}

getUomID(uomid: any)
{
  this.uomid=uomid;
  this.advanceTableForm.patchValue({uomid:this.uomid});
}

uomTypeValidator(UOMList: any[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value?.toLowerCase();
    const match = UOMList.some(group => group.uom.toLowerCase() === value);
    return match ? null : { UomInvalid: true };
  };
}

  submit() {}

  onNoClick(): void 
  {
    if(this.action==='add'){
      this.advanceTableForm.reset();

    }
    else if(this.action==='edit'){
      this.dialogRef.close();
    }
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
    this.advanceTableForm.patchValue({uomid:this.uomid});
    this.advanceTableForm.patchValue({dutySlipID:this.DutySlipID});
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
      
        this.showNotification(
          'snackbar-success',
          'Duty Expense Created...!!!',
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
    })
  }

  public Put(): void
  {
    this.advanceTableForm.patchValue({uomID:this.uomid || this.advanceTable.uomid});
    this.advanceTableForm.patchValue({dutySlipID:this.DutySlipID || this.advanceTable.dutySlipID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
      
      this._generalService.sendUpdate('DutyExpenseUpdate:DutyExpenseView:Success');//To Send Updates 
      this.saveDisabled=true;
      this.dialogRef.close(); 
    },
    error =>
    {
     this._generalService.sendUpdate('DutyExpenseAll:DutyExpenseView:Failure');//To Send Updates
     this.saveDisabled=true;  
    }
    )
  }

  public confirmAdd(): void 
  {
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


