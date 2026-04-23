// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { PassToSupplierModel, SupplierDropDownModel } from '../../passToSupplier.model';
import { PassToSupplierService } from '../../passToSupplier.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

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
  advanceTable: PassToSupplierModel;
  saveDisabled:boolean=true;
  status: string = '';
  buttonDisabled: boolean = false;
  dataSource: PassToSupplierModel | null;
  public SupplierList?: SupplierDropDownModel[] = [];
  filteredSupplierOptions: Observable<SupplierDropDownModel[]>;
  supplierID: any;
  address: any;
  email: any;
  phone: any;
  reservationID: any;

  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public passToSupplierService: PassToSupplierService,
  private fb: FormBuilder,
  private snackBar: MatSnackBar,
  public _generalService:GeneralService)
  {
    // Set the defaults
    this.action = data.action;
    this.reservationID=data.reservationID;
    // Extract and normalize status, control button state
    // this.status = this.extractStatus(data?.status);
    // const normalized = (this.status || '').trim().toLowerCase();
    // this.buttonDisabled = normalized !== 'changes allow';
    this.status = this.extractStatus(data);

   // ✅ Extract status safely
  this.status = this.extractStatus(data);

  // ✅ Normalize
  const normalizedStatus = (this.status || '').toLowerCase().trim();

  // ✅ Button disable logic
  this.buttonDisabled = normalizedStatus !== 'changes allow';


    
    if (this.action === 'edit') 
    {
      this.dialogTitle ='Pass To Supplier';       
      //this.advanceTable = data.advanceTable;
      this.loadData();
    }
    else 
    {
      this.dialogTitle = 'Pass To Supplier';
      this.advanceTable = new PassToSupplierModel({});
      this.advanceTable.activationStatus=true;
    }
    this.advanceTableForm = this.createContactForm();
  }

  private extractStatus(input: any): string {
    try {
      if (typeof input === 'string') return input;
      if (input && typeof input.status === 'string') return input.status;
      if (input && input.status && typeof input.status.status === 'string') return input.status.status;
      return '';
    } catch { return ''; }
  }

  ngOnInit():void
  {
    this.InitSupplier();
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      reservationPassedToSupplierID: [this.advanceTable?.reservationPassedToSupplierID],
      reservationID: [this.reservationID],
      supplierID: [this.advanceTable?.supplierID],
      supplierName: [this.advanceTable?.supplierName],
      supplierAddress: [this.advanceTable?.supplierAddress],
      supplierReservationNumber: [this.advanceTable?.supplierReservationNumber],
      supplierEmail: [this.advanceTable?.supplierEmail],
      supplierConcernedPerson: [this.advanceTable?.supplierConcernedPerson],
      supplierConcernedPersonMobile: [this.advanceTable?.supplierConcernedPersonMobile],
      activationStatus: [this.advanceTable?.activationStatus],
    });
  }

  submit(){}

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
    this.passToSupplierService.add(this.advanceTableForm.getRawValue()).subscribe(
    response => 
    {
      this.dialogRef.close();
      this.dialogRef.close(response);
        this.showNotification(
          'snackbar-success',
          'Pass To Supplier Created...!!!',
          'bottom',
          'center'
        );
      this.saveDisabled = true; 
    },
    error =>
    {
      this.showNotification(
        'snackbar-danger',
        'Operation Failed.....!!!',
        'bottom',
        'center'
      );
      this.saveDisabled = true; 
    }
    )
  }

  public Put(): void
  {
    this.passToSupplierService.update(this.advanceTableForm.getRawValue()).subscribe(
    response => 
    {
      this.dialogRef.close();
      this.showNotification(
        'snackbar-success',
        'Pass To Supplier Updated...!!!',
        'bottom',
        'center'
      );     
      this.saveDisabled = true; 
    },
    error =>
    {
     this.showNotification(
        'snackbar-danger',
        'Operation Failed.....!!!',
        'bottom',
        'center'
      );
     this.saveDisabled = true; 
    }
    )
  }

  public confirmAdd(): void 
  {
    if (this.buttonDisabled) {
      return; // blocked by status
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

  //---------- Supplier Drop Down ----------
  supplierTypeValidator(SupplierList: any[]): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value?.toLowerCase();
        const match = SupplierList.some(group => group.supplierName.toLowerCase() === value);
        return match ? null : { supplierNameInvalid: true };
      };
    }
    
    InitSupplier()
    {
      this.passToSupplierService.getSupplier().subscribe(
      data=>
      {
        this.SupplierList=data;
        this.advanceTableForm.controls['supplierName'].setValidators([Validators.required,this.supplierTypeValidator(this.SupplierList)]);
        this.advanceTableForm.controls['supplierName'].updateValueAndValidity();
        this.filteredSupplierOptions = this.advanceTableForm.controls['supplierName'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterSupplier(value || ''))
        ); 
      });
    }
  
    private _filterSupplier(value: string)
    {
      const filterValue = value.toLowerCase();
      return this.SupplierList.filter(
      customer => 
      {
        return customer.supplierName.toLowerCase().includes(filterValue);
      });
    }
    OnSupplierSelect(selectedSupplier: string)
    {
      const SupplierName = this.SupplierList.find(data => data.supplierName === selectedSupplier);
      if (selectedSupplier) 
      {
        this.getSupplierID(SupplierName.supplierID,SupplierName.address,SupplierName.email,SupplierName.phone);
      }
    }
    getSupplierID(supplierID:any,address:any,email:any,phone:any) 
    {
      this.supplierID = supplierID;
      this.address = address;
      this.email = email;
      this.phone = phone;
      this.advanceTableForm.patchValue({supplierID:this.supplierID});
      this.advanceTableForm.patchValue({supplierAddress:this.address});
      this.advanceTableForm.patchValue({supplierEmail:this.email});
      this.advanceTableForm.patchValue({supplierConcernedPersonMobile:this.phone});
    }


  loadData()
  {
    this.passToSupplierService.getData(this.reservationID).subscribe
    (
      data => 
      {
        this.dataSource = data;
        this.advanceTableForm.patchValue({ reservationPassedToSupplierID: this.dataSource?.reservationPassedToSupplierID });
        this.advanceTableForm.patchValue({ reservationID: this.dataSource?.reservationID });
        this.advanceTableForm.patchValue({ supplierID: this.dataSource?.supplierID });
        this.advanceTableForm.patchValue({ supplierName: this.dataSource?.supplierName });
        this.advanceTableForm.patchValue({ supplierAddress: this.dataSource?.supplierAddress });
        this.advanceTableForm.patchValue({ supplierReservationNumber: this.dataSource?.supplierReservationNumber });
        this.advanceTableForm.patchValue({ supplierEmail: this.dataSource?.supplierEmail });
        this.advanceTableForm.patchValue({ supplierConcernedPerson: this.dataSource?.supplierConcernedPerson });
        this.advanceTableForm.patchValue({ supplierConcernedPersonMobile: this.dataSource?.supplierConcernedPersonMobile });
        this.advanceTableForm.patchValue({ activationStatus: this.dataSource?.activationStatus });
      },
      (error: HttpErrorResponse) => { this.dataSource = null; }
    );  
  }
}


