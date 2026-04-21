// @ts-nocheck
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, inject } from '@angular/core';
import { AdvanceTableService } from '../../advance-table.service';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
}

@Component({
  standalone: false,
    selector: 'app-delete',
    templateUrl: './delete.component.html',
    styleUrls: ['./delete.component.scss'],
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatButtonModule,
        MatDialogClose,
    ]
})
export class DeleteDialogComponent {
  dialogRef = inject<MatDialogRef<DeleteDialogComponent>>(MatDialogRef);
  data = inject<DialogData>(MAT_DIALOG_DATA);
  advanceTableService = inject(AdvanceTableService);

  confirmDelete(): void {
    this.advanceTableService.deleteAdvanceTable(this.data.id).subscribe({
      next: (response) => {
        this.dialogRef.close(response); // Close with the response data
        // Handle successful deletion, e.g., refresh the table or show a notification
      },
      error: (error) => {
        console.error('Delete Error:', error);
        // Handle the error appropriately
      },
    });
  }
}


