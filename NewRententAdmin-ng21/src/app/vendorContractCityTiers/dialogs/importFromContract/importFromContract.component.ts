// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { VendorContractCityTiersService } from '../../vendorContractCityTiers.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { VendorContractCityTiersModel } from '../../vendorContractCityTiers.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import { QualificationDropDown } from 'src/app/general/qualificationDropDown.model';
import { CitiesDropDown } from 'src/app/organizationalEntity/citiesDropDown.model';
import { SupplierRateCardDropDown } from 'src/app/supplierRateCard/supplierRateCardDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationDialogComponent } from 'src/app/vendorContractCarCategory/dialogs/confirmation-dialog/confirmation-dialog.component';
import { CityTierDropDown } from 'src/app/cityTier/cityTierDropDown.model';
import { VendorContractCarCategoryService } from 'src/app/vendorContractCarCategory/vendorContractCarCategory.service';
import { VendorCategoryDropDownModel, VendorContractDropDownModel } from 'src/app/vendorContractCarCategory/vendorContractCarCategory.model';
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
  advanceTableFormData: VendorContractCityTiersModel[] = [];
  advanceTable: any;
  fName = '';
  contents: any[];
  mydata = [];
  name = '';
 
  public vendorCategoryList?: VendorCategoryDropDownModel[] = [];
  public VendorList?: VendorContractDropDownModel[] = [];
  filteredOptions: Observable<VendorContractDropDownModel[]>;

  image: any;
  fileUploadEl: any;
  VendorContractID!: number;
  VendorContractName!: string;
  saveDisabled:boolean = true;
  vendorContractID: any;
  public cityTiersList?: VendorContractCityTiersModel[]=[]; 
  constructor(
  public dialogRef: MatDialogRef<ImportFromContractComponent>, 
  
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: VendorContractCityTiersService,
    private fb: FormBuilder,
    private el: ElementRef,
     public dialog: MatDialog,
        public route:ActivatedRoute,
  public _generalService:GeneralService,
public vendorContractCarCategoryService: VendorContractCarCategoryService)
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
      this.advanceTable = new VendorContractCityTiersModel({});
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
      }
    )    
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      vendorContractID: [this.advanceTable.vendorContractID],
      vendorContractName: [this.advanceTable.vendorContractName],
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

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}

 onImportClick() {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: {
          message: 'Are you sure you want to import All Tiers And City categories?'
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // User clicked Yes - Proceed with import
           // Show spinner
           this.saveDisabled = false;
          this.getCityTier();  // Fetch the vehicle categories
        } else {
          // User clicked No - Do nothing
          console.log('Import canceled');
        }
      });
    }

  getCityTier()
  {
    this.advanceTableService.GetToImportFormContractCityTiers(this.vendorContractID).subscribe(
      data =>
      {
        this.cityTiersList=data;
        this.advanceTableFormData = this.cityTiersList.map(cityTiers => 
          new VendorContractCityTiersModel({
            vendorContractCityTiersID: -1, 
            vendorContractID: this.VendorContractID,
            vendorContractCityTier: cityTiers.vendorContractCityTier,
            activationStatus: true,
            userID: this._generalService.getUserID(),
            cityTierID:cityTiers.vendorContractCityTiersID
          })
        );
        console.log(this.advanceTableFormData);
        this.saveVendorContractCityTiers()
      }
    );
  }
  saveVendorContractCityTiers() {
    this.advanceTableService.ImportFromVendorContract(this.advanceTableFormData).subscribe(
      response => {
        if (response && response.activationStatus && typeof response.activationStatus === 'string' && response.activationStatus.includes("Duplicate")) {
          this._generalService.sendUpdate('DataNotFound:DuplicacyError:Failure');
          this.saveDisabled = true;
          
      } else {
          this._generalService.sendUpdate('VendorContractCityTiersCreate:VendorContractCityTiersView:Success');
          this.saveDisabled = true;
         this.dialogRef.close();  // Close the dialog on successful save
      }
         
      },
      error => {
          console.error('Error saving vendor contract city tier', error);
          this._generalService.sendUpdate('VendorContractCityTiersAll:VendorContractCityTiersView:Failure');
          this.saveDisabled = true;
          // Hide spinner in case of error
      }
  );
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
    this.advanceTableForm.patchValue({ vendorContractID:this.data.vendorContractID });
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
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
    }
  )
  }
  public Put(): void
  {
    //this.advanceTableForm.patchValue({ vendorContractID:this.advanceTable.vendorContractID });
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
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
  
  /////////////////for Image Upload////////////////////////////
  public response: { dbPath: '' };
  public ImagePath: string = "";
  
  public uploadFinished = (event) => 
  {
    this.response = event;
    this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({image:this.ImagePath})
  }

  // public fileChanged(event?: UIEvent): void {
  //   const files: FileList = this.fileUploadEl.nativeElement.files;

  //   const file = files[0];
  //   const reader = new FileReader();
  //   const loaded = (el) => {
  //     const contents = el.target.result;
  //     this.contents = contents;
  //   }
  //   reader.onload = loaded;
  //   reader.readAsText(file, 'UTF-8');
  //   this.name = file.name;
  // }

  // onSelectFile(event) {
  //   const files = event.target.files;
  //   if (files) {
  //     for (const file of files) {
  //       const reader = new FileReader();
  //       reader.onload = (e: any) => {
  //         if (file.type.indexOf('image') > -1) {
  //           this.mydata.push({
  //             url: e.target.result,
  //             type: 'img',
  //           });
  //         } else if (file.type.indexOf('video') > -1) {
  //           this.mydata.push({
  //             url: e.target.result,
  //             type: 'video',
  //           });
  //         } else if (file.type.indexOf('pdf') > -1) {
  //           this.mydata.push({
  //             url: e.target.result,
  //             type: 'pdf',
  //           });
  //         }
  //       };
  //       reader.readAsDataURL(file);
  //     }
  //   }
  // }

/////////////////for Image Upload ends////////////////////////////

// Only Numbers with Decimals
// keyPressNumbersDecimal(event) {
//   var charCode = (event.which) ? event.which : event.keyCode;
//   if (charCode != 46 && charCode > 31
//     && (charCode < 48 || charCode > 57)) {
//     event.preventDefault();
//     return false;
//   }
//   return true;
// }

// Only AlphaNumeric
// keyPressAlphaNumeric(event) {

//   var inp = String.fromCharCode(event.keyCode);

//   if (/[a-zA-Z]/.vendorContractCityTiers(inp)) {
//     return true;
//   } else {
//     event.preventDefault();
//     return false;
//   }
// }

}


