// @ts-nocheck
import { Component, ViewChild } from '@angular/core';
import { BoardComponent } from './board/board.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  standalone: false,
  selector: 'app-kanbans',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.scss'],
  providers: [],
  imports: [
    MatTooltipModule,
    MatIconModule,
    MatButtonModule,
    BoardComponent,
    MatMenuModule,
  ],
})
export class kanbansComponent {
  public title = 'Oh My Kanban!';

  @ViewChild(BoardComponent)
  boardComponent!: BoardComponent;
}


