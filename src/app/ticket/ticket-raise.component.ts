// @ts-nocheck
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TicketService } from './ticket.service';

@Component({
  standalone: false,
  selector: 'app-ticket-raise',
  templateUrl: './ticket-raise.component.html'
})
export class TicketRaiseComponent implements OnInit {
  applications: any[] = [];
  loaded = false;
  canMasters = false;
  form: any = {
    ticketType: 'Bug',
    ticketApplicationID: '',
    title: '',
    description: '',
    priorityName: 'Highest - 1'
  };

  constructor(private tickets: TicketService, private snack: MatSnackBar, private router: Router) {}

  ngOnInit(): void {
    this.tickets.context().subscribe((actor) => {
      this.canMasters = !!(actor && actor.canMasters);
    });
    this.tickets.masters().subscribe(
      (data) => {
        this.applications = (data?.applications || []).filter((item) => this.tickets.isActive(item));
        this.loaded = true;
      },
      (error) => {
        this.loaded = true;
        this.snack.open(this.tickets.errorMessage(error), 'Close', { duration: 4000 });
      }
    );
  }

  save(): void {
    this.tickets.create(this.form).subscribe(
      (result) => {
        this.snack.open(result.ticketNo + ' created.', 'Close', { duration: 3000 });
        this.router.navigate(['/ticket', result.ticketID]);
      },
      (error) => this.snack.open(this.tickets.errorMessage(error), 'Close', { duration: 4000 })
    );
  }
}
