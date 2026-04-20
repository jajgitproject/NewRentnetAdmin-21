// @ts-nocheck
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { PageService } from './page.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Page } from './page.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { ParentMenuDropDown } from '../general/parentMenuDropDown.model';
import { FormControl } from '@angular/forms';

@Component({
  standalone: false,
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class PageComponent implements OnInit {
  displayedColumns = [
    'page',
    'menuIndex',
    'parentMenuName',
    'isItTopMenu',
    'remark',
    'status',
    'actions'
  ];
  dataSource: Page[] | null;
  pageID: number;
  sortType: string;
  sortingData: number;
  advanceTable: Page | null;
  SearchPage: string = '';
  SearchActivationStatus :boolean=true;
  SearchParentMenuID : number = -1;
  public ParentMenuList?: ParentMenuDropDown[] = [];
  filteredPageOptions: Observable<ParentMenuDropDown[]>;
  //public ParentMenuList?: ParentMenuDropDown[] = [];
  page : FormControl = new FormControl();
  PageNumber:number=0;
  selectedFilter: string = 'search';
  searchTerm: any = '';

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public pageService: PageService,
    private snackBar: MatSnackBar,
    private generalService: GeneralService
    //public _generalService: GeneralService
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
    this.InitParentMenu();
    this.loadData();
    this. SubscribeUpdateService();
  }
  
  refresh() 
  {
    this.page.setValue('');
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.SearchParentMenuID=-1;
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
    this.pageID = row.id;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit'
      }
    });

  }
  
  deleteItem(row)
  {
    this.pageID = row.id;
    const dialogRef = this.dialog.open(DeleteDialogComponent, 
    {
      data: row
    });
  }

  onBackPress(event) {
    if (event.keyCode === 8) 
    {
      this.loadData();
    }
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
    if(this.selectedFilter==='Parent')
    {
      this.page.setValue(this.searchTerm)
    }
      this.pageService.getTableData(this.page.value, this.SearchParentMenuID, this.SearchActivationStatus, this.PageNumber).subscribe
    (
      data =>   
      {
        this.dataSource = data;
       
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
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
    this.pageService.getTableDataSort(this.SearchPage, this.SearchParentMenuID,this.SearchActivationStatus, this.PageNumber, coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
       
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }

  // InitParentMenu() 
  // {
  //   this.generalService.GetParentMenus().subscribe(
  //     data =>
  //     {
  //       this.ParentMenuList = data;
  //     }
  //   );
  // }

  InitParentMenu(){
    this.generalService.GetParentMenus().subscribe(
      data=>
      {
        this.ParentMenuList = data;
        this.filteredPageOptions = this.page.valueChanges.pipe(
          startWith(""),
          map(value => this._filterpage(value || ''))
        );
      },
      error =>
      {
       
      }
    );
  }

  private _filterpage(value: string): any {
    const filteringValue = value.toLowerCase();
    if (!value || value.length < 3) {
        return [];   
      }
    return this.ParentMenuList.filter(
      page => 
      {
        return page.page.toLowerCase().indexOf(filteringValue)===0;
      }
    );
  }

  public SearchData()
  {
    this.loadData();
    //this.SearchName='';
    
  }

  openSearchDialog()
  {
    this.dialog.open(this.searchDialog, { width: '500px' });
  }

  SearchFromDialog(dialogRef: any)
  {
    this.SearchData();
    dialogRef.close();
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 5000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
  onContextMenu(event: MouseEvent, item: Page) {
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

  /////////////////To Recieve Updates Start////////////////////////////
  messageReceived: string;
  MessageArray:string[]=[];
  private subscriptionName: Subscription; //important to create a subscription

  SubscribeUpdateService()
  {
    this.subscriptionName=this.generalService.getUpdate().subscribe
    (
      message => 
      { 
        //message contains the data sent from service
        this.messageReceived = message.text;
        this.MessageArray=this.messageReceived.split(":");
        if(this.MessageArray.length==3)
        {
          if(this.MessageArray[0]=="PageCreate")
          {
            if(this.MessageArray[1]=="PageView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Page Created...!!! ',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="PageUpdate")
          {
            if(this.MessageArray[1]=="PageView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Page Updated...!!! ',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="PageDelete")
          {
            if(this.MessageArray[1]=="PageView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                ' Page Deleted...!!! ',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="PageAll")
          {
            if(this.MessageArray[1]=="PageView")
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

}



