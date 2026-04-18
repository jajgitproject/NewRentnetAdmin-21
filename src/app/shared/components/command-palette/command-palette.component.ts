// @ts-nocheck
import { Component, HostListener, ElementRef, ViewChild, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

export interface Command {
  id: string;
  title: string;
  icon: string;
  action?: () => void;
  route?: string;
  group: string;
}

@Component({
  selector: 'app-command-palette',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './command-palette.component.html',
  styleUrls: ['./command-palette.component.scss']
})
export class CommandPaletteComponent {
  isOpen = signal(false);
  query = signal('');
  selectedIndex = signal(0);
  
  private router = inject(Router);

  commands: Command[] = [
    { id: '1', title: 'Go to Dashboard', icon: 'dashboard', route: '/dashboard/main', group: 'Navigation' },
    { id: '2', title: 'Kanban Board', icon: 'view_kanban', route: '/kanban', group: 'Navigation' },
    { id: '3', title: 'Tasks', icon: 'check_circle', route: '/task', group: 'Navigation' },
    { id: '4', title: 'Profile', icon: 'person', route: '/extra-pages/profile', group: 'Navigation' },
    { id: '5', title: 'Calendar', icon: 'calendar_today', route: '/calendar', group: 'Navigation' },
    { id: '6', title: 'Create New Task', icon: 'add', action: () => alert('New Task Action'), group: 'Actions' },
    { id: '7', title: 'Toggle Dark Mode', icon: 'dark_mode', action: () => alert('Toggle Theme Action'), group: 'Actions' },
  ];

  filteredCommands = signal<Command[]>(this.commands);

  @ViewChild('searchInput') searchInput!: ElementRef;

  constructor() {
    effect(() => {
        const q = this.query().toLowerCase();
        this.filteredCommands.set(
            this.commands.filter(c => c.title.toLowerCase().includes(q))
        );
        this.selectedIndex.set(0); 
    });
  }

  @HostListener('window:keydown.control.k', ['$event'])
  @HostListener('window:keydown.meta.k', ['$event'])
  onCtrlK(event: Event) {
    event.preventDefault();
    this.isOpen.set(!this.isOpen());
    if (this.isOpen()) {
      setTimeout(() => this.searchInput.nativeElement.focus(), 100);
    }
  }

  @HostListener('window:keydown.escape')
  onEscape() {
    this.isOpen.set(false);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.isOpen()) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.selectedIndex.update(i => Math.min(i + 1, this.filteredCommands().length - 1));
    } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        this.selectedIndex.update(i => Math.max(i - 1, 0));
    } else if (event.key === 'Enter') {
        event.preventDefault();
        this.executeCommand(this.filteredCommands()[this.selectedIndex()]);
    }
  }

  executeCommand(command: Command) {
    if (command.route) {
      this.router.navigate([command.route]);
    } else if (command.action) {
      command.action();
    }
    this.isOpen.set(false);
    this.query.set('');
  }
    
  onBackdropClick(event: MouseEvent) {
      if ((event.target as HTMLElement).classList.contains('command-palette-backdrop')) {
          this.isOpen.set(false);
      }
  }
}

