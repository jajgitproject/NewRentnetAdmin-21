// @ts-nocheck
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { IncidenceService } from '../../incidence.service';
import { Incidence } from '../../incidence.model';
import { incidenceFormDialogComponent } from '../form-dialog/form-dialog.component';
import { resolutionFormDialogComponent } from '../../../resolution/dialogs/form-dialog/form-dialog.component';

@Component({
  standalone: false,
  selector: 'app-incidence-list-dialog',
  templateUrl: './incidence-list-dialog.component.html',
  styleUrls: ['./incidence-list-dialog.component.sass'],
})
export class IncidenceListDialogComponent implements OnInit {
  dataSource: Incidence[] = [];
  loading = false;
  focusAction: 'incidence' | 'resolution' = 'incidence';
  reservationContext: any;

  displayedColumns: string[] = [
    'IncidenceID',
    'IncidenceDate',
    'IncidenceType',
    'IssueCategory',
    'IncidencePlace',
    'Status',
    'Actions',
  ];

  constructor(
    public dialogRef: MatDialogRef<IncidenceListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public incidenceService: IncidenceService,
  ) {
    this.reservationContext = data?.item || {};
    this.focusAction = data?.focusAction === 'resolution' ? 'resolution' : 'incidence';
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const reservationID = this.data?.reservationID || this.reservationContext?.reservationID;
    if (!reservationID) {
      this.dataSource = [];
      return;
    }

    this.loading = true;
    this.incidenceService.getTableData(reservationID, true, 0).subscribe(
      (rows) => {
        this.dataSource = Array.isArray(rows) ? rows : [];
        this.loading = false;
      },
      (_error: HttpErrorResponse) => {
        this.dataSource = [];
        this.loading = false;
      },
    );
  }

  createNew(): void {
    // Pass the full reservation context (same shape as control-panel openers).
    const item = {
      ...(this.reservationContext || {}),
      reservationID:
        this.data?.reservationID || this.reservationContext?.reservationID,
      incidenceID: 0,
    };
    const dialogRef = this.dialog.open(incidenceFormDialogComponent, {
      width: '90%',
      height: '90%',
      disableClose: true,
      data: {
        action: 'add',
        item,
        reservationID: item.reservationID,
        dutySlipID: item.dutySlipID,
        customerName: item.customerName,
        customerID: item.customerID,
        registrationNumber: item.registrationNumber,
        inventoryID: item.inventoryID,
        customerPersonID:
          item.customerPersonID ||
          item.primaryPassengerID ||
          item.passengerDetails?.[0]?.customerPersonID,
        driverName: item.driverName,
        organizationalEntityName:
          item.organizationalEntityName || item.transferedLocation,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadData();
      }
    });
  }

  editIncidence(row: any): void {
    // Merge reservation context so edit has passenger/customer fields the
    // incidence list API row may not include.
    const item = {
      ...(this.reservationContext || {}),
      ...row,
      passengerDetails:
        row.passengerDetails || this.reservationContext?.passengerDetails || [],
      primaryPassenger:
        row.primaryPassenger ||
        row.customerPersonName ||
        this.reservationContext?.primaryPassenger ||
        this.reservationContext?.passengerDetails?.[0]?.customerPersonName,
      primaryPassengerID:
        row.primaryPassengerID ||
        row.passengerID ||
        row.customerPersonID ||
        this.reservationContext?.primaryPassengerID ||
        this.reservationContext?.passengerDetails?.[0]?.customerPersonID,
    };

    const dialogRef = this.dialog.open(incidenceFormDialogComponent, {
      width: '90%',
      height: '90%',
      disableClose: true,
      data: {
        action: 'edit',
        item,
        advanceTable: item,
        incidenceID: row.incidenceID,
        reservationID: row.reservationID || item.reservationID,
        dutySlipID: row.dutySlipID || this.reservationContext?.dutySlipID,
        customerName: row.customerName || this.reservationContext?.customerName,
        customerID: row.customerID || this.reservationContext?.customerID,
        registrationNumber:
          row.registrationNumber || this.reservationContext?.registrationNumber,
        inventoryID: row.inventoryID || this.reservationContext?.inventoryID,
        driverName: row.driverName || this.reservationContext?.driverName,
        organizationalEntityName:
          row.organizationalEntityName ||
          this.reservationContext?.organizationalEntityName ||
          this.reservationContext?.transferedLocation,
        customerPersonID: item.primaryPassengerID,
        customerPersonName: item.primaryPassenger,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadData();
      }
    });
  }

  openResolution(row: any): void {
    // Same merge as Edit — incidence list rows omit reservation/passenger context.
    const item = {
      ...(this.reservationContext || {}),
      ...row,
      passengerDetails:
        row.passengerDetails || this.reservationContext?.passengerDetails || [],
      primaryPassenger:
        row.primaryPassenger ||
        row.customerPersonName ||
        this.reservationContext?.primaryPassenger ||
        this.reservationContext?.passengerDetails?.[0]?.customerPersonName,
      primaryPassengerID:
        row.primaryPassengerID ||
        row.passengerID ||
        row.customerPersonID ||
        this.reservationContext?.primaryPassengerID ||
        this.reservationContext?.passengerDetails?.[0]?.customerPersonID,
      transferedLocation:
        row.transferedLocation ||
        this.reservationContext?.organizationalEntityName ||
        this.reservationContext?.transferedLocation,
    };

    // Defer open so any parent menu/focus teardown finishes first.
    setTimeout(() => {
      try {
        const dialogRef = this.dialog.open(resolutionFormDialogComponent, {
          width: '90%',
          height: '90%',
          disableClose: true,
          data: {
            action: 'edit',
            item,
            advanceTable: item,
            incidenceID: row.incidenceID,
            reservationID: row.reservationID || item.reservationID,
            dutySlipID: row.dutySlipID || this.reservationContext?.dutySlipID,
            customerName: row.customerName || this.reservationContext?.customerName,
            customerID: row.customerID || this.reservationContext?.customerID,
            registrationNumber:
              row.registrationNumber || this.reservationContext?.registrationNumber,
            inventoryID: row.inventoryID || this.reservationContext?.inventoryID,
            driverName: row.driverName || this.reservationContext?.driverName,
            organizationalEntityName:
              item.transferedLocation ||
              this.reservationContext?.organizationalEntityName,
            customerPersonID: item.primaryPassengerID,
            customerPersonName: item.primaryPassenger,
          },
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.loadData();
          }
        });
      } catch (err) {
        console.error('Failed to open resolution dialog', err);
      }
    });
  }

  close(): void {
    this.dialogRef.close(true);
  }
}
