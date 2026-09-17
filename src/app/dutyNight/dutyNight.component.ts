// @ts-nocheck
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { GeneralService } from '../general/general.service';
import { DutyNightFormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { DutyNight } from './dutyNight.model';
import { DutyNightService } from './dutyNight.service';

@Component({
  standalone: false,
  selector: 'app-dutyNight',
  templateUrl: './dutyNight.component.html',
  styleUrls: ['./dutyNight.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class DutyNightComponent implements OnInit {
  @Input() advanceTableDutyNight;
  @Input() dutySlipID;
  @Input() verifyDutyStatusAndCacellationStatus;
  @Input() isDutyNightEditBlocked = false;
  @Output() sectionDataChanged = new EventEmitter<void>();

  displayedColumns = [
    'numberOnNights',
    'changeDateTime',
    'reasonOfChange',
    'changedBy',
    'status',
    'actions'
  ];

  displayedColumnsWithoutActions = [
    'numberOnNights',
    'changeDateTime',
    'reasonOfChange',
    'changedBy',
    'status'
  ];

  dutyNightID: any;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public dutyNightService: DutyNightService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService
  ) {}

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  ngOnInit() {
    this.loadData();
    this.loadDataDutyNightClosing();
    this.SubscribeUpdateService();
  }

  refresh() {
    this.loadData();
    this.sectionDataChanged.emit();
  }

  editCall(row) {
    if (!row.activationStatus || this.isDutyNightEditBlocked) {
      return;
    }
    this.dutyNightID = row.dutyNightID;
    const dialogRef = this.dialog.open(DutyNightFormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit',
        verifyDutyStatusAndCacellationStatus: this.verifyDutyStatusAndCacellationStatus,
        isDutyNightEditBlocked: this.isDutyNightEditBlocked,
        dutySlipID: this.dutySlipID
      }
    });
    this.handleSectionDialogClosed(dialogRef);
  }

  deleteItem(row) {
    if (!row.activationStatus || this.isDutyNightEditBlocked) {
      return;
    }
    this.dutyNightID = row.dutyNightID;
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: row
    });
    this.handleSectionDialogClosed(dialogRef);
  }

  private handleSectionDialogClosed(dialogRef): void {
    dialogRef.afterClosed().subscribe((saved: any) => {
      if (saved) {
        this.refresh();
      }
    });
  }

  public loadData() {
    this.dutyNightService.getTableDataforClosing(this.dutySlipID).subscribe(
      data => {
        this.advanceTableDutyNight = data;
      },
      (error: HttpErrorResponse) => { this.advanceTableDutyNight = null; }
    );
  }

  public loadDataDutyNightClosing() {
    this.dutyNightService.getTableDataDutyNightClosing(this.dutySlipID).subscribe(
      data => {
        this.advanceTableDutyNight = data;
      },
      (error: HttpErrorResponse) => { this.advanceTableDutyNight = null; }
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

  onContextMenu(event: MouseEvent, item: DutyNight) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  messageReceived: string;
  MessageArray: string[] = [];
  private subscriptionName: Subscription;

  SubscribeUpdateService() {
    this.subscriptionName = this._generalService.getUpdate().subscribe(
      message => {
        this.messageReceived = message.text;
        this.MessageArray = this.messageReceived.split(':');
        if (this.MessageArray.length == 3) {
          if (this.MessageArray[0] == 'DutyNightCreate' || this.MessageArray[0] == 'DutyNightUpdate' || this.MessageArray[0] == 'DutyNightDelete') {
            if (this.MessageArray[1] == 'DutyNightView' && this.MessageArray[2] == 'Success') {
              this.refresh();
            }
          } else if (this.MessageArray[0] == 'DutyNightAll' && this.MessageArray[1] == 'DutyNightView' && this.MessageArray[2] == 'Failure') {
            this.refresh();
            this.showNotification('snackbar-danger', 'Operation Failed.....!!!', 'bottom', 'center');
          }
        }
      }
    );
  }
}
