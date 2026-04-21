// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder, AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { Observable } from 'rxjs';
import { CustomerCustomerGroupDropDown } from 'src/app/customer/customerCustomerGroupDropDown.model';
import { map, startWith } from 'rxjs/operators';
import { ChangeVendorModel, InventoryDropDown } from 'src/app/changeVendor/changeVendor.model';
import { ChangeVendorService } from 'src/app/changeVendor/changeVendor.service';
import { GeneralService } from 'src/app/general/general.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerPersonDropDown } from 'src/app/customerPerson/customerPersonDropDown.model';
import { SupplierDropDownModel } from 'src/app/passToSupplier/passToSupplier.model';
import { PassToSupplierService } from 'src/app/passToSupplier/passToSupplier.service';
import Swal from 'sweetalert2';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class ChangeVendorFormDialogComponent 
{
  showError?:string;
  action?:string;
  dialogTitle:string;
  advanceTableForm:FormGroup;
  advanceTable?:ChangeVendorModel;
  saveDisabled:boolean=true;

  public VendorList?:SupplierDropDownModel[] = [];
  filteredVendorOptions?:Observable<SupplierDropDownModel[]>;
  VendorID:any;  

  public InventoryList?:InventoryDropDown[] = [];
  filteredInventoryOptions?:Observable<InventoryDropDown[]>;
  InventoryID:any;

  ReservationID:any;

    constructor(
      public dialogRef: MatDialogRef<ChangeVendorFormDialogComponent>, 
      @Inject(MAT_DIALOG_DATA) public data:any,
      public advanceTableService:ChangeVendorService,
      private fb:FormBuilder,
      public _generalService:GeneralService,
      private snackBar:MatSnackBar,
      public passToSupplierService:PassToSupplierService)
    {
      // Set the defaults
      this.dialogTitle = 'Change Vendor';
      this.ReservationID = data?.advanceTable;
      this.advanceTableForm = this.createContactForm();
    }

    public ngOnInit(): void
    {
      this.InitVendor();
    }
  
    createContactForm(): FormGroup 
    {
      return this.fb.group(
      {
        //reservationChangeLogID:[this.advanceTable?.reservationChangeLogID],
        reservationID:[this.ReservationID],
        changeType:['Vendor'],
        newRecordID:[this.advanceTable?.newRecordID],
        newRecordName:[this.advanceTable?.newRecordName],
        reason:[this.advanceTable?.reason || ''],
        inventoryID:[this.advanceTable?.inventoryID || ''],
        inventory:[this.advanceTable?.inventory || ''],
      });
    }


    submit(){}
  
    showNotification(colorName: any, text: string, placementFrom: any, placementAlign: any) 
    {
      this.snackBar.open(text, '', {
        duration: 2000,
        verticalPosition: placementFrom,
        horizontalPosition: placementAlign,
        panelClass: colorName
      });
    }

    public Post(): void
    {    
      this.saveDisabled = false;
      this.advanceTableService.add(this.advanceTableForm.getRawValue()).subscribe(
      response => 
      {
        if (response && response?.message === "Data not found") 
        {
          Swal.fire({
            icon: 'error',
            title: 'Data Not Found',
            text: 'The requested inventory data was not found!',
            confirmButtonText: 'OK',
            customClass: {
                    container: 'swal2-popup-high-zindex'
                  }
          });
          this.saveDisabled = true;
          return;
        }
        this.dialogRef.close();
        this.showNotification(
          'snackbar-success',
          'Vendor Changed Successfully...!!!',
          'bottom',
          'center'
        );
        this.dialogRef.close(true); 
        this.saveDisabled = true;        
      },
      error =>
      {
       this.showNotification(
          'snackbar-danger',
          'Operation Failed...!!!',
          'bottom',
          'center'
        );
        this.saveDisabled = true; 
      })
    }
  
    //---------- Vendor ----------
    InitVendor()
    {
      this.passToSupplierService.getSupplier().subscribe(
      data=>
      {
        this.VendorList=data;
        this.advanceTableForm.controls['newRecordName'].setValidators([Validators.required,this.VendorValidator(this.VendorList)]);
        this.advanceTableForm.controls['newRecordName'].updateValueAndValidity();
        this.filteredVendorOptions = this.advanceTableForm.controls['newRecordName'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterVendor(value || ''))
        ); 
      });
    }

    private _filterVendor(value: string)
    {
      if (!value || value.length < 3) 
      {
        return [];
      }
      const filterValue = value.toLowerCase();
      return this.VendorList?.filter(
      data => 
      {
        return data.supplierName.toLowerCase().includes(filterValue);
      });
    }

    VendorValidator(VendorList: any[]): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value?.toLowerCase();
        const match = VendorList.some(group => group.supplierName.toLowerCase() === value);
        return match ? null : { vendorNameInvalid: true };
      };
    } 
    OnVendorSelect(selectedVendor: string)
    {
      const VendorName = this.VendorList?.find(data => data.supplierName === selectedVendor);
      if (selectedVendor) 
      {
        this.getVendorID(VendorName?.supplierID);
      }
    }
    getVendorID(VendorID:any)
    {
      this.VendorID=VendorID;
      this.advanceTableForm.patchValue({newRecordID:this.VendorID});      
      this.InitInventory();
    }
      

    //---------- Inventory ----------
    InitInventory()
    {
      this.advanceTableService.getInventory(this.VendorID).subscribe(
      data=>
      {
        this.InventoryList=data;
        this.advanceTableForm.controls['inventory'].setValidators([Validators.required,this.InventoryValidator(this.InventoryList)]);
        this.advanceTableForm.controls['inventory'].updateValueAndValidity();
        this.filteredInventoryOptions = this.advanceTableForm.controls['inventory'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterInventory(value || ''))
        ); 
      });
    }
    private _filterInventory(value: string)
    {
      if (!value || value.length < 3) 
      {
        return [];
      }
      const filterValue = value.toLowerCase();
      return this.InventoryList?.filter(
      data => 
      {
        return data.inventory.toLowerCase().includes(filterValue);
      });
    }
    InventoryValidator(InventoryList: any[]): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value?.toLowerCase();
        const match = InventoryList?.some(group => group.inventory.toLowerCase().trim() === value);
        return match ? null : { inventoryNameInvalid: true };
      };
    }
    OnInventorySelect(selectedInventory: string)
    {
      const InventoryName = this.InventoryList?.find(
        data => data.inventory === selectedInventory
      );
      if (selectedInventory) 
      {
        this.getInventoryID(InventoryName?.inventoryID);
      }
    }
    getInventoryID(InventoryID:any)
    {
      this.InventoryID=InventoryID;
      this.advanceTableForm.patchValue({inventoryID:this.InventoryID});
    }




}


