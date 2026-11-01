// @ts-nocheck
import { Component, OnInit } from '@angular/core';
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
  applications: any[] = [];
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
