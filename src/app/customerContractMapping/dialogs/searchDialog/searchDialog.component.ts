// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component,  ElementRef,  Inject } from '@angular/core';

import { MAT_DATE_LOCALE } from '@angular/material/core';
import { DocumentDropDown } from 'src/app/general/documentDropDown.model';
import { GeneralService } from 'src/app/general/general.service';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CustomerContractDropDown } from 'src/app/customerContract/customerContractDropDown.model';
import{CustomerContractMappingService} from 'src/app/customerContractMapping/customerContractMapping.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';


@Component({
  standalone: false,
  selector: 'app-searchDialog',
  templateUrl: './searchDialog.component.html',
  styleUrls: ['./searchDialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class SearchDialogComponent 
{  
  search: FormControl = new FormControl();
 
  action: string;
  customerContractID: any;
  customerConID:any;
  dialogTitle: string;
  //advanceTable: CustomerConfigurationMessaging;
  public CustomerList?: CustomerContractDropDown[] = [];
  filteredOptions: Observable<CustomerContractDropDown[]>;
  constructor(

  public dialog: MatDialogRef<SearchDialogComponent>,
 // public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public _generalService:GeneralService)
  {
    
   
  }

  public ngOnInit(): void
  {
     this.InitCustomerContract();
  }
  private _filter(value: any): any {
    const filterValue = value.toLowerCase();
    if (!value || value.length < 3) {
      return [];   
    }
    return this.CustomerList.filter(
      customer =>
      {
        return customer.customerContractName.toLowerCase().includes(filterValue);
      }
    );
  }
 
  InitCustomerContract(){
    this._generalService.GetCustomerContract().subscribe
    (
      data =>   
      {
        this.CustomerList = data; 
        this.filteredOptions = this.search.valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        );      
      }
     
    );
  }
 

  CloseDialog(){
    this.dialog.close();
  }
  GetID(option :any){
       this.customerConID=option;

  }
  submit(){
    this.dialog.close(this.customerConID);
  }
}




