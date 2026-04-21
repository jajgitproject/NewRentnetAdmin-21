// @ts-nocheck
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SendSMSService } from '../../sendSMS.service';
import { GeneralService } from 'src/app/general/general.service';
import { CustomerPersonDropDown } from 'src/app/customerPerson/customerPersonDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { AddPeople, CustomerConfigurationMessaging } from '../../sendSMS.model';
import { CountryCodeDropDown } from 'src/app/general/countryCodeDropDown.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  standalone: false,
  selector: 'app-add-people',
  templateUrl: './add-people.component.html',
  styleUrls: ['./add-people.component.sass']
})
export class AddPeopleComponent implements OnInit {
  action: string;
  permissionData:CustomerConfigurationMessaging[] | null;
  dialogTitle: string;
  customerPersonID:number;
  advanceTableForm: FormGroup;
  advanceTable: AddPeople;
  customerPerson:boolean=true;
  employee:boolean=false;
  number:boolean=false;
  selectedValue: string;
  public CountryCodeList?: CountryCodeDropDown[] = [];
  filteredCountryCodeOptions: Observable<CountryCodeDropDown[]>;
  filteredCustomerMobileOptions: Observable<CustomerPersonDropDown[]>;
  public CustomerMobileList?: CustomerPersonDropDown[] = [];
  filteredEmployeeMobileOptions: Observable<EmployeeDropDown[]>;
  public EmployeeMobileList?: EmployeeDropDown[] = [];
  employeeID: any;
  formDataArray = [];
  customerPersonName: any;
  ReservationID: number;
  customerOptionDetail: any;

  constructor(
    public dialog: MatDialog,
      public dialogRef: MatDialogRef<AddPeopleComponent>, 
      @Inject(MAT_DIALOG_DATA) public data: any,
      public advanceTableService: SendSMSService,
        private fb: FormBuilder,
      public _generalService:GeneralService)
      {
            // Set the defaults
            this.action = data.action;
            // if (this.action === 'edit') 
            // {
            //   this.dialogTitle ='SendSMS';       
            //   this.advanceTable = data.advanceTable;
            // } else 
            // {
            //   this.dialogTitle = 'SendSMS';
            //   this.advanceTable = new SendSMS({});
          
            // }
           
            this.advanceTableForm = this.createContactForm();
            this.ReservationID = data.ReservationID;
  
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

  ngOnInit(): void {
    this.loadData();
   this.getCustomerMobile();   
   this.InitCountryISDCode(); 
   
    this.getEmployeeMobile();
  }

  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      addPeople:[this.advanceTable?.addPeople],
      customer: [this.advanceTable?.customer],
      employee: [this.advanceTable?.employee],
      number: [this.advanceTable?.number],
      countryCode:['+91'],
      name: [this.advanceTable?.name],
    });
  }

  changeValue(event: any) {
    this.selectedValue = event?.value;
    
  }
  fillNumber(selectedOption: any) {
    if (selectedOption ) {
      const parts = selectedOption.split('-');
       const phoneNumber = parts[0];
 
        this.advanceTableForm.get('number').setValue(phoneNumber);
        
    }
}

  postAdd() {
    if (this.advanceTableForm.valid) {
      if(this.selectedValue === 'customerPerson') {
        this.formDataArray.push({
          primaryMobile: this.advanceTableForm.get('number')?.value,
          customerPersonName: this.advanceTableForm.value,
          isBooker: this.customerOptionDetail.isBooker || false,
          isPassenger: this.customerOptionDetail.isPassenger || false,
          customerPersonID:this.customerOptionDetail.customerPersonID,

          data :this?.permissionData.values || null,
          type: this.advanceTableForm.controls['addPeople'].value
          
        });
      } else if(this.selectedValue === 'employee') {
        this.formDataArray.push({
          primaryMobile: this.advanceTableForm.get('number')?.value,
          customerPersonName: this.advanceTableForm.value, 
          type: this.advanceTableForm.controls['addPeople'].value
        });
      } else if(this.selectedValue === 'number') {
        this.formDataArray.push({
          primaryMobile: this.advanceTableForm.get('number')?.value,
          customerPersonName: this.advanceTableForm.value,
           type: this.advanceTableForm.controls['addPeople'].value
        });
      }
      
      this.dialogRef.close(this.formDataArray);
    }
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

  getCustomerMobile(){
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
    return this.CustomerMobileList.filter(
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
  
    //--------------------- Employee Mobile--------------------

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
      return this.EmployeeMobileList.filter(
        customer =>
        {
          return customer.mobile.toLowerCase().indexOf(filterValue)===0 || customer.name.toLowerCase().indexOf(filterValue)===0 || customer.email.toLowerCase().indexOf(filterValue)===0;
        }
      );
      }
      getEmployeeID(employeeID: any) {
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
}


