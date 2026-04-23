// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { GeneralBillService } from '../../generalBill.service';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';
import { GeneralBillModel } from '../../generalBill.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { UomDropDown } from 'src/app/uom/uomDropDown.model';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';

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
  advanceTable: GeneralBillModel;

  filteredUOMOptions:Observable<UomDropDown[]>;
  public UOMList:UomDropDown[]=[];
  uomID: any;
  invoiceID: any;
  cgstRate: any;
  cgstAmount: any;
  sgstRate: any;
  sgstAmount: any;
  igstRate: any;
  igstAmount: any;
  uomid: any;
  
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: GeneralBillService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
    // Set the defaults
    this.invoiceID = data.invoiceID;
    this.cgstRate = data.cgstRate;
    this.cgstAmount = data.cgstAmount;
    this.sgstRate = data.sgstRate;
    this.sgstAmount = data.sgstAmount;
    this.igstRate = data.igstRate;
    this.igstAmount = data.igstAmount;
    this.action = data.action;
    if (this.action === 'edit') 
    {
      this.dialogTitle ='General Bill Line Item';       
      this.advanceTable = data.advanceTable;
    } 
    else 
    {
      this.dialogTitle = 'General Bill Line Item';
      this.advanceTable = new GeneralBillModel({});
      this.advanceTable.activationStatus=true;
    }
    this.advanceTableForm = this.createContactForm();
  }

  ngOnInit()
  {
    this.advanceTableForm.patchValue({cgstRate:this.data.cgstRate});
    this.advanceTableForm.controls["cgstRate"].disable();
    //this.advanceTableForm.patchValue({cgstAmount:this.data.cgstAmount});
    this.advanceTableForm.controls["cgstAmount"].disable();
    this.advanceTableForm.patchValue({sgstRate:this.data.sgstRate});
    this.advanceTableForm.controls["sgstRate"].disable();
    //this.advanceTableForm.patchValue({sgstAmount:this.data.sgstAmount});
    this.advanceTableForm.controls["sgstAmount"].disable();
    this.advanceTableForm.patchValue({igstRate:this.data.igstRate});
    this.advanceTableForm.controls["igstRate"].disable();
    //this.advanceTableForm.patchValue({igstAmount:this.data.igstAmount});
    this.advanceTableForm.controls["igstAmount"].disable();
    this.InitUOM();
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      invoiceGeneralLineItemsID: [this.advanceTable.invoiceGeneralLineItemsID],
      invoiceID: [this.advanceTable.invoiceID],
      narration: [this.advanceTable.narration],
      rate: [this.advanceTable.rate],
      quantity: [this.advanceTable.quantity],
      baseAmount: [this.advanceTable.baseAmount],
      uomid: [this.advanceTable.uomid],
      uom: [this.advanceTable.uom],
      cgstRate: [this.advanceTable.cgstRate],
      cgstAmount: [this.advanceTable.cgstAmount],
      sgstRate: [this.advanceTable.sgstRate],
      sgstAmount: [this.advanceTable.sgstAmount],
      igstRate: [this.advanceTable.igstRate],
      igstAmount: [this.advanceTable.igstAmount],
      totalAmount: [this.advanceTable.totalAmount],
      activationStatus: [this.advanceTable.activationStatus],
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}

//--------------- UOM's Drop Down ---------------
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
     {}
  );
}
private _filterUom(value: string): any {
  const filterValue = value.toLowerCase();
  // if (!value || value.length < 3) {
  //     return [];   
  //   }
  return this.UOMList.filter(
    data => 
    {
      return data.uom.toLowerCase().indexOf(filterValue)===0;
    }
  );
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

//--------------- Calculate Base Amount ---------------
calculateBaseTotalAmount() 
{
  const rate = this.advanceTableForm.get('rate').value;
  const quantity = this.advanceTableForm.get('quantity').value;
  var baseAmount;
  if (quantity !== 0)
  {
    baseAmount = (rate * quantity).toFixed(2);
    this.advanceTableForm.patchValue({baseAmount:baseAmount});
  }

  //--------------- Percentage Calculation ---------------
  const igstPercentage = this.advanceTableForm.get('igstRate').value;
  const igstAmount = (igstPercentage * baseAmount)/100;

  const cgstPercentage = this.advanceTableForm.get('cgstRate').value;
  const cgstAmount = (cgstPercentage * baseAmount)/100;

  const sgstPercentage = this.advanceTableForm.get('sgstRate').value;
  const sgstAmount = (sgstPercentage * baseAmount)/100;


  //--------------- Calculate Total ---------------
  //const totalAmount = (Number(baseAmount) + Number(this.data.cgstAmount) + Number(this.data.sgstAmount) + Number(this.data.igstAmount))
  const totalAmount = (Number(baseAmount) + Number(cgstAmount) + Number(sgstAmount) + Number(igstAmount));
  this.advanceTableForm.patchValue({igstAmount:igstAmount});
  this.advanceTableForm.patchValue({cgstAmount:cgstAmount});
  this.advanceTableForm.patchValue({sgstAmount:sgstAmount});
  this.advanceTableForm.patchValue({totalAmount:totalAmount});
  this.advanceTableForm.controls["totalAmount"].disable();
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
    this.advanceTableForm.patchValue({invoiceID:this.data.invoiceID});
    this.advanceTableForm.patchValue({cgstRate:this.data.cgstRate});
    //this.advanceTableForm.patchValue({cgstAmount:this.data.cgstAmount});
    this.advanceTableForm.patchValue({sgstRate:this.data.sgstRate});
    //this.advanceTableForm.patchValue({sgstAmount:this.data.sgstAmount});
    this.advanceTableForm.patchValue({igstRate:this.data.igstRate});
    //this.advanceTableForm.patchValue({igstAmount:this.data.igstAmount});
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
      this.dialogRef.close();
      this._generalService.sendUpdate('GeneralBillCreate:GeneralBillView:Success');//To Send Updates  
    },
    error =>
    {
      this._generalService.sendUpdate('GeneralBillAll:GeneralBillView:Failure');//To Send Updates  
    })
  }

  public Put(): void
  {
    //this.advanceTableForm.patchValue({uomID:this.uomID});
    this.advanceTableForm.patchValue({invoiceID:this.data.invoiceID});
    this.advanceTableForm.patchValue({cgstRate:this.data.cgstRate});
    //this.advanceTableForm.patchValue({cgstAmount:this.data.cgstAmount});
    this.advanceTableForm.patchValue({sgstRate:this.data.sgstRate});
    //this.advanceTableForm.patchValue({sgstAmount:this.data.sgstAmount});
    this.advanceTableForm.patchValue({igstRate:this.data.igstRate});
    //this.advanceTableForm.patchValue({igstAmount:this.data.igstAmount});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
      this.dialogRef.close();
      this._generalService.sendUpdate('GeneralBillUpdate:GeneralBillView:Success');//To Send Updates   
    },
    error =>
    {
     this._generalService.sendUpdate('GeneralBillAll:GeneralBillView:Failure');//To Send Updates  
    })
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


