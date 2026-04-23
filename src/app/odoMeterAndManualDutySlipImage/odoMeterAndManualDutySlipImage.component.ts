// @ts-nocheck
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormControl } from '@angular/forms';
import { OdoMeterAndManualDutySlipImageService } from './odoMeterAndManualDutySlipImage.service';
import { OdoMeterAndManualDutySlipImage } from './odoMeterAndManualDutySlipImage.model';
@Component({
  standalone: false,
  selector: 'app-odoMeterAndManualDutySlipImage',
  templateUrl: './odoMeterAndManualDutySlipImage.component.html',
  styleUrls: ['./odoMeterAndManualDutySlipImage.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class OdoMeterAndManualDutySlipImageComponent implements OnInit {
  @Input() oDOMAndMDSAdvanceTable;
  @Input() dutySlipID;
  @Input() AllotmentID;
  @Input() verifyDutyStatusAndCacellationStatus;

  dutyTollParkingID: number;
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  activation: string;
  sortingData: number;
  sortType: string;
  search : FormControl = new FormControl();
  SearchDutyTollParkingID: number=0;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public odoMeterAndManualDutySlipImageService: OdoMeterAndManualDutySlipImageService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService
  ) {}
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.loadDataForImage();
    
  }
  refresh() {
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.loadDataForImage();
  }



  public Filter()
  {
    this.PageNumber = 0;
    this.loadDataForImage();
  }

   public loadDataForImage() 
   {
      this.odoMeterAndManualDutySlipImageService.getAllotmentIDForDutySlipImage(this.AllotmentID).subscribe
      (
       (data:OdoMeterAndManualDutySlipImage) =>  
        {
          this.oDOMAndMDSAdvanceTable = data;         
        },
        (error: HttpErrorResponse) => { this.oDOMAndMDSAdvanceTable = null;}
      );
  }
  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
  onContextMenu(event: MouseEvent, item: any) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }
 
  public SearchData()
  {
    this.loadDataForImage();
    //this.SearchDutyTollParkingEntry='';
    
  }

/////////////////for Image Upload////////////////////////////
  public response: { dbPath: '' };
  public ImagePath: string;
  public uploadFinished = (event) => {
  this.response = event;
  this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
  }
/////////////////for Image Upload ends////////////////////////////

  /////////////////To Recieve Updates Start////////////////////////////
  messageReceived: string;
  MessageArray:string[]=[];
  private subscriptionName: Subscription; //important to create a subscription

 



  openImageInNewTab(imageUrl: string) {
    window.open(imageUrl, '_blank');
}
}



