// @ts-nocheck
import { Component, Input, Output, EventEmitter } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDivider } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

export interface ColumnDefinition {
  def: string;
  label: string;
  visible?: boolean;
}

@Component({
  standalone: false,
  selector: 'app-table-show-hide-column',
  imports: [
    FormsModule,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatDivider,
    MatButtonModule,
  ],
  templateUrl: './table-show-hide-column.component.html',
  styleUrl: './table-show-hide-column.component.scss',
})
export class TableShowHideColumnComponent {
  @Input() columnDefinitions: ColumnDefinition[] = [];
  @Output() columnVisibilityChange = new EventEmitter<void>();

  onVisibilityChange() {
    this.columnVisibilityChange.emit();
  }

  trackBy(_index: number, item: ColumnDefinition) {
    return item.def;
  }
}


