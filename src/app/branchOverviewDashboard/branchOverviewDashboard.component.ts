// @ts-nocheck

import { Component, OnDestroy, OnInit } from '@angular/core';

import { FormControl } from '@angular/forms';

import { Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';

import { Subscription, timer } from 'rxjs';

import { MAT_DATE_LOCALE } from '@angular/material/core';

import moment from 'moment';

import { AuthService } from '../core/service/auth.service';



interface BranchOption {

  branchID: number;

  branchName: string;

}



@Component({

  standalone: false,

  selector: 'app-branch-overview-dashboard',

  templateUrl: './branchOverviewDashboard.component.html',

  styleUrls: ['./branchOverviewDashboard.component.scss'],

  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],

})

export class BranchOverviewDashboardComponent implements OnInit, OnDestroy {

  branchID: number | null = null;

  branchName = '';

  showAllLocation = false;

  branches: BranchOption[] = [];

  showBranchSelector = false;

  noBranchAssigned = false;



  displayDate = moment().format('DD-MMM-YYYY');

  shiftLabel = 'General (06:00 AM - 06:00 PM)';



  filterDate = new FormControl<Date>(new Date());

  branchFilter = new FormControl<number | null>(null);

  customerFilter = new FormControl<string>('all');

  dutyTypeFilter = new FormControl<string>('all');

  shiftFilter = new FormControl<string>('all');



  totalBooking = 245;

  cancelled = 18;

  tnc = 12;

  totalAllotted = 210;

  lateAllotted = 14;

  totalOwned = 125;

  totalSupplier = 85;

  lateDispatch = 8;

  notVerified = 11;

  totalDispute = 6;



  supplierDonutSeries = [40, 25, 20];

  supplierDonutLabels = ['Dedicated', 'VDP', 'On Call'];

  supplierDonutColors = ['#7c4dff', '#2196f3', '#ff9800'];



  donutChart = {

    type: 'donut',

    height: 165,

    width: 150,

    toolbar: { show: false },

    fontFamily: 'inherit',

  };



  donutPlotOptions = {

    pie: {

      donut: {

        size: '68%',

        labels: {

          show: true,

          name: { show: true },

          value: { show: true },

          total: {

            show: true,

            label: 'Supplier',

            formatter: () => String(this.totalSupplier),

          },

        },

      },

    },

  };



  donutLegend = { show: false };



  donutDataLabels = { enabled: false };



  private refreshSub: Subscription;



  constructor(

    private router: Router,

    private snackBar: MatSnackBar,

    private authService: AuthService

  ) {}



  ngOnInit(): void {

    this.initBranchFromLogin();

    this.refreshSub = timer(30000, 30000).subscribe(() => this.onAutoRefresh());

  }



  ngOnDestroy(): void {

    this.refreshSub?.unsubscribe();

  }



  initBranchFromLogin(): void {

    const emp = this.authService.currentUserValue?.employee;

    if (!emp) {

      this.noBranchAssigned = true;

      this.branchName = 'No branch assigned';

      return;

    }



    this.showAllLocation = !!(emp.ShowAllLocation ?? emp.showAllLocation);

    const rawBranches = emp.Branches ?? emp.branches ?? [];

    this.branches = (Array.isArray(rawBranches) ? rawBranches : [])

      .map((b) => ({

        branchID: b.BranchID ?? b.branchID,

        branchName: b.BranchName ?? b.branchName ?? '',

      }))

      .filter((b) => b.branchID != null && b.branchName);



    const defaultBranch = emp.DefaultBranch ?? emp.defaultBranch;

    const selected =

      defaultBranch != null

        ? {

            branchID: defaultBranch.BranchID ?? defaultBranch.branchID,

            branchName: defaultBranch.BranchName ?? defaultBranch.branchName ?? '',

          }

        : this.branches[0] ?? null;



    if (selected?.branchID != null) {

      this.applySelectedBranch(selected.branchID, selected.branchName);

    } else {

      this.noBranchAssigned = true;

      this.branchName = 'No branch assigned';

    }



    this.showBranchSelector = this.showAllLocation || this.branches.length > 1;

  }



  onBranchChange(): void {

    const id = this.branchFilter.value;

    const branch = this.branches.find((b) => b.branchID === id);

    if (branch) {

      this.applySelectedBranch(branch.branchID, branch.branchName);

    }

  }



  private applySelectedBranch(branchID: number, branchName: string): void {

    this.branchID = branchID;

    this.branchName = branchName;

    this.branchFilter.setValue(branchID, { emitEvent: false });

    this.noBranchAssigned = false;

  }



  onApplyFilters(): void {

    const d = this.filterDate.value;

    this.displayDate = d ? moment(d).format('DD-MMM-YYYY') : this.displayDate;

    const branchHint =

      this.branchID != null ? ` (branch ID ${this.branchID})` : '';

    this.snackBar.open(

      `Filters applied${branchHint} — dummy data unchanged`,

      'OK',

      { duration: 2500 }

    );

  }



  onAutoRefresh(): void {

    // Dummy periodic refresh — data unchanged for demo

  }



  onManualRefresh(): void {

    this.snackBar.open('Dashboard refreshed', '', { duration: 1500 });

  }



  onBackdropClick(event: MouseEvent): void {

    if (event.target === event.currentTarget) {

      this.onClose();

    }

  }



  onClose(): void {

    this.router.navigate(['/dashboard/main']);

  }



  supplierLegendPct(i: number): string {

    const sum = this.supplierDonutSeries.reduce((a, b) => a + b, 0);

    const v = this.supplierDonutSeries[i];

    return sum ? Math.round((v / sum) * 100) + '%' : '0%';

  }

}


