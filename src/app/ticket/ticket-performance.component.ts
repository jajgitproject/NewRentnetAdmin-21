// @ts-nocheck
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TicketService } from './ticket.service';

@Component({
  standalone: false,
  selector: 'app-ticket-performance',
  templateUrl: './ticket-performance.component.html'
})
export class TicketPerformanceComponent implements OnInit {
  fromDate = '';
  toDate = '';
  summary: any[] = [];
  tickets: any[] = [];
  selectedId = 0;

  constructor(private api: TicketService, private snack: MatSnackBar) {}

  ngOnInit(): void {}

  load(): void {
    this.api.performance(this.fromDate, this.toDate).subscribe(
      (data) => {
        if (!data || data.ok === false) {
          this.snack.open(data?.message || 'Choose a date range.', 'Close', { duration: 4000 });
          return;
        }
        this.summary = data.summary || [];
        this.tickets = data.tickets || [];
        this.selectedId = 0;
      },
      (error) => this.snack.open(this.api.errorMessage(error), 'Close', { duration: 4000 })
    );
  }

  show(employeeId: number): void {
    this.selectedId = employeeId;
  }

  visibleTickets(): any[] {
    if (!this.selectedId) {
      return this.tickets;
    }
    return this.tickets.filter((row) => row.employeeID === this.selectedId);
  }

  onTime(row: any): boolean {
    return row.onTime === true || row.onTime === 1;
  }
}
