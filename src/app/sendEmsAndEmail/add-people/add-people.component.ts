// @ts-nocheck
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
// import { SendSMSService } from '../../sendSMS.service';
import { GeneralService } from 'src/app/general/general.service';
import { CustomerPersonDropDown } from 'src/app/customerPerson/customerPersonDropDown.model';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { AddPeople } from './add-people.model';
import { CountryCodeDropDown } from 'src/app/general/countryCodeDropDown.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfigurationMessaging } from '../sendEmsAndEmail.model';
//import { CustomerConfigurationMessaging } from 'src/app/sendSMS/sendSMS.model';
//import { AddPeople } from './add-people.model';
// import { AddPeople } from '../../sendSMS.model';

@Component({
  standalone: false,
  selector: 'app-ems-email-add-people',
  templateUrl: './add-people.component.html',
  styleUrls: ['./add-people.component.sass']
})
export class AddPeopleComponent implements OnInit {
  action: string;
  dialogTitle: string;
  customerPersonID:number;
  advanceTableForm: FormGroup;
  advanceTable: AddPeople;
  formDataArray = [];
  // Seed every autocomplete stream with an empty observable so the template's
  // "| async" never resolves from null -> array within the same CD cycle.
  filteredCustomerMobileOptions: Observable<CustomerPersonDropDown[]> = of([]);
  filteredCustomerEmailListOptions: Observable<CustomerPersonDropDown[]> = of([]);
  public CustomerMobileList?: CustomerPersonDropDown[] = [];
  public CustomerEmailList?: CustomerPersonDropDown[] = [];
  public EmployeeMailList?: CustomerPersonDropDown[] = [];
  filteredEmployeeMobileOptions: Observable<EmployeeDropDown[]> = of([]);
  filteredEmployeeMailOptions: Observable<EmployeeDropDown[]> = of([]);
  public EmployeeMobileList?: EmployeeDropDown[] = [];
  public EmployeeEmailList?: EmployeeDropDown[] = [];
  public CountryCodeList?: CountryCodeDropDown[] = [];
  filteredCountryCodeOptions: Observable<CountryCodeDropDown[]> = of([]);
  permissionData:ConfigurationMessaging[] | any;
  employeeID: any;
  primaryEmail: any;
  selectedValue: string;
  newRecords: any;
  ReservationID: number;
  customerOptionDetail: any;
  employeeOptionDetail:any;
  constructor(
    public dialog: MatDialog,
      public dialogRef: MatDialogRef<AddPeopleComponent>, 
      @Inject(MAT_DIALOG_DATA) public data: any,
   
        private fb: FormBuilder,
      public _generalService:GeneralService)
      {
            // Set the defaults
            this.action = data.action;

            this.advanceTableForm = this.createContactForm();
            this.ReservationID = data.ReservationID;
  
      }

  ngOnInit(): void {
    this.loadData();
    this.GetCustomerMobile();
    this.getEmployeeMobile();
    this.getCustomerEmail();
    this.getEmployeeEmail();
    this.InitCountryISDCode();
  }

  postAdd() {
    if (this.advanceTableForm.valid) {
      if(this.selectedValue === 'customerPerson') {
        this.formDataArray.push({
          primaryMobile: this.advanceTableForm.get('primaryMobile')?.value,
          primaryEmail: this.advanceTableForm.get('primaryEmail')?.value,
          customerPersonName: this.advanceTableForm.value,
          isBooker: this.customerOptionDetail.isBooker || false,
          isPassenger: this.customerOptionDetail.isPassenger || false,
          customerPersonID:this.customerOptionDetail.customerPersonID,

          data :this?.permissionData?.values || null,
          type: this.advanceTableForm.controls['addPeople'].value
        });
  
        //this.dialogRef.close(this.formDataArray);
      } else if(this.selectedValue === 'employee') {
        this.formDataArray.push({
          primaryMobile: this.advanceTableForm.get('employeeMobile')?.value,
          primaryEmail: this.advanceTableForm.get('employeeEmail')?.value,
          employeeID:this.employeeOptionDetail.employeeID,
          customerPersonName: this.advanceTableForm.value,
          type: this.advanceTableForm.controls['addPeople'].value
        });
      } else if(this.selectedValue === 'number') {
        const numberMobile = (this.advanceTableForm.get('numberMobile')?.value || '')
          .toString()
          .trim();
        if (!numberMobile) {
          return;
        }
        this.formDataArray.push({
          primaryMobile: numberMobile,
          primaryEmail: this.advanceTableForm.get('numberEmail')?.value || '',
          customerPersonName: this.advanceTableForm.get('name')?.value || '',
          countryCode: this.advanceTableForm.get('countryCode')?.value || '91',
          type: this.advanceTableForm.controls['addPeople'].value
        });
      }
      this.dialogRef.close(this.formDataArray);
    }
  }

  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
customerPersonID:[''],
      addPeople:[this.advanceTable?.addPeople],
      customer: [this.advanceTable?.customer],
      employeeMobile: [this.advanceTable?.employeeMobile],
      employee: [this.advanceTable?.employee],
      name: [this.advanceTable?.name],
      employeeID:[''],
      employeeEmail: [this.advanceTable?.employeeEmail],
      numberMobile: [this.advanceTable?.numberMobile],
      numberEmail: [this.advanceTable?.numberEmail],
      primaryEmail: [this.advanceTable?.primaryEmail],
      primaryMobile: [this.advanceTable?.primaryMobile],
      isBooker: [this.advanceTable?.isBooker],
      isPassenger: [this.advanceTable?.isPassenger],
      countryCode:['+91'],
    });
  }

  //-------------CountryCode-------------
  InitCountryISDCode(){
    this._generalService.GetCountryCodes().subscribe
    (
      data=>{
        this.CountryCodeList=data;
        this.filteredCountryCodeOptions = this.advanceTableForm.controls['countryCode'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterCountryCode(value || ''))
        ); 
      }
    );
  }
  private _filterCountryCode(value: string): any {
    const filterValue = value.toLowerCase();
    return this.CountryCodeList.filter(
      customer => 
      {
        return  customer.icon.toLowerCase().indexOf(filterValue)===0 || customer.countryISOCode.toLowerCase().indexOf(filterValue)===0 || customer.countryISDCode.toLowerCase().indexOf(filterValue)===0;
 
      }
    );
  }
  onCountryCode(event: any): void {      
    this.advanceTableForm.patchValue({ countryCode: event.option.value });
   
  }
//--------------Customer Mobile----------------------

  GetCustomerMobile(){
    this._generalService.GetCustomerPersonMobileNo().subscribe(
      data =>
      {
        this.CustomerMobileList = data; 
        this.filteredCustomerMobileOptions = this.advanceTableForm.controls['customer'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterState(value || ''))
        );              
      },
      error=>
      {
    
      }
    );
    
    }
    private _filterState(value: string): any {
    const filterValue = value.toLowerCase();
    if(filterValue.length === 0) {
      return [];
    }
    return this.CustomerMobileList?.filter(
      
      customer =>
      {
        return customer.primaryMobile.toLowerCase().indexOf(filterValue)===0 || customer.customerPersonName.toLowerCase().indexOf(filterValue)===0 || customer.primaryEmail.toLowerCase().indexOf(filterValue)===0;
      }
    );
    }
    getCustomerID(customerPersonID: any, option: any) {
      
      this.customerOptionDetail = option;
      this.customerPersonID= customerPersonID.customerPersonID;
      this.advanceTableForm.patchValue({customerPersonID:this.customerPersonID})
    }

   //--------------Customer Email---------------------

  getCustomerEmail(){
    this._generalService.getCustomerPersonEmail().subscribe(
      data =>
      {
        this.CustomerEmailList = data;  
        this.filteredCustomerEmailListOptions = this.advanceTableForm.controls['primaryEmail']?.valueChanges.pipe(
          startWith(""),
          map(value => this._filterEmail(value || ''))
        );              
      },
      error=>
      {
    
      }
    );
    
    }
    private _filterEmail(value: string): any {
    const filterValue = value.toLowerCase();
    return this.CustomerEmailList?.filter(
      customer =>
      {
        return customer.primaryEmail?.toLowerCase().indexOf(filterValue)===0;
      }
    );
    }
    getCustomerMailID(customerPersonID: any) {
      this.customerPersonID=customerPersonID;
      }

      fillNumber(selectedOption: any) {
        if (selectedOption ) {
          const parts = selectedOption.split('-');
           const phoneNumber = parts[0];
           const email = parts[2];
            this.advanceTableForm.get('primaryMobile').setValue(phoneNumber);
            this.advanceTableForm.get('primaryEmail').setValue(email);
           
        }
    }

    fillNumber1(selectedOption: any) {
      if (selectedOption ) {
        const parts = selectedOption.split('-');
         const phoneNumber = parts[0];
         const email = parts[2];
          this.advanceTableForm.get('employeeMobile').setValue(phoneNumber);
          this.advanceTableForm.get('employeeEmail').setValue(email);
         
      }
  }

  public loadData() 
  {
     this._generalService.GetPermission(this.ReservationID).subscribe
     (
       data =>   
       {
         this.permissionData = data;

       },
       (error: HttpErrorResponse) => { this.permissionData = null;}
     );
 }

      //------------Employee Mobile----------------------

  getEmployeeMobile(){
    this._generalService.GetEmployeeMobile().subscribe(
      data =>
      {
        this.EmployeeMobileList = data;  
        this.filteredEmployeeMobileOptions = this.advanceTableForm.controls['employee'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterEmployee(value || ''))
        );              
      },
      error=>
      {
    
      }
    );
    
    }
    private _filterEmployee(value: string): any {
    const filterValue = value.toLowerCase();
    if(filterValue.length === 0) {
      return [];
    }
    return this.EmployeeMobileList?.filter(
      customer =>
      {
        return customer.mobile.toLowerCase().indexOf(filterValue)===0 || customer.name.toLowerCase().indexOf(filterValue)===0 || customer.email.toLowerCase().indexOf(filterValue)===0;
      }
    );
    }
    getEmployeeID(employeeID: any,option:any) {
      this.employeeOptionDetail = option;
      this.employeeID= employeeID.employeeID;
      this.advanceTableForm.patchValue({employeeID:this.employeeID})
    }

       //------------Employee Email----------------------

  getEmployeeEmail(){
    this._generalService.getEmployeeEmail().subscribe(
      data =>
      {
        this.EmployeeEmailList = data;  
        this.filteredEmployeeMailOptions = this.advanceTableForm.controls['employeeEmail'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterEmployeeEmail(value || ''))
        );              
      },
      error=>
      {
    
      }
    );
    
    }
    private _filterEmployeeEmail(value: string): any {
    const filterValue = value.toLowerCase();
    return this.EmployeeEmailList?.filter(
      customer =>
      {
        return customer.email.toLowerCase().indexOf(filterValue)===0;
      }
    );
    }
    getEmployeeMailID(employeeID: any) {
    this.employeeID=employeeID;
    }
    submit(){

    }

    public confirmAdd(): void 
  {
       if(this.action=="edit")
       {
          
       }
       else
       {
          // this.Post();
       }
  }

  changeValue(event: any) {
    this.selectedValue = event?.value;
  }
}


