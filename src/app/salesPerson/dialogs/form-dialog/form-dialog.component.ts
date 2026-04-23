// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, Inject } from '@angular/core';
import { SalesPersonService } from '../../salesPerson.service';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { ReservationSalesPersonModel } from '../../salesPerson.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ExpenseDropDown } from '../../expenseDropDown.model';
import { UomDropDown } from 'src/app/uom/uomDropDown.model';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { MatAutocomplete } from '@angular/material/autocomplete';

@Component({
  standalone: false,
    selector: 'app-form-dialog',
    templateUrl: './form-dialog.component.html',
    styleUrls: ['./form-dialog.component.sass'],
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
  })

export class RSPFormDialogComponent {
  saveDisabled: boolean = true;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: ReservationSalesPersonModel;
  fName = '';
  contents: any[];
  mydata = [];
  name = '';

  public EmployeeList?: EmployeeDropDown[] = [];
  filteredSalesPersonOption: Observable<EmployeeDropDown[]>;
  image: any;
  fileUploadEl: any;
  employeesID: any;
  constructor(
    public dialogRef: MatDialogRef<RSPFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: SalesPersonService,
    private fb: FormBuilder,
    private el: ElementRef,
    public _generalService: GeneralService) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = 'Sales Person';
      this.advanceTable = data.advanceTable;

    } else {
      this.dialogTitle = 'Sales Person';
      this.advanceTable = new ReservationSalesPersonModel({});
      this.advanceTable.activationStatus = true;
    }
    this.advanceTableForm = this.createContactForm();
  }
  public ngOnInit(): void {
    this.InitEmployees();
    this.advanceTableForm.patchValue({ reservationID: this.data.reservationID });
  }

  InitEmployees() {

    this._generalService.GetEmployeesForVehicleCategory().subscribe(
      data => {
        this.EmployeeList = data;
        this.filteredSalesPersonOption = this.advanceTableForm.controls['salesPerson'].valueChanges.pipe(
          startWith(""),
          map(value => this._filtersearchinstructed(value || ''))
        );
      });
  }

  private _filtersearchinstructed(value: string): any {
    const filterValue = value.toLowerCase();
    return this.EmployeeList.filter(
      customer => {
        return customer.firstName.toLowerCase().includes(filterValue);
      }
    );
  }

  OnSalesPersonSelect(selectedSalesPerson: string) {
    const SalesPersonName = this.EmployeeList.find(
      data => `${data.firstName} ${data.lastName}` === selectedSalesPerson
    );
    if (selectedSalesPerson) {
      this.getemployeeIDTitles(SalesPersonName.employeeID);
    }
  }

  getemployeeIDTitles(employeeID: any) {
    this.employeesID = employeeID;
    this.advanceTableForm.patchValue({ salesPersonID: this.employeesID });
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
        reservationSalesPersonID: [this.advanceTable.reservationSalesPersonID],
        reservationID: [this.advanceTable.reservationID],
        salesPersonID: [this.advanceTable.salesPersonID],
        salesPerson: [this.advanceTable.salesPerson],
        activationStatus: [this.advanceTable.activationStatus]

      });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public Post(): void {
    this.advanceTableService.addSalesPerson(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.saveDisabled = true;
          this.dialogRef.close(true);
          //this._generalService.sendUpdate('CityGroupCreate:CityGroupView:Success');//To Send Updates  

        },
        error => {
          this.saveDisabled = true;
          //this._generalService.sendUpdate('CityGroupAll:CityGroupView:Failure');//To Send Updates  
        }
      )
  }
  public Put(): void {

    this.advanceTableService.updateSalesPerson(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.saveDisabled = true;
          this.dialogRef.close(true);
          //this._generalService.sendUpdate('CityGroupUpdate:CityGroupView:Success');//To Send Updates  

        },
        error => {
          this.saveDisabled = true;
          //this._generalService.sendUpdate('CityGroupAll:CityGroupView:Failure');//To Send Updates  
        }
      )
  }
  public confirmAdd(): void {
    this.saveDisabled = false;
    if (this.action == "edit") {
      this.Put();
    }
    else {
      this.Post();
    }
  }
  // OnCityGroupChangeGetcurrencies()
  // {
  //   this._generalService.GetCurrencies(this.advanceTableForm.get("nativeCurrencyID").value).subscribe(
  //     data =>
  //      {
  //       this.CurrencyList = data;
  //      },
  //      error =>
  //      {
  //      }
  //   );
  // }

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
  keyPressNumbersDecimal(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  // Only AlphaNumeric
  keyPressAlphaNumeric(event) {

    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

}


