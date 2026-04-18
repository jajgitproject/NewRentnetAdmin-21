// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CustomerDetailsService } from './customerDetails.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CustomerDetails } from './customerDetails.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FormDialogAddPassengersComponent } from '../addPassengers/dialogs/form-dialog/form-dialog.component';
import { Router } from '@angular/router';
export interface User {
  name: string;
}
@Component({
  standalone: false,
  selector: 'app-customerDetails',
  templateUrl: './customerDetails.component.html',
  styleUrls: ['./customerDetails.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CustomerDetailsComponent implements OnInit {
  advanceTableForm: FormGroup;
  advanceTable: CustomerDetails | null;

  myControl = new FormControl();
  options: User[] = [{ name: 'Lodhi Road' }, { name: 'Noida' }, { name: 'Gurgaon' }];
  filteredOptions: Observable<User[]>;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public customerDetailsService: CustomerDetailsService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    public router:Router,
    public _generalService: GeneralService
  ) {
    this.advanceTable = new CustomerDetails({});
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.SubscribeUpdateService();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.name)),
      map((name) => (name ? this._filter(name) : this.options.slice()))
    );
  }

  displayFn(user: User): string {
    return user && user.name ? user.name : '';
  }

  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(
      (option) => option.name.toLowerCase().indexOf(filterValue) === 0
    );
  }

  submit() 
  {
    // emppty stuff
  }
  // addNew()
  // {
  //   const dialogRef = this.dialog.open(CustomerDetailsDialogComponent, 
  //   {
  //     data: 
  //       {
  //         advanceTable: this.advanceTable,
  //         action: 'add'
  //       }
  //   });
  // }

//   editCall(row) {
//     //  alert(row.id);
//   this.customerDetailsID = row.id;
//   const dialogRef = this.dialog.open(CustomerDetailsDialogComponent, {
//     data: {
//       advanceTable: row,
//       action: 'edit'
//     }
//   });

// }
// deleteItem(row)
// {
//   this.customerDetailsID = row.id;
//   const dialogRef = this.dialog.open(DeleteDialogComponent, 
//   {
//     data: row
//   });
// }

createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
    //   customerSpecificFieldsID: [this.advanceTable.customerSpecificFieldsID],
    //   field1: [this.advanceTable.field1],
    //   field2: [this.advanceTable.field2],
    //   field3: [this.advanceTable.field3],
    //   field4: [this.advanceTable.field4]
     });
  }

  navigateToNewForms()
  {
    this.router.navigate([
      '/newForm',       
     
    ],{
      queryParams: {
      }
    });
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
  onContextMenu(event: MouseEvent, item: CustomerDetails) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }


/////////////////for Image Upload////////////////////////////
  public response: { dbPath: '' };
  public ImagePath: string;
  public uploadFinished = (event) => {
    debugger;
  this.response = event;
  this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
  }
/////////////////for Image Upload ends////////////////////////////


  /////////////////To Recieve Updates Start////////////////////////////
  messageReceived: string;
  MessageArray:string[]=[];
  private subscriptionName: Subscription; //important to create a subscription

  SubscribeUpdateService()
  {
    this.subscriptionName=this._generalService.getUpdate().subscribe
    (
      message => 
      { 
        //message contains the data sent from service
        this.messageReceived = message.text;
        this.MessageArray=this.messageReceived.split(":");
        if(this.MessageArray.length==3)
        {
          if(this.MessageArray[0]=="CustomerDetailsCreate")
          {
            if(this.MessageArray[1]=="CustomerDetailsView")
            {
              if(this.MessageArray[2]=="Success")
              {
                
                this.showNotification(
                'snackbar-success',
                'CustomerDetails Created Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerDetailsUpdate")
          {
            if(this.MessageArray[1]=="CustomerDetailsView")
            {
              if(this.MessageArray[2]=="Success")
              {
               
               this.showNotification(
                'snackbar-success',
                'CustomerDetails Updated Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerDetailsDelete")
          {
            if(this.MessageArray[1]=="CustomerDetailsView")
            {
              if(this.MessageArray[2]=="Success")
              {
               
               this.showNotification(
                'snackbar-success',
                'Deleted Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerDetailsAll")
          {
            if(this.MessageArray[1]=="CustomerDetailsView")
            {
              if(this.MessageArray[2]=="Failure")
              {
               
               this.showNotification(
                'snackbar-danger',
                'Operation Failed.....!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="DataNotFound")
          {
            if(this.MessageArray[1]=="DuplicacyError")
            {
              if(this.MessageArray[2]=="Failure")
              {
               
               this.showNotification(
                'snackbar-danger',
                'Duplicate Value Found.....!!!',
                'bottom',
                'center'
              );
              }
            }
          }
        }
      }
    );
  }

  addPassengers()
  {
    const dialogRef = this.dialog.open(FormDialogAddPassengersComponent, 
      {
        data: 
          {
            // advanceTable: this.advanceTable,
            // action: 'add'
          }
      });
  }
}

        


