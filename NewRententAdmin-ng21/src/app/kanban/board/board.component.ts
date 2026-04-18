// @ts-nocheck
import { Component, OnInit, inject } from '@angular/core';
import {
  CdkDragDrop,
  CdkDropList,
  CdkDrag,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Kanban, KanbanStatus } from '../core/kanban.model';
import { KanbanDialogComponent } from '../crud-dialog/crud-dialog.component';
import { TaskDetailComponent } from '../task-detail/task-detail.component';
import { Direction } from '@angular/cdk/bidi';
import { TruncatePipe } from '../core/pipes';
import { DatePipe, KeyValuePipe, NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LocalStorageService } from '@shared/services'; // Added import
import { KanbanService } from '../core/kanban.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  standalone: false,
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  imports: [
    CdkDropList,
    CdkDrag,
    MatProgressBarModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    DatePipe,
    KeyValuePipe,
    TruncatePipe,
    NgClass,
    MatTooltipModule,
  ],
})
export class BoardComponent implements OnInit {
  private kanbanService = inject(KanbanService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private localStorageService = inject(LocalStorageService);

  public lists: object;

  constructor() {
    this.lists = {};
  }

  public ngOnInit(): void {
    this.kanbanService.getObjects().subscribe((kanbans: Kanban[]) => {
      // split kanban to status categories
      this.lists = {
        NEWTASK: kanbans.filter(
          (kanban) => kanban.status === KanbanStatus.NEWTASK
        ),
        RUNNING: kanbans.filter(
          (kanban) => kanban.status === KanbanStatus.RUNNING
        ),
        ONHOLD: kanbans.filter(
          (kanban) => kanban.status === KanbanStatus.ONHOLD
        ),
        FINISHED: kanbans.filter(
          (kanban) => kanban.status === KanbanStatus.FINISHED
        ),
      };
    });
  }

  unsorted = (): number => {
    return 0;
  };
  public drop(event: CdkDragDrop<Kanban[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      const kanban = event.container.data[event.currentIndex];
      kanban.status =
        KanbanStatus[event.container.id as keyof typeof KanbanStatus];
      this.kanbanService.updateObject(kanban);
    }
  }

  public addKanban(name: string, status: string): void {
    if (!/\S/.test(name)) {
      // do not add kanban if name is empty or contain white spaces only
      return;
    }
    const newKanban = new Kanban(
      0,
      name,
      KanbanStatus[status as keyof typeof KanbanStatus] as unknown as number
    );
    this.kanbanService.createOject(newKanban);
  }

  public removeKanban(kanban: Kanban): void {
    // show "deleted" info
    // const snack = this.snackBar.open("The Kanban has been deleted", "Undo");
    const snack = this.snackBar.open(
      'Kanban deleted Successfully...!!!',
      'Undo',
      {
        duration: 4000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
        panelClass: 'snackbar-danger',
      }
    );
    // put kanban to the trash
    this.kanbanService.detachObject(kanban);
    // when snack has been removed (dismissed)
    snack.afterDismissed().subscribe((info) => {
      if (info.dismissedByAction !== true) {
        // if dismissed not by undo click (so it dissappeared)
        // then get kanban by id and delete it
        this.kanbanService.deleteObject(kanban);
      }
    });
    // snack action has been taken
    snack.onAction().subscribe(() => {
      // undo button clicked, so remove kanban from the trash
      this.kanbanService.attachObject(kanban);
    });
  }

  public newKanbanDialog(): void {
    this.dialogOpen('Create new kanban', null);
  }

  public editKanbanDialog(kanban: Kanban): void {
    this.dialogOpen('Edit kanban', kanban);
  }

  public openTaskDetail(kanban: Kanban): void {
    this.dialog.open(TaskDetailComponent, {
      width: '500px',
      maxWidth: '90vw',
      data: kanban,
      direction:
        this.localStorageService.get('isRtl') === 'true' ? 'rtl' : 'ltr',
    });
  }

  private dialogOpen(title: string, kanban: Kanban | null): void {
    let tempDirection: Direction;
    if (this.localStorageService.get('isRtl') === 'true') {
      // Updated to use service
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    // open angular material dialog
    this.dialog.open(KanbanDialogComponent, {
      width: '60vw',
      maxWidth: '100vw',
      autoFocus: true,
      data: {
        title,
        kanban,
      },
      direction: tempDirection,
    });
  }
}


