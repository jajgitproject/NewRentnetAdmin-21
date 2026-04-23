// @ts-nocheck
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Kanban, KanbanComment } from '../core/kanban.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [
    CommonModule, 
    MatDialogModule, 
    MatButtonModule, 
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatDividerModule
  ],
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent {
  public dialogRef = inject(MatDialogRef<TaskDetailComponent>);
  public data = inject<Kanban>(MAT_DIALOG_DATA);
  
  public newComment: string = '';
  public isLiked: boolean = false;

  addComment() {
    if (this.newComment.trim()) {
      const comment: KanbanComment = {
        user: 'Current User', // Mock current user
        avatar: 'assets/images/user/user1.jpg',
        date: new Date(),
        message: this.newComment
      };
      this.data.commentsList = [comment, ...this.data.commentsList];
      this.data.comments = (this.data.comments || 0) + 1;
      this.newComment = '';
    }
  }

  toggleLike() {
    this.isLiked = !this.isLiked;
    if (this.isLiked) {
      this.data.likes++;
    } else {
      this.data.likes--;
    }
  }
}

