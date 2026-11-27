// @ts-nocheck
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TicketService } from './ticket.service';

@Component({
  standalone: false,
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html'
})
export class TicketListComponent implements OnInit {
  actor: any = {};
  rows: any[] = [];
  pagedRows: any[] = [];
  applications: any[] = [];
  readonly pageSize = 25;
  readonly pageSizeOptions = [25];
  pageIndex = 0;
  filters: any = {
    status: '',
    priority: '',
    ticketType: '',
    ticketNo: '',
    openFrom: '',
    openTo: '',
    closeFrom: '',
    closeTo: '',
    reopenedMoreThanOnce: false,
    lateOnly: false,
    applicationId: ''
  };
  statuses = ['New', 'Assigned', 'Dev In Progress', 'Dev Complete', 'Ready for Testing', 'Testing In Progress', 'On Hold', 'Resolved', 'Closed', 'Reopened'];

  constructor(private tickets: TicketService, private snack: MatSnackBar) {}

  ngOnInit(): void {
    this.tickets.context().subscribe(
      (actor) => (this.actor = actor || {}),
      (error) => this.snack.open(this.tickets.errorMessage(error), 'Close', { duration: 4000 })
    );
    this.tickets.masters().subscribe(
      (data) => (this.applications = (data?.applications || []).filter((item) => this.tickets.isActive(item))),
      (error) => this.snack.open(this.tickets.errorMessage(error), 'Close', { duration: 4000 })
    );
    this.search();
  }

  search(): void {
    this.tickets.list(this.filters).subscribe(
      (data) => {
        if (data && data.ok === false) {
          this.snack.open(data.message, 'Close', { duration: 4000 });
          return;
        }
        this.rows = data?.rows || [];
        this.pageIndex = 0;
        this.applyPage();
      },
      (error) => this.snack.open(this.tickets.errorMessage(error), 'Close', { duration: 4000 })
    );
  }

  reset(): void {
    this.filters = {
      status: '',
      priority: '',
      ticketType: '',
      ticketNo: '',
      openFrom: '',
      openTo: '',
      closeFrom: '',
      closeTo: '',
      reopenedMoreThanOnce: false,
      lateOnly: false,
      applicationId: ''
    };
    this.search();
  }

  onPage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.applyPage();
  }

  private applyPage(): void {
    const maxPage = Math.max(0, Math.ceil(this.rows.length / this.pageSize) - 1);
    if (this.pageIndex > maxPage) {
      this.pageIndex = maxPage;
    }
    const start = this.pageIndex * this.pageSize;
    this.pagedRows = this.rows.slice(start, start + this.pageSize);
  }

  mark(row: any): string {
    if (row.latestOnTime === true || row.latestOnTime === 1) {
      return 'On time';
    }
    if (row.latestOnTime === false || row.latestOnTime === 0) {
      return 'Late';
    }
    return '';
  }
}
