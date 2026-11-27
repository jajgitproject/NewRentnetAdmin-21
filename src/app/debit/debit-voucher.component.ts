// @ts-nocheck
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DebitService } from './debit.service';
import { GeneralService } from '../general/general.service';
import { AuthService } from '../core/service/auth.service';
import { amountInWords, formatVoucherDate, pickDebitField } from './debit-voucher.utils';

@Component({
  standalone: false,
  selector: 'app-debit-voucher',
  templateUrl: './debit-voucher.component.html',
  styleUrls: ['./debit-voucher.component.scss'],
})
export class DebitVoucherComponent implements OnInit {
  loading = true;
  error = '';
  debitId = 0;
  voucher: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private debitService: DebitService,
    private generalService: GeneralService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const paramSource = this.route.parent?.paramMap ?? this.route.paramMap;
    paramSource.subscribe((params) => {
      const id = Number(params.get('debitId'));
      if (!id) {
        this.error = 'Invalid debit reference.';
        this.loading = false;
        return;
      }
      this.debitId = id;
      this.loadVoucher(id);
    });
  }

  loadVoucher(debitId: number): void {
    this.loading = true;
    this.error = '';
    this.debitService.getById(debitId).subscribe(
      (data) => {
        if (!data) {
          this.error = 'Debit record not found.';
          this.voucher = null;
          this.loading = false;
          return;
        }
        this.voucher = this.buildVoucherView(data);
        this.loading = false;
      },
      () => {
        this.error = 'Unable to load debit voucher.';
        this.voucher = null;
        this.loading = false;
      }
    );
  }

  buildVoucherView(raw: any): any {
    const amount = Number(pickDebitField(raw, 'amount', 'Amount') ?? 0);
    const driverName = (pickDebitField(raw, 'driverName', 'DriverName') || '').toString().trim();
    const driverId = pickDebitField(raw, 'driverID', 'DriverID');
    const supplierName = (pickDebitField(raw, 'supplierName', 'SupplierName') || '').toString().trim();
    const supplierId = pickDebitField(raw, 'supplierID', 'SupplierID');
    const regNo = (pickDebitField(raw, 'registrationNumber', 'RegistrationNumber') || '').toString().trim();
    const narration = (pickDebitField(raw, 'narration', 'Narration') || '').toString().trim();
    const debitType = (pickDebitField(raw, 'debitType', 'DebitType') || '').toString().trim();

    return {
      debitID: pickDebitField(raw, 'debitID', 'DebitID'),
      voucherDate: formatVoucherDate(pickDebitField(raw, 'dateString', 'DateString', 'date', 'Date')),
      amount,
      amountDisplay: amount.toFixed(2),
      amountWords: amountInWords(amount),
      carNo: regNo || '—',
      supplierName: supplierName || '—',
      supplierVoucherLabel: this.supplierVoucherLabel(supplierName, supplierId),
      driverVoucherLabel: this.driverVoucherLabel(driverName, driverId),
      particularsLine1: `Amount Paid to Driver ${this.driverVoucherLabel(driverName, driverId)}`,
      particularsLine2: `of Supplier ${this.supplierVoucherLabel(supplierName, supplierId)}`,
      debitType,
      narration,
      accountantName: this.getLoggedInUserDisplayName(),
    };
  }

  driverVoucherLabel(name: string, id: any): string {
    const n = (name || '').trim();
    if (n && id) {
      return `${n}__${id}`;
    }
    return n || (id ? String(id) : '');
  }

  supplierVoucherLabel(name: string, id: any): string {
    const n = (name || '').trim();
    if (n && id) {
      return `${n}${id}`;
    }
    return n || (id ? String(id) : '');
  }

  getLoggedInUserDisplayName(): string {
    try {
      const currentUser =
        this.authService?.currentUserValue ?? JSON.parse(localStorage.getItem('currentUser') || '{}');
      const employee = currentUser?.employee ?? currentUser?.Employee;
      if (!employee) {
        return '';
      }
      const first = (employee.firstName ?? employee.FirstName ?? '').toString().trim();
      const last = (employee.lastName ?? employee.LastName ?? '').toString().trim();
      const full = `${first} ${last}`.trim();
      const legacy = (employee.oldRentnetCode ?? employee.OldRentnetCode ?? employee.userName ?? employee.UserName ?? '')
        .toString()
        .trim();
      if (full && legacy) {
        return `${full.toLowerCase().replace(/\s+/g, '__')}__${legacy}`;
      }
      if (full) {
        return full;
      }
      return legacy || '';
    } catch {
      return '';
    }
  }

  static voucherUrl(debitId: number): string {
    return `${window.location.origin}/#/debitVoucher/${debitId}`;
  }

  print(): void {
    const previousTitle = document.title;
    document.title = `Debit Voucher ${this.debitId || ''}`;
    const restore = () => {
      document.title = previousTitle;
      window.removeEventListener('afterprint', restore);
    };
    window.addEventListener('afterprint', restore);
    setTimeout(() => window.print(), 0);
  }

  backToDebitList(): void {
    try {
      if (window.opener && !window.opener.closed) {
        window.opener.location.hash = '#/debit';
        window.close();
        return;
      }
    } catch {
      /* cross-window access */
    }
    this.router.navigateByUrl('/debit');
  }
}