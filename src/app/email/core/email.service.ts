// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Email, EmailFolder } from './email.model';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private _emails = new BehaviorSubject<Email[]>([]);
  public emails$ = this._emails.asObservable();

  private mockEmails: Email[] = [
    {
      id: 1,
      from: { name: 'Nelson Lane', email: 'nelson@example.com', avatar: 'assets/images/user/user1.jpg' },
      to: 'me@lorax.com',
      subject: 'Project Update - Phase 1 Completion',
      body: `Hi Team,<br><br>I'm happy to announce that we've completed Phase 1 of the Lorax project ahead of schedule. The client is extremely pleased with the progress.<br><br>Regards,<br>Nelson`,
      date: new Date('2024-01-07T12:30:00'),
      isRead: false,
      isStarred: true,
      isImportant: true,
      folder: 'inbox',
      label: 'Work',
      hasAttachment: true,
      attachments: [{ name: 'report.pdf', size: '1.2MB', type: 'pdf' }]
    },
    {
      id: 2,
      from: { name: 'Kerry Mann', email: 'kerry@example.com', avatar: 'assets/images/user/user2.jpg' },
      to: 'me@lorax.com',
      subject: 'Invited to: Team Lunch @ Friday',
      body: 'Hey everyone, let\'s get together for lunch this Friday at the new Italian place. Let me know if you can make it!',
      date: new Date('2024-01-06T09:15:00'),
      isRead: false,
      isStarred: false,
      isImportant: false,
      folder: 'inbox',
      label: 'Personal'
    },
    {
      id: 3,
      from: { name: 'Adam Peters', email: 'adam@example.com', avatar: 'assets/images/user/user3.jpg' },
      to: 'me@lorax.com',
      subject: 'New Order Confirmation #88291',
      body: 'Thank you for your purchase. Your order has been received and is being processed.',
      date: new Date('2024-01-05T15:45:00'),
      isRead: true,
      isStarred: false,
      isImportant: false,
      folder: 'inbox',
      label: 'Shop'
    },
    {
      id: 4,
      from: { name: 'Lula Reese', email: 'lula@example.com', avatar: 'assets/images/user/user4.jpg' },
      to: 'me@lorax.com',
      subject: 'Family Reunion Photos',
      body: 'Check out these photos from last weekend! It was so good to see everyone.',
      date: new Date('2024-01-04T10:20:00'),
      isRead: true,
      isStarred: true,
      isImportant: false,
      folder: 'inbox',
      label: 'Family'
    },
    {
      id: 5,
      from: { name: 'Emma Wilson', email: 'emma@example.com', avatar: 'assets/images/user/user5.jpg' },
      to: 'me@lorax.com',
      subject: 'Draft: Marketing Strategy 2024',
      body: 'This is the initial draft for the marketing strategy. Please review and provide feedback.',
      date: new Date('2024-01-07T11:00:00'),
      isRead: true,
      isStarred: false,
      isImportant: true,
      folder: 'drafts',
      label: 'Work'
    },
    {
      id: 6,
      from: { name: 'Support Team', email: 'support@cloud.com' },
      to: 'me@lorax.com',
      subject: 'Password Reset Successful',
      body: 'Your password has been changed successfully. If you did not perform this action, please contact us immediately.',
      date: new Date('2024-01-03T14:30:00'),
      isRead: true,
      isStarred: false,
      isImportant: false,
      folder: 'sent'
    },
    {
      id: 7,
      from: { name: 'Spam Bot', email: 'spam@bot.com' },
      to: 'me@lorax.com',
      subject: 'You Won A Prize!',
      body: 'Click here to claim your $1000 gift card immediately!!!',
      date: new Date('2024-01-01T08:00:00'),
      isRead: false,
      isStarred: false,
      isImportant: false,
      folder: 'trash'
    }
  ];

  constructor() {
    this._emails.next(this.mockEmails);
  }

  getEmailsByFolder(folder: string): Observable<Email[]> {
    return this.emails$.pipe(
      map(emails => emails.filter(e => e.folder === folder))
    );
  }

  toggleStar(id: number): void {
    const emails = this._emails.getValue();
    const index = emails.findIndex(e => e.id === id);
    if (index !== -1) {
      emails[index].isStarred = !emails[index].isStarred;
      this._emails.next([...emails]);
    }
  }

  markAsRead(id: number): void {
    const emails = this._emails.getValue();
    const index = emails.findIndex(e => e.id === id);
    if (index !== -1 && !emails[index].isRead) {
      emails[index].isRead = true;
      this._emails.next([...emails]);
    }
  }

  deleteEmail(id: number): void {
    const emails = this._emails.getValue();
    const index = emails.findIndex(e => e.id === id);
    if (index !== -1) {
      if (emails[index].folder === 'trash') {
        emails.splice(index, 1);
      } else {
        emails[index].folder = 'trash';
      }
      this._emails.next([...emails]);
    }
  }
}

