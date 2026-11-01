// @ts-nocheck
import { Component, OnInit } from '@angular/core';
import { TicketService } from './ticket.service';

@Component({
  standalone: false,
  selector: 'app-ticket-dashboard',
  templateUrl: './ticket-dashboard.component.html'
})
export class TicketDashboardComponent implements OnInit {
  counts: any[] = [];
  workload: any[] = [];
  actor: any = {};
  statuses = ['New', 'Assigned', 'Dev In Progress', 'Dev Complete', 'Ready for Testing', 'Testing In Progress', 'On Hold', 'Resolved', 'Closed', 'Reopened'];

  constructor(private tickets: TicketService) {}

  ngOnInit(): void {
    this.tickets.dashboard().subscribe((data) => {
      this.actor = data?.actor || {};
      this.counts = data?.counts || [];
      this.workload = data?.workload || [];
    });
  }

  total(status: string): number {
    const row = this.counts.find((item) => item.statusName === status);
    return row ? row.total : 0;
  }
}
