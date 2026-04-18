// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, Input } from '@angular/core';
import { CustomerPersonDocumentService } from '../../customerPersonDocument.service';
import { FormControl, Validators, FormGroup, FormBuilder, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CustomerPersonDocument } from '../../customerPersonDocument.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
//import { EmployeeDropDown } from 'src/app/general/IEmployees';
import { OrganizationalEntityDropDown } from 'src/app/general/organizationalEntityDropDown.model';
import { DepartmentDropDown } from 'src/app/general/departmentDropDown.model';
import { DesignationDropDown } from 'src/app/general/designationDropDown.model';
import { Observable, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { VehicleDropDown } from 'src/app/vehicle/vehicleDropDown.model';
import { CityDropDown } from 'src/app/city/cityDropDown.model';
import { StateDropDown } from 'src/app/state/stateDropDown.model';
import { map, startWith } from 'rxjs/operators';
import { DocumentDropDown } from 'src/app/document/documentDropDown.model';
import { DocumentVerificationsComponent } from '../document-verification/document-verification.component';
import moment from 'moment';

@Component({
  standalone: false,
    selector: 'app-form-dialog',
    templateUrl: './form-dialog.component.html',
    styleUrls: ['./form-dialog.component.scss'],
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
  })

export class FormDialogComponentHolder {
  employeeID: number;
  action: string;
  dialogTitle: string;
  searchTerm: FormControl = new FormControl();
  searchCategoryBy: FormControl = new FormControl();
  advanceTableForm: FormGroup;
  public EmployeeList?: EmployeeDropDown[] = [];
  public CityList?: CityDropDown[] = [];
  filteredOptions: Observable<CityDropDown[]>;
  filteredCategoryOptions: Observable<CityDropDown[]>;
  public DocumentList?: DocumentDropDown[] = [];
  image: any;
  advanceTable: CustomerPersonDocument;
  applicableFrom: any;
  applicableTo: any;
  customerName: any;
  CustomerID: any;
  addressCityID: any;
  customerPersonName: any;
  CustomerPersonID: any;
  customerPersonID: any;
  documentID: any;
  saveDisabled:boolean = true;
  // DesginationList: import("f:/NewRentnetAdmin/NewRentnetAdmin/RentnetAdmin/src/app/general/designationDropDown.model").DesignationDropDown[];
  constructor(
    public documentVerification: MatDialog,
    public dialogRef: MatDialogRef<FormDialogComponentHolder>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    public advanceTableService: CustomerPersonDocumentService,
    private fb: FormBuilder,
    public _generalService: GeneralService) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
   
      this.dialogTitle = ' Document Details';
      this.advanceTable = data.advanceTable;
      console.log(this.advanceTable)
      this.ImagePath = this.advanceTable.documentImage;
      this.searchTerm.setValue(this.advanceTable.addressCity);
      this.searchCategoryBy.setValue(this.advanceTable.documentName);
      let expiryDate=moment(this.advanceTable.documentExpiry).format('DD/MM/yyyy');
      this.onBlurDocExpiryDateEdit(expiryDate);

      var vd=this.advanceTable.verficationDate.split(' ');
      var re=/\-/gi;
      var verifyDate=vd[0].replace(re,'/');
      this.advanceTable.verficationDate=verifyDate;

      if (this.advanceTable.verified === 'true') {
        this.advanceTable.verifiedData = "Verified"
      }
      if (this.advanceTable.verified === 'false') {
        this.advanceTable.verifiedData = "Rejected"
      }
      
    } else {
      this.dialogTitle = ' Document Details';
      this.advanceTable = new CustomerPersonDocument({});
      this.advanceTable.activationStatus = true;
      this.advanceTable.verifiedData = 'N/A';
      this.advanceTable.verifiedBy = 'N/A';
      this.advanceTable.verfiedRemark = 'N/A';
      this.advanceTable.verficationDate = 'N/A';

    }
    this.advanceTableForm = this.createContactForm();
    this.customerPersonName = data.CustomerPersonName;
    this.customerPersonID = data.CustomerPersonID;

  }

  public ngOnInit(): void {
    this.InitDocument();
    this.InitCities();
  }

  InitCities() {

    this._generalService.GetCitiessAl().subscribe
      (
        data => {
          this.CityList = data;
          this.advanceTableForm.controls['addressCity'].setValidators([Validators.required,
            this.cityValidator(this.CityList)
          ]);
          this.advanceTableForm.controls['addressCity'].updateValueAndValidity();
          this.filteredOptions = this.advanceTableForm.controls['addressCity'].valueChanges.pipe(
            startWith(""),
            map(value => this._filter(value || ''))
          )
        }
      );

  }
 cityValidator(CityList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = CityList.some(group => group.geoPointName.toLowerCase() === value);
      return match ? null : { addressCityInvalid: true };
    };
  }

  documentValidator(DocumentList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = DocumentList.some(group => group.documentName.toLowerCase() === value);
      return match ? null : { documentNameInvalid: true };
    };
  }
  InitDocument() {
    {
      this._generalService.GetDocument().subscribe

        (
          data => {
            this.DocumentList = data;
            this.advanceTableForm.controls['documentName'].setValidators([Validators.required,
              this.documentValidator(this.DocumentList)
            ]);
            this.advanceTableForm.controls['documentName'].updateValueAndValidity();
            this.filteredCategoryOptions =this.advanceTableForm.controls['documentName'].valueChanges.pipe(
              startWith(""),
              map(value => this._filterCategory(value || ''))
            );
          }
        );
    }
  }
  
  private _filterCategory(value: string): any {
    const filterValue = value.toLowerCase();
    return this.DocumentList.filter(
      customer => 
      {
        return customer.documentName.toLowerCase().includes(filterValue);
      }
    );
  }
  OnDocumentSelect(selectedDocument: string)
  {
    const DocumentName = this.DocumentList.find(
      data => data.documentName === selectedDocument
    );
    if (selectedDocument) 
    {
      this.getTitles(DocumentName.documentID);
    }
  }
  
  getTitles(documentID: any) {
    
    this.documentID=documentID;
  }
  getTitle(geoPointId: any) {
   
    this.addressCityID = geoPointId;

  }

  private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    if (!value || value.length < 3)
     {
        return [];   
      }
    return this.CityList.filter(
      customer => {
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

  formControl = new FormControl('',
    [
      Validators.required
      // Validators.email,
    ]);

  getErrorMessage() {
    return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('email')
        ? 'Not a valid email'
        : '';
  }

  createContactForm(): FormGroup {
    return this.fb.group(
      {
        customerPersonDocumentID: [this.advanceTable.customerPersonDocumentID],
        customerPersonID: [this.advanceTable.customerPersonID],
        documentID: [this.advanceTable.documentID,],
        documentNumber: [this.advanceTable.documentNumber],
        documentIssuingAuthority: [this.advanceTable.documentIssuingAuthority],
        documentImage: [this.advanceTable.documentImage,],
        documentImageNonAvailabilityReason: [this.advanceTable.documentImageNonAvailabilityReason,],
        addressCityID: [this.advanceTable.addressCityID],
        addressCity: [this.advanceTable.addressCity],
        address: [this.advanceTable.address],
        pin: [this.advanceTable.pin],
        verifiedData: [this.advanceTable.verifiedData],
        verifiedBy: [this.advanceTable.verifiedBy],
        verfiedRemark: [this.advanceTable.verfiedRemark],
        verficationDate: [this.advanceTable.verficationDate],
        documentExpiry: [this.advanceTable.documentExpiry,[Validators.required, this._generalService.dateValidator()]],
        documentName:[this.advanceTable.documentName],
        activationStatus: [this.advanceTable.activationStatus],
      });
  }

  //expiry date
  onBlurDocExpiryDate(value: string): void {
  value= this._generalService.resetDateiflessthan12(value);    
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm.get('documentExpiry')?.setValue(formattedDate);    
    }
    else
    {
      this.advanceTableForm.get('documentExpiry')?.setErrors({ invalidDate: true });
    }
  }
               
  onBlurDocExpiryDateEdit(value: string): void {  
  const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      if(this.action==='edit')
      {
        this.advanceTable.documentExpiry=formattedDate
      }
      else
      {
        this.advanceTableForm.get('documentExpiry')?.setValue(formattedDate);
      }  
    } 
    else 
    {
      this.advanceTableForm.get('documentExpiry')?.setErrors({ invalidDate: true });
    }
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  submit() {
    // emppty stuff
  }
  reset(){
    this.ImagePath="";
    this.advanceTableForm.reset();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  openDocumentDialog() {
   
    this.documentVerification.open(DocumentVerificationsComponent,
      {
        data:
        {
          advanceTableForm: this.advanceTableForm,
          CustomerPersonID: this.customerPersonID,
          addressCityID: this.addressCityID,
          dialogRef: this.dialogRef,
          action: this.action,
          advanceTable: this.data.advanceTable
        }
      });
  }

  public Post(): void {
    this.advanceTableForm.patchValue({ addressCityID: this.addressCityID });
    this.advanceTableForm.patchValue({ documentID: this.documentID });
    this.advanceTableForm.patchValue({ customerPersonID: this.data.CustomerPersonID });
    this.advanceTableService.add(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.dialogRef.close();

          this._generalService.sendUpdate('CustomerPersonDocumentCreate:CustomerPersonDocumentView:Success');//To Send Updates
          this.saveDisabled = true;  
        },
        error => {
          this._generalService.sendUpdate('CustomerPersonDocumentAll:CustomerPersonDocumentView:Failure');//To Send Updates 
          this.saveDisabled = true; 
        }
      )
  }
  public Put(): void {
    this.advanceTableForm.patchValue({ addressCityID: this.addressCityID || this.advanceTable.addressCityID });
    this.advanceTableForm.patchValue({ documentID: this.documentID || this.advanceTable.documentID });
    this.advanceTableForm.patchValue({ customerPersonID: this.advanceTable.customerPersonID });
    this.advanceTableService.update(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.dialogRef.close();
          this._generalService.sendUpdate('CustomerPersonDocumentUpdate:CustomerPersonDocumentView:Success');//To Send Updates
          this.saveDisabled = true; 

        },
        error => {
          this._generalService.sendUpdate('CustomerPersonDocumentAll:CustomerPersonDocumentView:Failure');//To Send Updates  
          this.saveDisabled = true;
        }
      )
  }
  messageReceived: string;
  MessageArray: string[] = [];
  private subscriptionName: Subscription; //important to create a subscription

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

  /////////////////for Image Upload////////////////////////////
  public response: { dbPath: '' };
  public ImagePath: string = "";

  public uploadFinished = (event) => {
    this.response = event;
    this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({ documentImage: this.ImagePath })
  }
  public confirmAdd(): void {
    this.saveDisabled = false;
    if (this.action == "edit") {

      if (this.advanceTable.verified === 'Verified') {
        this.openDocumentDialog();
      }
      if (this.advanceTable.verified === 'Rejected') {
        this.Put();
      }

    }
    else {
      this.Post();
    }
  }
}



