// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { InventoryDocumentService } from '../../inventoryDocument.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { InventoryDocumentModel } from '../../inventoryDocument.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CitiesDropDown } from 'src/app/organizationalEntity/citiesDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { AllCitiesDropDown } from '../../allCitiesDropDown.model';
//import { LicenseVerificationComponent } from '../license-verification/license-verification.component';
import { DocumentDropDown } from 'src/app/general/documentDropDown.model';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import moment from 'moment';
@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogComponent 
{
  dataSource: InventoryDocumentModel[] | null;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: InventoryDocumentModel;
  searchTerm : FormControl = new FormControl();
  searchCityTerm : FormControl = new FormControl();
  searchDocumentNumber: string = '';
  searchDocumentIssuingAuthority: string = '';
  searchAddress: string = '';
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  public DocumentList?: DocumentDropDown[] = [];
  public CityList?: CitiesDropDown[] = [];
  filteredOptions: Observable<CitiesDropDown[]>;

  public CitiesList?: AllCitiesDropDown[] = [];
  filteredCityOptions: Observable<AllCitiesDropDown[]>;

  public EmployeeList?: EmployeeDropDown[]=[];
 saveDisabled:boolean = true;
  image: any;
  fileUploadEl: any;
  addressGeoPointID: any;
  InventoryName: string;
  InventoryID!: number;
  inventoryDocumentService: any;
  searchAddressCity: string = '';
  private pendingDocumentId: number | null = null;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  public dialog: MatDialog,
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: InventoryDocumentService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
    this.InventoryID=data.inventoryID;
    this.InventoryName=data.inventoryName;
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') 
    {
      this.dialogTitle ='Document Details';       
      this.advanceTable = data.advanceTable;
      if (this.advanceTable?.verificationDate) {
        const vd = String(this.advanceTable.verificationDate).split(' ');
        this.advanceTable.verificationDate = vd[0];
      }
      if (this.advanceTable.verified === 'Verified' || this.advanceTable.verified === 'true') {
        this.advanceTable.verifiedData = 'Verified';
      }
      if (this.advanceTable.verified === 'Rejected' || this.advanceTable.verified === 'false') {
        this.advanceTable.verifiedData = 'Rejected';
      }
    }
    else 
    {
      this.dialogTitle = 'Document Details';
      this.advanceTable = new InventoryDocumentModel({});
      this.advanceTable.activationStatus=true;
      this.advanceTable.verifiedData='N/A';
      this.advanceTable.verified='true';
      this.advanceTable.verifiedBy='N/A';
      this.advanceTable.verificationRemark='N/A';
      this.advanceTable.verificationDate=('N/A');
      this.uploadedByName();
    }
    this.advanceTableForm = this.createContactForm();
    if (this.action === 'edit') {
      this.loadEditRecord();
    }
  }

  private fieldValue(row: any, camel: string, pascal: string): any {
    const value = row?.[camel] ?? row?.[pascal];
    return value === undefined || value === null ? '' : value;
  }

  private resolveDocumentId(row: any): number | null {
    const raw = row?.documentID ?? row?.DocumentID;
    if (raw === undefined || raw === null || raw === '') {
      return null;
    }
    const id = Number(raw);
    return Number.isNaN(id) ? null : id;
  }

  private resolveDocumentName(row: any): string {
    return (
      row?.document ??
      row?.Document ??
      row?.documentName ??
      row?.DocumentName ??
      'Document'
    ).toString();
  }

  private ensureDocumentInDropdown(row: any, documentId: number | null): void {
    if (documentId == null) {
      return;
    }
    const list = this.DocumentList ?? [];
    const exists = list.some((item) => Number(item.documentID ?? item.DocumentID) === documentId);
    if (exists) {
      return;
    }
    this.DocumentList = [
      ...list,
      {
        documentID: documentId,
        documentName: this.resolveDocumentName(row),
      },
    ];
  }

  private applyDocumentSelection(row: any, documentId: number | null): void {
    if (documentId == null) {
      return;
    }
    this.ensureDocumentInDropdown(row, documentId);
    this.advanceTableForm.patchValue({ documentID: documentId });
  }

  private bindEditFormValues(row: any): void {
    const documentImage = this.fieldValue(row, 'documentImage', 'DocumentImage');
    this.ImagePath = documentImage || '';

    const documentExpiryRaw = this.fieldValue(row, 'documentExpiry', 'DocumentExpiry');
    const documentStartRaw = this.fieldValue(row, 'documentStartDate', 'DocumentStartDate');
    const documentId = this.resolveDocumentId(row);

    this.advanceTable = row;
    this.searchTerm.setValue(this.fieldValue(row, 'addressCity', 'AddressCity'));

    this.advanceTableForm.patchValue({
      inventoryDocumentID: this.fieldValue(row, 'inventoryDocumentID', 'InventoryDocumentID'),
      inventoryID: this.fieldValue(row, 'inventoryID', 'InventoryID') || this.data.inventoryID,
      documentNumber: this.fieldValue(row, 'documentNumber', 'DocumentNumber'),
      documentIssuingAuthority: this.fieldValue(row, 'documentIssuingAuthority', 'DocumentIssuingAuthority'),
      documentImage,
      documentImageNonAvailabilityReason: this.fieldValue(row, 'documentImageNonAvailabilityReason', 'DocumentImageNonAvailabilityReason'),
      documentExpiry: documentExpiryRaw ? moment(documentExpiryRaw).toDate() : null,
      documentStartDate: documentStartRaw ? moment(documentStartRaw).toDate() : null,
      activationStatus: row.activationStatus ?? row.ActivationStatus,
      addressCityID: row.addressCityID ?? row.AddressCityID,
      address: row.address ?? row.Address,
      addressCity: row.addressCity ?? row.AddressCity,
      pin: row.pin ?? row.Pin,
      verified: row.verified ?? row.Verified,
      verifiedBy: row.verifiedBy ?? row.VerifiedBy,
      verificationRemark: row.verificationRemark ?? row.VerificationRemark,
      verificationDate: row.verificationDate ?? row.VerificationDate,
    });

    if (this.DocumentList?.length) {
      this.applyDocumentSelection(row, documentId);
      this.pendingDocumentId = null;
    } else {
      this.pendingDocumentId = documentId;
    }

    this.syncReasonRequiredValidators();
  }

  private loadEditRecord(): void {
    const id = this.fieldValue(this.advanceTable, 'inventoryDocumentID', 'InventoryDocumentID');
    if (!id) {
      this.bindEditFormValues(this.advanceTable);
      return;
    }
    this.advanceTableService.getById(Number(id)).subscribe(
      (record) => {
        if (record) {
          this.bindEditFormValues(record);
        } else {
          this.bindEditFormValues(this.advanceTable);
        }
      },
      () => {
        this.bindEditFormValues(this.advanceTable);
      }
    );
  }

  public ngOnInit(): void
  {
    this.advanceTableForm.get('documentImage')?.valueChanges.subscribe(() => {
      this.syncReasonRequiredValidators();
    });
    if (this.action !== 'edit') {
      this.syncReasonRequiredValidators();
    }
    this.InitCities();
    this.InitIssuingCity()
    this.intDocument();
  }

  private hasUploadedDocumentImage(): boolean {
    const image = this.advanceTableForm?.get('documentImage')?.value;
    return typeof image === 'string' && image.trim().length > 0;
  }

  private syncReasonRequiredValidators(): void {
    const reasonControl = this.advanceTableForm.get('documentImageNonAvailabilityReason');
    if (!reasonControl) {
      return;
    }
    if (this.hasUploadedDocumentImage()) {
      reasonControl.clearValidators();
    } else {
      reasonControl.setValidators([Validators.required]);
    }
    reasonControl.updateValueAndValidity({ emitEvent: false });
  }

  intDocument()
  {
    this.advanceTableService.GetDocumentForInventory().subscribe(
      (data) => {
        this.DocumentList = (data ?? []).map((item) => ({
          documentID: Number(item.documentID ?? item.DocumentID),
          documentName: item.documentName ?? item.DocumentName ?? '',
        }));
        if (this.pendingDocumentId != null) {
          this.applyDocumentSelection(this.advanceTable, this.pendingDocumentId);
          this.pendingDocumentId = null;
        }
      }
    );
  }
  
  InitCities()
  {
    this._generalService.GetCitiessAll().subscribe(
    data=>
    {
      this.CityList=data;
      // this.advanceTableForm.controls['addressCity'].setValidators([Validators.required,
      //   this.cityTypeValidator(this.CityList)
      // ]);
      // this.advanceTableForm.controls['addressCity'].updateValueAndValidity();
      this.filteredOptions = this.advanceTableForm.controls['addressCity'].valueChanges.pipe(
        startWith(""),
        map(value => this._filter(value || ''))
      ); 
    });
  }

  private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    return this.CityList.filter(
      customer => 
      {
        return customer.geoPointName.toLowerCase().includes(filterValue);
      }
    );
  }

  OnCitySelect(selectedCity: string)
  {
    const CityName = this.CityList.find(
      data => data.geoPointName === selectedCity
    );
    if (selectedCity) 
    {
      this.getTitle(CityName.geoPointID);
    }
  }

  getTitle(geoPointId: any) 
  {
    this.addressGeoPointID=geoPointId;
  }

  cityTypeValidator(CityList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = CityList.some(group => group.geoPointName?.toLowerCase() === value);
      return match ? null : { cityTypeInvalid: true };
    };
  }

  InitIssuingCity()
  {
    this._generalService.GetCitiessAll().subscribe(
    data=>
    {
      this.CitiesList=data;
      this.filteredCityOptions = this.advanceTableForm.controls['addressCity'].valueChanges.pipe(
        startWith(""),
        map(value => this._filtering(value || ''))
      ); 
    });
  }

  private _filtering(value: string): any {
    const filteringValue = value.toLowerCase();
    return this.CitiesList.filter(
      city => 
      {
        return city.geoPointName.toLowerCase().indexOf(filteringValue)===0;
      }
    );
  }

  // getTitles(geoPointId: any) {
  //   this.issuingGeoPointID=geoPointId;
  // }

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
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      inventoryDocumentID: [this.advanceTable.inventoryDocumentID],
      inventoryID: [this.advanceTable.inventoryID],
      documentID: [this.resolveDocumentId(this.advanceTable), Validators.required],
      documentNumber: [this.advanceTable?.documentNumber],
      documentIssuingAuthority: [this.advanceTable?.documentIssuingAuthority],
      documentImage: [this.advanceTable?.documentImage],
      documentImageNonAvailabilityReason: [this.advanceTable?.documentImageNonAvailabilityReason],
      addressCityID: [this.advanceTable?.addressCityID],
      documentStartDate: [this.advanceTable.documentStartDate],
      documentExpiry: [this.advanceTable.documentExpiry, Validators.required],
      activationStatus: [this.advanceTable.activationStatus],
      verifiedData: [this.advanceTable.verifiedData],
      verified: [this.advanceTable.verified],
      verifiedBy: [this.advanceTable.verifiedBy],
      verificationRemark: [this.advanceTable.verificationRemark],
      verificationDate: [this.advanceTable.verificationDate],
      address: [this.advanceTable?.address],
      addressCity: [this.advanceTable.addressCity],
      pin: [this.advanceTable?.pin],
    });
  }

  public noWhitespaceValidator(control: FormControl)
  {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  uploadedByName()
  {
    this._generalService.getEmployeeID(this._generalService.getUserID()).subscribe(
    data=>{
      this.EmployeeList=data;
      this.advanceTableForm.patchValue({uploadedBy:this.EmployeeList[0].firstName+' '+this.EmployeeList[0].lastName});
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

  onNoClick()
  {
    this.dialogRef.close();
  }

  public Post(): void
  {
    this.advanceTableForm.patchValue({addressCityID:this.addressGeoPointID});
    //this.advanceTableForm.patchValue({licenseIssueCityID:this.issuingGeoPointID});
    this.advanceTableForm.patchValue({inventoryID:this.data.inventoryID});
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
      this.dialogRef.close();
      this._generalService.sendUpdate('InventoryDocumentCreate:InventoryDocumentView:Success');//To Send Updates 
      this.saveDisabled = true;
    },
    error =>
    {
      this._generalService.sendUpdate('InventoryDocumentAll:InventoryDocumentView:Failure');//To Send Updates 
      this.saveDisabled = true; 
    })
  }

  public Put(): void
  {
    this.advanceTableForm.patchValue({addressCityID:this.addressGeoPointID || this.advanceTable.addressCityID});
    //this.data.advanceTableForm.patchValue({licenseIssueCityID:this.data.issuingGeoPointID || this.data.advanceTable.licenseIssueCityID});
    this.advanceTableForm.patchValue({inventoryID:this.advanceTable.inventoryID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
      this.dialogRef.close();
      this._generalService.sendUpdate('InventoryDocumentUpdate:InventoryDocumentView:Success');//To Send Updates  
      this.saveDisabled = true; 
    },
    error =>
    {
     this._generalService.sendUpdate('InventoryDocumentAll:InventoryDocumentView:Failure');//To Send Updates 
     this.saveDisabled = true; 
    })
  }

  public confirmAdd(): void {
    this.syncReasonRequiredValidators();
    if (!this.advanceTableForm.valid) {
      return;
    }
    this.saveDisabled = false;
    if (this.action == "edit") 
    {
      // if (this.advanceTable.verified === 'Verified') {
      //   this.licenceVerification();
      // }
      if (this.advanceTable.verified === 'Rejected') 
      {
        this.Put();
      }
      if (this.advanceTable.verified === 'Unverified') 
      {
        this.Put();
      }
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
    this.advanceTableForm.patchValue({documentImage:this.ImagePath});
    this.syncReasonRequiredValidators();
  }

  // licenceVerification()
  // {
  //   const dialogRef = this.dialog.open(LicenseVerificationComponent, 
  //   {
  //     data: 
  //       {
  //         advanceTable: this.advanceTable,
  //         advanceTableForm:this.advanceTableForm,
  //         addressGeoPointID:this.addressGeoPointID,
  //         //issuingGeoPointID:this.issuingGeoPointID,
  //         inventoryID:this.advanceTable.inventoryID,
  //         dialogRefrence:this.dialogRef
  //       }
  //   });
  // }

//start date
onBlurUpdateDate(value: string): void {
  value= this._generalService.resetDateiflessthan12(value);

const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
if (validDate) {
  const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
    this.advanceTableForm.get('documentExpiry')?.setValue(formattedDate);    
} else {
  this.advanceTableForm.get('documentExpiry')?.setErrors({ invalidDate: true });
}
}

onBlurUpdateDateEdit(value: string): void {  
const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
if (validDate) {
  const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
  if(this.action==='edit')
  {
    this.advanceTable.documentExpiry=formattedDate
  }
  else{
    this.advanceTableForm.get('documentExpiry')?.setValue(formattedDate);
  }
  
} else {
  this.advanceTableForm.get('documentExpiry')?.setErrors({ invalidDate: true });
}
}

onBlurUpdateStartDate(value: string): void {
  value = this._generalService.resetDateiflessthan12(value);
  const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
  if (validDate) {
    const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
    this.advanceTableForm.get('documentStartDate')?.setValue(formattedDate);
  } else if (value?.trim()) {
    this.advanceTableForm.get('documentStartDate')?.setErrors({ invalidDate: true });
  } else {
    this.advanceTableForm.get('documentStartDate')?.setValue(null);
    this.advanceTableForm.get('documentStartDate')?.setErrors(null);
  }
}

onBlurUpdateStartDateEdit(value: string): void {
  const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
  if (validDate) {
    const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
    if (this.action === 'edit') {
      this.advanceTable.documentStartDate = formattedDate;
    } else {
      this.advanceTableForm.get('documentStartDate')?.setValue(formattedDate);
    }
  } else if (value?.trim()) {
    this.advanceTableForm.get('documentStartDate')?.setErrors({ invalidDate: true });
  }
}

}



