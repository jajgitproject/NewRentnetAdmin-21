// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';

import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';

import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import { QualificationDropDown } from 'src/app/general/qualificationDropDown.model';
import { CitiesDropDown } from 'src/app/organizationalEntity/citiesDropDown.model';
import { SupplierRateCardDropDown } from 'src/app/supplierRateCard/supplierRateCardDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { VendorContractCarCategoryService } from '../../vendorContractCarCategory.service';
import { VendorCategoryDropDownModel, VendorContractCarCategoryModel, VendorContractDropDownModel } from '../../vendorContractCarCategory.model';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { VehicleCategoryDropDown } from 'src/app/general/vehicleCategoryDropDown.model';
@Component({
  standalone: false,
  selector: 'app-importFromContract',
  templateUrl: './importFromContract.component.html',
  styleUrls: ['./importFromContract.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class ImportFromContractComponent 
{
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: any;
  fName = '';
  contents: any[];
  mydata = [];
  name = '';
  isLoading = false;
  public vendorCategoryList?: VendorCategoryDropDownModel[] = [];
  public VendorList?: VendorContractDropDownModel[] = [];
  filteredOptions: Observable<VendorContractDropDownModel[]>;
    vehicleCategoryList: VendorContractCarCategoryModel[] | null;
     advanceTableFormData: VendorContractCarCategoryModel[] = [];

  image: any;
  fileUploadEl: any;
  VendorContractID!: number;
  VendorContractName!: string;
  saveDisabled:boolean = true;
  vendorContractID: any;
  constructor(
  public dialogRef: MatDialogRef<ImportFromContractComponent>, 
  
  @Inject(MAT_DIALOG_DATA) public data: any,
  public vendorContractCarCategoryService: VendorContractCarCategoryService,
    private fb: FormBuilder,
    private el: ElementRef,
    public dialog: MatDialog,
  public _generalService:GeneralService)
  {
    this.VendorContractID= data.vendorContractID,
        this.VendorContractName =data.vendorContractName,
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') 
    {
      this.dialogTitle ='Import From Vendor Contract';       
      this.advanceTable = data.advanceTable;
    } else 
    {
      this.dialogTitle = 'Import From Vendor Contract';
      this.advanceTable = new VendorContractCarCategoryModel({});
      this.advanceTable.activationStatus=true;
      //this.advanceTable.supplierName=data.SUPPLIERNAME;
    }
      this.advanceTableForm = this.createContactForm();
  }
  public ngOnInit(): void
  {
    this.InitVendorCategory();
    this.InitVendorContract();
    
  }

  onNoClick(action: string) {
    if(action === 'add') {
      this.advanceTableForm.reset();
    } else {
      this.dialogRef.close();
    }
  }
  formControl = new FormControl('', 
  [
    Validators.required
    // Validators.email,
  ]);
  getErrorMessage() 
  {
      return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('email')
      ? 'Not a valid email'
      : '';
  }

  InitVendorCategory()
  {
    this.vendorContractCarCategoryService.getVendorCategory().subscribe(
      data=>{
        this.vendorCategoryList=data;
        console.log(this.vendorCategoryList)
      }
    );
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      vendorContractCarCategoryID: [this.advanceTable.vendorContractCarCategoryID],
      vendorContractID: [this.advanceTable.vendorContractID],
      vendorContractName: [this.advanceTable.vendorContractCarCategory],
      activationStatus: [this.advanceTable.activationStatus]
    });
  }

   //------------- Contract --------------
    InitVendorContract()
    {
      this.vendorContractCarCategoryService.GetVendorContract().subscribe
      (
        data =>   
        {
          this.VendorList = data; 
          console.log(this.VendorList)
          this.filteredOptions = this.advanceTableForm.controls['vendorContractName'].valueChanges.pipe(
            startWith(""),
            map(value => this._filter(value || ''))
          );      
        }
       
      );
    }
    private _filter(value: any): any {
      const filterValue = value.toLowerCase();
      if (!value || value.length < 1) {
        return [];   
      }
      return this.VendorList.filter(
        data =>
        {
          return data.vendorContractName.toLowerCase().includes(filterValue);
        });
    }
    OnVendorContractNameSelect(selectedVendorContract: string)
    {
      const VendorContractName = this.VendorList.find(
        data => data.vendorContractName === selectedVendorContract
      );
      if (selectedVendorContract) 
      {
        this.GetVendorContractID(VendorContractName.vendorContractID);
      }
    }
    GetVendorContractID(vendorContractID :any)
    {
      this.vendorContractID=vendorContractID;
    }

      
    onImportClick() 
    {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: {
          message: 'Are you sure you want to import vehicle categories?'
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) 
        {
          // User clicked Yes - Proceed with import
          this.saveDisabled = false;  // Show spinner
          this.getVehicleCategory();  // Fetch the vehicle categories
        } 
        else 
        {
          // User clicked No - Do nothing
          console.log('Import canceled');
        }
      });
    }

      // Fetch vehicle categories from the service
    getVehicleCategory() 
    {
      this.vendorContractCarCategoryService.GetVehicleCategoryToImportFormContractCarCategory(this.vendorContractID).subscribe(
        data => {
            this.vehicleCategoryList = data;
            console.log((this.vehicleCategoryList))
            this.advanceTableFormData = this.vehicleCategoryList.map(vehicleCategory => 
              new VendorContractCarCategoryModel({
                      vendorContractCarCategoryID: -1, 
                      vendorContractID: this.VendorContractID,
                      vendorContractCarCategory: vehicleCategory.vendorContractCarCategory,
                      activationStatus: true,
                      userID: this._generalService.getUserID(),
                      vehicleCategoryID: vehicleCategory.vendorContractCarCategoryID
                    })
                  );                
                // Save the vendor contract car category once the categories are fetched
                this.saveVendorContractCarCategory();
            },
            error => {
                console.error('Error fetching vehicle categories', error);
                this.isLoading = false;  // Hide spinner in case of error
            }
        );
    }

  // Save the vendor contract car category
    saveVendorContractCarCategory() 
    {
      this.vendorContractCarCategoryService.ImportFromVendorContract(this.advanceTableFormData).subscribe(
      response => {
        if (response && response.activationStatus && typeof response.activationStatus === 'string' && response.activationStatus.includes("Duplicate")) 
        {
          this._generalService.sendUpdate('DataNotFound:DuplicacyError:Failure');
          this.saveDisabled = true;
        } 
        else 
        {
          this.dialogRef.close();
          this._generalService.sendUpdate('VendorContractCarCategoryCreate:VendorContractCarCategoryView:Success');
          this.saveDisabled = true;
        }      
      },
      error => {
          this._generalService.sendUpdate('VendorContractCarCategoryAll:VendorContractCarCategoryView:Failure');  // Hide spinner in case of error
          this.saveDisabled = true
          }
      );
    }


  public noWhitespaceValidator(control: FormControl) 
  {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  submit() 
  {
    // emppty stuff
  }

  reset(): void 
  {
    this.advanceTableForm.reset();
  }

  public Post(): void
  {
    this.advanceTableForm.patchValue({vendorContractID:this.data.vendorContractID});
    this.vendorContractCarCategoryService.add(this.advanceTableForm.getRawValue()).subscribe(
    response => 
    {
      this.dialogRef.close();
      this._generalService.sendUpdate('VendorContractCityTiersCreate:VendorContractCityTiersView:Success');//To Send Updates  
      this.saveDisabled = true;
    },
    error =>
    {
      this._generalService.sendUpdate('VendorContractCityTiersAll:VendorContractCityTiersView:Failure');//To Send Updates  
      this.saveDisabled = true;
    })
  }


  public Put(): void
  {
    //this.advanceTableForm.patchValue({ vendorContractID:this.advanceTable.vendorContractID });
    this.vendorContractCarCategoryService.update(this.advanceTableForm.getRawValue()).subscribe(
    response => 
    {
      this.dialogRef.close();
      this._generalService.sendUpdate('VendorContractCityTiersUpdate:VendorContractCityTiersView:Success');//To Send Updates  
      this.saveDisabled = true;
    },
    error =>
    {
     this._generalService.sendUpdate('VendorContractCityTiersAll:VendorContractCityTiersView:Failure');//To Send Updates  
     this.saveDisabled = true;
    })
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


