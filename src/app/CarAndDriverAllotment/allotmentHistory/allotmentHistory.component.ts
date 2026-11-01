// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { AllotmentHistoryRow } from '../CarAndDriverAllotment.model';
import { AllotmentHistoryService } from './allotmentHistory.service';

@Component({
  standalone: false,
  selector: 'app-allotment-history',
  templateUrl: './allotmentHistory.component.html',
  styleUrls: ['./allotmentHistory.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }, DatePipe]
})
export class AllotmentHistoryDialogComponent implements OnInit {
  dialogTitle = 'Allotment History';
  reservationID: number;
  isLoading = true;
  dataSource: AllotmentHistoryRow[] = [];

  constructor(
    public dialogRef: MatDialogRef<AllotmentHistoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { reservationID?: number; row?: { reservationID?: number } },
    private allotmentHistoryService: AllotmentHistoryService,
    private cdr: ChangeDetectorRef,
    private datePipe: DatePipe
  ) {
    const fromRow = data?.row?.reservationID;
    const fromData = data?.reservationID;
    this.reservationID = Number(fromData ?? fromRow) || 0;
  }

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    if (!this.reservationID) {
      this.isLoading = false;
      this.dataSource = [];
      this.cdr.detectChanges();
      return;
    }

    this.isLoading = true;
    this.allotmentHistoryService.getAllotmentHistoryByReservation(this.reservationID).subscribe(
      (data: any) => {
        const rows = Array.isArray(data) ? data : [];
        this.dataSource = rows.map((row) => this.normalizeRow(row));
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      () => {
        this.dataSource = [];
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    );
  }

  private normalizeRow(row: any): AllotmentHistoryRow {
    if (!row) {
      return {};
    }
    return {
      reservationID: row.reservationID ?? row.ReservationID,
      allotmentID: row.allotmentID ?? row.AllotmentID,
      dateOfAllotment: row.dateOfAllotment ?? row.DateOfAllotment,
      timeofAllotment: row.timeofAllotment ?? row.TimeofAllotment,
      allotmentBy: row.allotmentBy ?? row.AllotmentBy,
      registrationNumber: row.registrationNumber ?? row.RegistrationNumber,
      vehicleName: row.vehicleName ?? row.VehicleName,
      vehicleCategoryName: row.vehicleCategoryName ?? row.VehicleCategoryName,
      driverName: row.driverName ?? row.DriverName,
      driverMobile: row.driverMobile ?? row.DriverMobile,
      supplierName: row.supplierName ?? row.SupplierName,
      supplierMobile: row.supplierMobile ?? row.SupplierMobile,
      driverSupplierName: row.driverSupplierName ?? row.DriverSupplierName,
      driverSupplierMobile: row.driverSupplierMobile ?? row.DriverSupplierMobile,
      allotmentType: row.allotmentType ?? row.AllotmentType,
      allotmentStatus: row.allotmentStatus ?? row.AllotmentStatus,
      dateOfCancellation: row.dateOfCancellation ?? row.DateOfCancellation,
      cancellationRemark: row.cancellationRemark ?? row.CancellationRemark,
      cancellationBy: row.cancellationBy ?? row.CancellationBy
    };
  }

  formatDate(value: string | Date): string {
    if (!value) {
      return 'N/A';
    }
    return this.datePipe.transform(value, 'dd-MMM-yy') || 'N/A';
  }

  formatTime(value: string | Date): string {
    if (!value) {
      return 'N/A';
    }
    return this.datePipe.transform(value, 'shortTime') || 'N/A';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
