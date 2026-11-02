import { Component, OnInit } from '@angular/core';
import { KaptureTicketService } from './kaptureTicket.service';
import { KaptureTicket } from './kaptureTicket.model';

@Component({
  selector: 'app-kaptureTicket',
  templateUrl: './kaptureTicket.component.html',
  styleUrls: ['./kaptureTicket.component.sass'],
  standalone: false
})
export class KaptureTicketComponent implements OnInit {
  dataSource: KaptureTicket[] = [];
  displayedColumns = [
    'kaptureTicketId',
    'ticketId',
    'emailSubject',
    'customerEmail',
    'ticketCreatedOn',
    'ticketStatus',
    'ticketSubStatus',
    'assignedAgent',
    'folderCategory',
    'createdOn'
  ];
  SearchFromDate: Date | null = null;
  SearchToDate: Date | null = null;
  SearchTicketId = '';
  SearchEmail = '';
  pageNumber = 1;
  loading = false;
  loadError = '';

  constructor(private kaptureTicketService: KaptureTicketService) {}

  ngOnInit(): void {
    this.loadData();
  }

  SearchData(): void {
    this.pageNumber = 1;
    this.loadData();
  }

  refresh(): void {
    this.SearchFromDate = null;
    this.SearchToDate = null;
    this.SearchTicketId = '';
    this.SearchEmail = '';
    this.pageNumber = 1;
    this.loadData();
  }

  previousPage(): void {
    if (this.pageNumber <= 1) {
      return;
    }
    this.pageNumber -= 1;
    this.loadData();
  }

  nextPage(): void {
    if (this.dataSource.length < 50) {
      return;
    }
    this.pageNumber += 1;
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.loadError = '';
    this.kaptureTicketService.getTableData(
      this.formatDate(this.SearchFromDate),
      this.formatDate(this.SearchToDate),
      this.SearchTicketId.trim(),
      this.SearchEmail.trim(),
      this.pageNumber
    ).subscribe({
      next: (rows) => {
        this.dataSource = rows || [];
        this.loading = false;
      },
      error: () => {
        this.dataSource = [];
        this.loading = false;
        this.loadError = 'Kapture tickets could not be loaded.';
      }
    });
  }

  displayDate(value: string): string {
    if (!value) {
      return '';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return String(value).substring(0, 16);
    }
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return day + '-' + month + '-' + date.getFullYear();
  }

  private formatDate(value: Date | null): string {
    if (!value) {
      return '';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '';
    }
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return date.getFullYear() + '-' + month + '-' + day;
  }
}
