// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { SupplierContractCustomerCityPercentageService } from '../../supplierContractCustomerCityPercentage.service';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { SupplierContractCustomerCityPercentage } from '../../supplierContractCustomerCityPercentage.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CustomerDropDown } from 'src/app/supplierCustomerFixedForAllPercentage/customerDropDown.model';
import { CitiesDropDown } from 'src/app/organizationalEntity/citiesDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import moment from 'moment';

@Component({
  standalone: false,
    selector: 'app-form-dialog',
    templateUrl: './form-dialog.component.html',
    styleUrls: ['./form-dialog.component.sass'],
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
  })

export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: SupplierContractCustomerCityPercentage;
  fName = '';
  contents: any[];
  mydata = [];
  name = '';
  isLoading: boolean = false;

  public CityList?: CitiesDropDown[] = [];
  public CustomerList?: CustomerDropDown[] = [];
  searchCity: FormControl = new FormControl();
  filteredCityOptions: Observable<CitiesDropDown[]>;
  searchCustomer: FormControl = new FormControl();
  filteredCustomerOptions: Observable<CustomerDropDown[]>;

  image: any;
  fileUploadEl: any;
  applicableFrom: any;
  applicableTo: any;
  supplierName: any;
  cityID: any;
  customerID: any;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,

    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: SupplierContractCustomerCityPercentageService,
    private fb: FormBuilder,
    private el: ElementRef,
    public _generalService: GeneralService) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = 'Customer Wise City Percentage For';
      this.advanceTable = data.advanceTable;
      this.searchCity.setValue(this.advanceTable.city);
      this.searchCustomer.setValue(this.advanceTable.customerName);
      let fromDate = moment(this.advanceTable.fromDate).format('DD/MM/yyyy');
      let toDate = moment(this.advanceTable.toDate).format('DD/MM/yyyy');
      this.onBlurUpdateDateFromEdit(fromDate);
      this.onBlurUpdateDateToEdit(toDate);
    } else {
      this.dialogTitle = 'Customer Wise City Percentage For';
      this.advanceTable = new SupplierContractCustomerCityPercentage({});
      this.advanceTable.activationStatus = true;
    }
    this.advanceTableForm = this.createContactForm();
    this.applicableFrom = data.ApplicableFrom;
    this.applicableTo = data.ApplicableTo;
    this.supplierName = data.SupplierName;
  }
  public ngOnInit(): void {
    this.InitCustomer();
    this.InitCities();
  }

  // InitCustomer(){
  //   this._generalService.GetCustomers().subscribe(
  //     data=>{
  //       this.CustomerList=data;
  //     }
  //   )
  // }

  // InitCities(){
  //   this._generalService.GetCitiessAll().subscribe(
  //     data=>
  //     {
  //       this.CityList=data;
  //     });
  // }


  //----------- Customer Name Validation --------------
  customerNameValidator(CustomerList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = CustomerList.some(employee => employee.customerName.toLowerCase() === value);
      return match ? null : { customerNameInvalid: true };
    };
  }

  InitCustomer() {
    this._generalService.GetCustomers().subscribe(
      data => {
        this.CustomerList = data;
        this.advanceTableForm.controls['customerName'].setValidators([Validators.required,
        this.customerNameValidator(this.CustomerList)]);
        this.advanceTableForm.controls['customerName'].updateValueAndValidity();
        this.filteredCustomerOptions = this.advanceTableForm.controls['customerName'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterCustomer(value || ''))
        );
      },
      error => { }
    );
  }
  private _filterCustomer(value: string): any {
    const filterValue = value.toLowerCase();
    // Only show results if 3 or more characters are typed
    if (filterValue.length < 3) {
      return [];
    }
    return this.CustomerList.filter(
      customer => {
        return customer.customerName.toLowerCase().includes(filterValue);
      }
    );
  }
  onCustomerSelected(selectedCustomer: string) {
    const selectedValue = this.CustomerList.find(
      data => data.customerName === selectedCustomer
    );

    if (selectedValue) {
      this.getTitles(selectedValue.customerID);
    }
  }

  getTitles(customerID: any) {
    this.customerID = customerID;
  }

  //----------- City Tier Validation --------------
  cityTierValidator(CityList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = CityList.some(employee => employee.geoPointName.toLowerCase() === value);
      return match ? null : { cityInvalid: true };
    };
  }

  InitCities() {
    this._generalService.GetCitiessAll().subscribe(
      data => {
        this.CityList = data;
        this.advanceTableForm.controls['city'].setValidators([Validators.required,
        this.cityTierValidator(this.CityList)]);
        this.advanceTableForm.controls['city'].updateValueAndValidity();
        this.filteredCityOptions = this.advanceTableForm.controls['city'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterCity(value || ''))
        );
      },
      error => { }
    );
  }
  private _filterCity(value: string): any {
    const filterValue = value.toLowerCase();
    // Only show results if 3 or more characters are typed
    if (filterValue.length < 3) {
      return [];
    }
    return this.CityList.filter(
      customer => {
        return customer.geoPointName.toLowerCase().includes(filterValue);
      }
    );
  }
  onCitySelected(selectedCityName: string) {
    const selectedCity = this.CityList.find(
      city => city.geoPointName === selectedCityName
    );

    if (selectedCity) {
      this.getTitlesID(selectedCity.geoPointID);
    }
  }

  getTitlesID(geoPointID: any) {
    this.cityID = geoPointID;
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
        supplierContractCustomerCityPercentageID: [this.advanceTable.supplierContractCustomerCityPercentageID],
        supplierContractID: [this.advanceTable.supplierContractID],
        cityID: [this.advanceTable.cityID],
        city: [this.advanceTable.city],
        customerID: [this.advanceTable.customerID],
        customerName: [this.advanceTable.customerName],
        fromDate: [this.advanceTable.fromDate, [Validators.required, this._generalService.dateValidator()]],
        toDate: [this.advanceTable.toDate, [Validators.required, this._generalService.dateValidator()]],
        supplierPercentage: [this.advanceTable.supplierPercentage],
        activationStatus: [this.advanceTable.activationStatus]
      });
  }

   //start date
        onBlurUpdateDateFrom(value: string): void {
            value= this._generalService.resetDateiflessthan12(value);
          
          const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
          if (validDate) {
            const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
              this.advanceTableForm.get('fromDate')?.setValue(formattedDate);    
          } else {
            this.advanceTableForm.get('fromDate')?.setErrors({ invalidDate: true });
          }
        }
        
        
        onBlurUpdateDateFromEdit(value: string): void {  
          const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
          if (validDate) {
            const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
            if(this.action==='edit')
            {
              this.advanceTable.fromDate=formattedDate
            }
            else{
              this.advanceTableForm.get('fromDate')?.setValue(formattedDate);
            }
            
          } else {
            this.advanceTableForm.get('fromDate')?.setErrors({ invalidDate: true });
          }
        }
        
        
        //end date
        onBlurUpdateDateTo(value: string): void {
          value= this._generalService.resetDateiflessthan12(value);
        
        const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
        if (validDate) {
          const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
            this.advanceTableForm.get('toDate')?.setValue(formattedDate);    
        } else {
          this.advanceTableForm.get('toDate')?.setErrors({ invalidDate: true });
        }
        }
        
        onBlurUpdateDateToEdit(value: string): void {  
        const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
        if (validDate) {
          const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
          if(this.action==='edit')
          {
            this.advanceTable.toDate=formattedDate
          }
          else{
            this.advanceTableForm.get('toDate')?.setValue(formattedDate);
          }
          
        } else {
          this.advanceTableForm.get('toDate')?.setErrors({ invalidDate: true });
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
  reset(): void {
    this.advanceTableForm.reset();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public Post(): void {
    this.isLoading = true;

    this.advanceTableForm.patchValue({ supplierContractID: this.data.SupplierContractID });
    this.advanceTableForm.patchValue({ cityID: this.cityID });
    this.advanceTableForm.patchValue({ customerID: this.customerID });
    this.advanceTableService.add(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.isLoading = false;
          this.dialogRef.close();
          this._generalService.sendUpdate('SupplierContractCustomerCityPercentageCreate:SupplierContractCustomerCityPercentageView:Success');//To Send Updates  

        },
        error => {
          this.isLoading = false;
          this._generalService.sendUpdate('SupplierContractCustomerCityPercentageAll:SupplierContractCustomerCityPercentageView:Failure');//To Send Updates  
        }
      )
  }
  public Put(): void {
    this.isLoading = true;
    this.advanceTableForm.patchValue({ supplierContractID: this.advanceTable.supplierContractID });
    this.advanceTableForm.patchValue({ cityID: this.cityID || this.advanceTable.cityID });
    this.advanceTableForm.patchValue({ customerID: this.customerID || this.advanceTable.customerID });
    this.advanceTableService.update(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.isLoading = false;
          this.dialogRef.close();
          this._generalService.sendUpdate('SupplierContractCustomerCityPercentageUpdate:SupplierContractCustomerCityPercentageView:Success');//To Send Updates  

        },
        error => {
          this.isLoading = false;
          this._generalService.sendUpdate('SupplierContractCustomerCityPercentageAll:SupplierContractCustomerCityPercentageView:Failure');//To Send Updates  
        }
      )
  }
  public confirmAdd(): void {
    if (this.action == "edit") {
      this.Put();
    }
    else {
      this.Post();
    }
  }

  keyPressNumbersDecimal(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  /////////////////for Image Upload////////////////////////////
  public response: { dbPath: '' };
  public ImagePath: string = "";

  public uploadFinished = (event) => {
    this.response = event;
    this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({ image: this.ImagePath })
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

  //   if (/[a-zA-Z]/.supplierContractCustomerCityPercentage(inp)) {
  //     return true;
  //   } else {
  //     event.preventDefault();
  //     return false;
  //   }
  // }

}



