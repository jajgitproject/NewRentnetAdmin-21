// @ts-nocheck
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TicketService } from './ticket.service';

@Component({
  standalone: false,
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.component.html'
})
export class TicketDetailComponent implements OnInit {
  ticketId = 0;
  actor: any = {};
  ticket: any = null;
  cycles: any[] = [];
  finishes: any[] = [];
  history: any[] = [];
  remarks: any[] = [];
  assignments: any[] = [];
  attachments: any[] = [];
  people: any[] = [];
  assigneeId = '';
  note = '';
  remark = '';
  statusRemark = '';
  correct = false;
  correctStatus = '';
  priorityName = '';
  priorityReason = '';
  statuses = ['New', 'Assigned', 'Dev In Progress', 'Dev Complete', 'Ready for Testing', 'Testing In Progress', 'On Hold', 'Resolved', 'Closed', 'Reopened'];
  moves: any = {
    New: [],
    Assigned: ['Dev In Progress'],
    'Dev In Progress': ['On Hold', 'Dev Complete'],
    'On Hold': ['Dev In Progress'],
    'Dev Complete': ['Ready for Testing'],
    'Ready for Testing': ['Testing In Progress'],
    'Testing In Progress': ['Resolved', 'Dev In Progress'],
    Resolved: ['Closed', 'Reopened'],
    Closed: ['Reopened'],
    Reopened: ['Dev In Progress']
  };

  constructor(private route: ActivatedRoute, private tickets: TicketService, private snack: MatSnackBar) {}

  ngOnInit(): void {
    this.ticketId = Number(this.route.snapshot.paramMap.get('id'));
    this.load();
  }

  load(): void {
    this.tickets.detail(this.ticketId).subscribe(
      (data) => {
        if (!data || data.ok === false) {
          this.snack.open(data?.message || 'Ticket was not found.', 'Close', { duration: 4000 });
          return;
        }
        this.actor = data.actor || {};
        this.ticket = data.ticket;
        this.cycles = data.cycles || [];
        this.finishes = data.finishes || [];
        this.history = data.history || [];
        this.remarks = data.remarks || [];
        this.assignments = data.assignments || [];
        this.attachments = data.attachments || [];
        this.priorityName = this.ticket?.priorityName;
        this.correctStatus = this.ticket?.statusName || '';
        if (this.actor.canAssign) {
          this.tickets.assignees(this.ticketId).subscribe((people) => (this.people = people?.rows || []));
        }
      },
      (error) => this.snack.open(this.tickets.errorMessage(error), 'Close', { duration: 4000 })
    );
  }

  canSetAnyStatus(): boolean {
    if (this.actor?.canSetAnyStatus) {
      return true;
    }
    const role = String(this.actor?.role || '');
    return role === 'Admin' || role === 'Lead' || role === 'Lead Developer';
  }

  isAssignedDeveloper(): boolean {
    const role = String(this.actor?.role || '');
    if (role !== 'Developer' && role !== 'Junior Developer') {
      return false;
    }
    const id = Number(this.actor?.employeeID || 0);
    if (!id) {
      return false;
    }
    return id === Number(this.ticket?.assigneeEmployeeID || 0) || id === Number(this.ticket?.devAssigneeEmployeeID || 0);
  }

  nextStatuses(): string[] {
    const current = this.ticket?.statusName;
    if (this.canSetAnyStatus()) {
      return this.statuses.filter((status) => status !== current);
    }
    if (this.isAssignedDeveloper() && current !== 'Closed') {
      const own = ['On Hold', 'Dev Complete', 'Dev In Progress'].filter((status) => status !== current);
      if (current === 'Dev Complete') {
        own.push('Ready for Testing');
      }
      return own;
    }
    return this.moves[current] || [];
  }

  assign(): void {
    this.tickets.assign({ ticketID: this.ticketId, assigneeEmployeeID: Number(this.assigneeId), note: this.note }).subscribe(
      (result) => {
        this.snack.open(result.message, 'Close', { duration: 3000 });
        this.note = '';
        this.load();
      },
      (error) => this.snack.open(this.tickets.errorMessage(error), 'Close', { duration: 4000 })
    );
  }

  move(toStatus: string): void {
    this.tickets.status({ ticketID: this.ticketId, toStatus, remark: this.statusRemark, correct: this.canSetAnyStatus(), assigneeEmployeeID: Number(this.assigneeId) || 0 }).subscribe(
      () => {
        this.statusRemark = '';
        this.load();
      },
      (error) => this.snack.open(this.tickets.errorMessage(error), 'Close', { duration: 4000 })
    );
  }

  correctMove(): void {
    this.tickets.status({ ticketID: this.ticketId, toStatus: this.correctStatus, remark: this.statusRemark, correct: true, assigneeEmployeeID: Number(this.assigneeId) || 0 }).subscribe(
      (result) => {
        this.snack.open(result?.message || 'Status updated.', 'Close', { duration: 3000 });
        this.statusRemark = '';
        this.load();
      },
      (error) => this.snack.open(this.tickets.errorMessage(error), 'Close', { duration: 4000 })
    );
  }

  addRemark(): void {
    this.tickets.remark(this.remark, this.ticketId).subscribe(
      () => {
        this.remark = '';
        this.load();
      },
      (error) => this.snack.open(this.tickets.errorMessage(error), 'Close', { duration: 4000 })
    );
  }

  savePriority(): void {
    this.tickets.priority({ ticketID: this.ticketId, priorityName: this.priorityName, reason: this.priorityReason }).subscribe(
      (result) => {
        this.snack.open(result.message, 'Close', { duration: 3000 });
        this.load();
      },
      (error) => this.snack.open(this.tickets.errorMessage(error), 'Close', { duration: 4000 })
    );
  }

  onFile(event: any): void {
    const file = event?.target?.files?.[0];
    if (!file) {
      return;
    }
    this.tickets.upload(this.ticketId, file).subscribe(
      () => this.load(),
      (error) => this.snack.open(this.tickets.errorMessage(error), 'Close', { duration: 4000 })
    );
  }

  fileUrl(id: number): string {
    return this.tickets.attachmentUrl(id);
  }

  onTime(row: any): boolean {
    return row.onTime === true || row.onTime === 1;
  }
}
