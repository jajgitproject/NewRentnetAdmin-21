// @ts-nocheck
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { GeneralService } from '../general/general.service';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { DutyNight } from './dutyNight.model';
import { DutyNightService } from './dutyNight.service';
import { showDutyNightEntryBlockedDialog } from './duty-night-entry-guard.util';
import { isDutyNightRecordActive, normalizeDutyNightRecords } from './duty-night-status.util';

@Component({
  standalone: false,
  selector: 'app-dutyNight',
  templateUrl: './dutyNight.component.html',
  styleUrls: ['./dutyNight.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class DutyNightComponent implements OnInit, OnChanges {
  @Input() advanceTableDutyNight;
  @Input() dutySlipID;
  @Input() verifyDutyStatusAndCacellationStatus;
  @Input() isDutyNightEditBlocked = false;
  @Input() embeddedInClosing = false;
  @Input() isDutyNightEntryBlocked = false;
  @Input() dutyNightEntryBlockedMessage: string | null = null;
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
  isDutyNightRecordActive = isDutyNightRecordActive;

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
    if (this.embeddedInClosing) {
      if (this.advanceTableDutyNight != null) {
        this.advanceTableDutyNight = this.normalizeRecords(this.advanceTableDutyNight);
      }
      return;
    }
    this.loadDataDutyNightClosing();
    this.SubscribeUpdateService();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['advanceTableDutyNight'] && changes['advanceTableDutyNight'].currentValue != null) {
      this.advanceTableDutyNight = this.normalizeRecords(changes['advanceTableDutyNight'].currentValue);
    }
  }

  refresh() {
    if (this.embeddedInClosing) {
      this.sectionDataChanged.emit();
      return;
    }
    this.loadDataDutyNightClosing();
    this.sectionDataChanged.emit();
  }

  deleteItem(row) {
    if (this.isDutyNightEntryBlocked) {
      showDutyNightEntryBlockedDialog(this.dutyNightEntryBlockedMessage);
      return;
    }
    if (!isDutyNightRecordActive(row) || this.isDutyNightEditBlocked) {
      return;
    }
    this.dutyNightID = row.dutyNightID;
    const dialogRef = this.dialog.open(DeleteDialogComponent, { data: row });
    dialogRef.afterClosed().subscribe((saved: any) => {
      if (saved === true) {
        this.markDutyNightDeactivatedLocally(row.dutyNightID);
        this.refresh();
      }
    });
  }

  private markDutyNightDeactivatedLocally(dutyNightID: number): void {
    if (dutyNightID == null) {
      return;
    }
    const records = this.normalizeRecords(this.advanceTableDutyNight);
    this.advanceTableDutyNight = records.map((record) =>
      record.dutyNightID === dutyNightID
        ? { ...record, activationStatus: false }
        : record
    );
  }

  public loadDataDutyNightClosing() {
    if (this.dutySlipID == null || this.dutySlipID === '') {
      this.advanceTableDutyNight = [];
      return;
    }
    this.dutyNightService.getTableDataDutyNightClosing(this.dutySlipID).subscribe(
      data => {
        this.advanceTableDutyNight = this.normalizeRecords(data);
      },
      (error: HttpErrorResponse) => {
        this.advanceTableDutyNight = [];
      }
    );
  }

  private normalizeRecords(data: any): DutyNight[] {
    return normalizeDutyNightRecords(data);
  }

  get tableColumns(): string[] {
    if (this.isDutyNightEntryBlocked || this.isDutyNightEditBlocked) {
      return this.displayedColumnsWithoutActions;
    }
    return this.displayedColumns;
  }

  getStatusLabel(row: DutyNight): string {
    if (isDutyNightRecordActive(row)) {
      return 'Active';
    }
    return this.embeddedInClosing ? 'Deactive' : 'Deleted';
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
