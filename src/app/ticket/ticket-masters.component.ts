// @ts-nocheck
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TicketService } from './ticket.service';

@Component({
  standalone: false,
  selector: 'app-ticket-masters',
  templateUrl: './ticket-masters.component.html'
})
export class TicketMastersComponent implements OnInit {
  applications: any[] = [];
  developers: any[] = [];
  leads: any[] = [];
  targets: any[] = [];
  applicationName = '';
  developerName = '';
  leadName = '';

  constructor(private tickets: TicketService, private snack: MatSnackBar) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.tickets.masters().subscribe(
      (data) => {
        if (data && data.ok === false) {
          this.snack.open(data.message || 'Application data could not be loaded.', 'Close', { duration: 4000 });
          return;
        }
        this.applications = data?.applications || [];
        this.developers = data?.developers || [];
        this.leads = data?.leads || [];
        this.targets = data?.targets || [];
      },
      (error) => this.snack.open(this.tickets.errorMessage(error), 'Close', { duration: 4000 })
    );
  }

  saveApplication(): void {
    this.tickets.saveApplication(this.applicationName).subscribe(
      () => {
        this.applicationName = '';
        this.load();
      },
      (error) => this.snack.open(this.tickets.errorMessage(error), 'Close', { duration: 4000 })
    );
  }

  saveDeveloper(): void {
    this.tickets.saveDeveloper(this.developerName).subscribe(
      () => {
        this.developerName = '';
        this.load();
      },
      (error) => this.snack.open(this.tickets.errorMessage(error), 'Close', { duration: 4000 })
    );
  }

  saveLead(): void {
    this.tickets.saveLead(this.leadName).subscribe(
      () => {
        this.leadName = '';
        this.load();
      },
      (error) => this.snack.open(this.tickets.errorMessage(error), 'Close', { duration: 4000 })
    );
  }

  saveTarget(row: any): void {
    this.tickets.saveTarget(row.priorityName, Number(row.resolutionMinutes)).subscribe(
      (result) => this.snack.open(result.message, 'Close', { duration: 3000 }),
      (error) => this.snack.open(this.tickets.errorMessage(error), 'Close', { duration: 4000 })
    );
  }
}
