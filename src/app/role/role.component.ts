// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { RoleService } from './role.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Role } from './role.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  standalone: false,
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class RoleComponent implements OnInit {
  displayedColumns = [
    'role',
    'roleFor',
    'remark',
   'canCreateReservation',
    'status',
    'pages',
    'actions'
  ];
  dataSource: Role[] | null;
  roleID: number;
  advanceTable: Role | null;
  sortingData: number;
  sortType: string;
  SearchRole: string = '';
  SearchRemark: string = '';
  SearchRoleFor: string ='Internal';
  SearchRoleFor1: string ='Customer';
  SearchActivationStatus :boolean=true;
  PageNumber:number=0;
  selectedFilter: string = 'search';
  searchTerm: any = '';

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public roleService: RoleService,
    private snackBar: MatSnackBar,
    public route: ActivatedRoute,
    private _generalService: GeneralService,
    public router: Router
  ) {}
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  
  @ViewChild('searchDialog') searchDialog: TemplateRef<any>;
@ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() 
  {
    this.SubscribeUpdateService();
    this.loadData();
  }
  refresh() {
    this.SearchRole = '';
    this.SearchRoleFor = '';
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.searchTerm='';
    this.selectedFilter='search';
    this.loadData();
  }
  addNew()
  {
    const dialogRef = this.dialog.open(FormDialogComponent, 
    {
      data: 
        {
          advanceTable: this.advanceTable,
          action: 'add'
        }
    });
  }
  editCall(row) {
    this.roleID = row.id;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit'
      }
    });
  }
  deleteItem(row)
  {
    this.roleID = row.id;
    const dialogRef = this.dialog.open(DeleteDialogComponent, 
    {
      data: row
    });
  }

  shouldShowDeleteButton(item: any): boolean {
    return item.activationStatus !== false; // Only show delete button if activationStatus is not false (not deleted)
  }

  public Filter()
  {
    this.PageNumber = 0;
    this.loadData();
  }
   public loadData() 
   {
    switch (this.selectedFilter)
    {
      case 'role':
        this.SearchRole = this.searchTerm;
        break;
      case 'roleFor':
        this.SearchRoleFor = this.searchTerm;
        break;
      // case 'Remark':
      //   this.SearchRemark = this.searchTerm;
      //   break;
      default:
        this.searchTerm = '';
        break;
    }
      this.roleService.getTableData(this.SearchRole, this.SearchRoleFor, this.SearchActivationStatus, this.PageNumber).subscribe
    (
      data =>   
      {
        this.dataSource = data;
       
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 5000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
  onContextMenu(event: MouseEvent, item: Role) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }
  NextCall()
  {
    if (this.dataSource.length>0) 
    {
      this.PageNumber++;
      this.loadData();
    }
  }
  PreviousCall()
  {

    if(this.PageNumber>0)
    {
      this.PageNumber--;
      this.loadData();    } 
  }

  public SearchData()
  {
    this.loadData();
    //this.SearchName='';
    
  }


  onBackPress(event) {
    if (event.keyCode === 8) 
    {
      this.loadData();
    }
  }

  PageMapping(row)
  {
    console.log(row)
    this.router.navigate(['/rolePageMapping', row.roleID, row.
    role
    ]);
  }

  SortingData(coloumName:any) {
   
    if (this.sortingData == 1) {

      this.sortingData = 0;
      this.sortType = "Ascending"
    }
    else {
      this.sortingData = 1;
      this.sortType = "Descending";
    }
    this.roleService.getTableDataSort(this.SearchRole, this.SearchRoleFor,this.SearchActivationStatus, this.PageNumber, coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
       
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }

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
         if(this.MessageArray[0]=="RoleCreate")
         {
           if(this.MessageArray[1]=="RoleView")
           {
             if(this.MessageArray[2]=="Success")
             {
               this.refresh();
               this.showNotification(
               'snackbar-success',
               'Role Created...!!! ',
               'bottom',
               'center'
             );
             }
           }
         }
         else if(this.MessageArray[0]=="RoleUpdate")
         {
           if(this.MessageArray[1]=="RoleView")
           {
             if(this.MessageArray[2]=="Success")
             {
              this.refresh();
              this.showNotification(
               'snackbar-success',
               'Role Updated...!!! ',
               'bottom',
               'center'
             );
             }
           }
         }
         else if(this.MessageArray[0]=="RoleDelete")
         {
           if(this.MessageArray[1]=="RoleView")
           {
             if(this.MessageArray[2]=="Success")
             {
              this.refresh();
              this.showNotification(
               'snackbar-success',
               'Role Deleted...!!! ',
               'bottom',
               'center'
             );
             }
           }
         }
         else if(this.MessageArray[0]=="RoleAll")
         {
           
           if(this.MessageArray[1]=="RoleView")
           {
             if(this.MessageArray[2]=="Failure")
             {
              this.refresh();
              this.showNotification(
               'snackbar-danger',
               'Operation Failed.....!!!',
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


  openSearchDialog() {
    this.dialog.open(this.searchDialog, { width: '500px' });
  }

  SearchFromDialog(dialogRef: any) {
    SearchData();
    dialogRef.close();
  }

}



