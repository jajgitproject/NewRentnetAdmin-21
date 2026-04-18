// @ts-nocheck
import { Component, inject } from '@angular/core';
import {
  UntypedFormBuilder,
  Validators,
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogClose,
} from '@angular/material/dialog';

import {
  Kanban,
  KanbanStatus,
  KanbanPriority,
  KanbanType,
  KanbanMember,
} from '../core/kanban.model';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { KanbanService } from '../core/kanban.service';
import { USERS, User } from '../core/users.data';

export interface DialogData {
  id: number;
  action: string;
  title: string;
  kanban: Kanban;
}

@Component({
  standalone: false,
  selector: 'app-crud-dialog',
  templateUrl: './crud-dialog.component.html',
  styleUrls: ['./crud-dialog.component.scss'],
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogContent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatDialogClose,
  ],
})
export class KanbanDialogComponent {
  private formBuilder = inject(UntypedFormBuilder);
  data = inject<DialogData>(MAT_DIALOG_DATA);
  dialogRef = inject<MatDialogRef<KanbanDialogComponent>>(MatDialogRef);
  private snackBar = inject(MatSnackBar);
  private kanbanService = inject(KanbanService);

  public kanban: Kanban;
  public dialogTitle: string;
  public kanbanForm: UntypedFormGroup;
  public statusChoices: typeof KanbanStatus;
  public priorityChoices: typeof KanbanPriority;
  public kanbanType: typeof KanbanType;
  public userList: User[] = USERS;

  constructor() {
    const data = this.data;

    this.dialogTitle = data.title;
    this.kanban = data.kanban;
    this.statusChoices = KanbanStatus;
    this.priorityChoices = KanbanPriority;
    this.kanbanType = KanbanType;

    const nonWhiteSpaceRegExp = new RegExp('\\S');

    this.kanbanForm = this.formBuilder.group({
      name: [
        this.kanban?.name,
        [Validators.required, Validators.pattern(nonWhiteSpaceRegExp)],
      ],
      status: [this.kanban ? this.kanban.status : this.statusChoices.NEWTASK],
      description: [this.kanban?.description],
      deadline: [this.kanban?.deadline],
      priority: [
        this.kanban ? this.kanban.priority : this.priorityChoices.MEDIUM,
      ],
      open_task: [this.kanban?.open_task],
      type: [this.kanban ? this.kanban.type : this.kanbanType.WEB],
      created: [this.kanban?.created || new Date()],
      members: [this.kanban?.members || []],
      progress: [this.kanban?.progress || 0],
      likes: [this.kanban?.likes || 0],
      commentsList: [this.kanban?.commentsList || []],
    });
  }

  public submit(): void {
    console.log('save');
    if (!this.kanbanForm.valid) {
      return;
    }
    if (this.kanban) {
      // update kanban object with form values
      Object.assign(this.kanban, this.kanbanForm.value);
      this.kanbanService.updateObject(this.kanban);
      this.snackBar.open('Kanban updated Successfully...!!!', '', {
        duration: 2000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
        panelClass: 'black',
      });

      this.dialogRef.close();
    } else {
      this.kanbanService.createOject(this.kanbanForm.value);
      this.snackBar.open('Kanban created Successfully...!!!', '', {
        duration: 2000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
        panelClass: 'black',
      });

      this.dialogRef.close();
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  public compareUsers(u1: KanbanMember, u2: KanbanMember): boolean {
    return u1 && u2 ? u1.name === u2.name : u1 === u2;
  }
}


