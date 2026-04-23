// @ts-nocheck
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { EmailService } from '../core/email.service';
import { Email, EmailFolder } from '../core/email.model';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink,
    MatIconModule, 
    MatButtonModule, 
    MatCheckboxModule, 
    MatTooltipModule, 
    MatMenuModule, 
    FormsModule,
    BreadcrumbComponent
  ],
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit {
  private emailService = inject(EmailService);
  
  public emails: Email[] = [];
  public selectedEmail: Email | null = null;
  public activeFolder: string = 'inbox';
  public searchQuery: string = '';

  public folders: EmailFolder[] = [
    { id: 'inbox', name: 'Inbox', icon: 'inbox' },
    { id: 'sent', name: 'Sent', icon: 'send' },
    { id: 'drafts', name: 'Drafts', icon: 'drive_file_rename_outline' },
    { id: 'starred', name: 'Starred', icon: 'star_outline' },
    { id: 'important', name: 'Important', icon: 'label_important_outline' },
    { id: 'trash', name: 'Trash', icon: 'delete_outline' },
    { id: 'archive', name: 'Archive', icon: 'archive' },
  ];

  public breadscrums = [
    {
      title: 'Email',
      items: ['Apps'],
      active: 'Inbox',
    },
  ];

  ngOnInit(): void {
    this.loadEmails();
  }

  loadEmails(): void {
    this.emailService.emails$.subscribe(allEmails => {
      let filtered: Email[] = [];
      
      if (this.activeFolder === 'starred') {
        filtered = allEmails.filter(e => e.isStarred);
      } else if (this.activeFolder === 'important') {
        filtered = allEmails.filter(e => e.isImportant);
      } else {
        filtered = allEmails.filter(e => e.folder === this.activeFolder);
      }

      if (this.searchQuery) {
        filtered = filtered.filter(e => 
          e.subject.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          e.from.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          e.body.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
      this.emails = filtered;
    });
  }

  selectFolder(folderId: string): void {
    this.activeFolder = folderId;
    this.selectedEmail = null;
    this.loadEmails();
    this.breadscrums[0].active = this.folders.find(f => f.id === folderId)?.name || 'Inbox';
  }

  selectEmail(email: Email): void {
    this.selectedEmail = email;
    this.emailService.markAsRead(email.id);
  }

  toggleStar(event: Event, email: Email): void {
    event.stopPropagation();
    this.emailService.toggleStar(email.id);
  }

  deleteEmail(event: Event, email: Email): void {
    event.stopPropagation();
    this.emailService.deleteEmail(email.id);
    if (this.selectedEmail?.id === email.id) {
      this.selectedEmail = null;
    }
  }

  onSearch(): void {
    this.loadEmails();
  }
}

