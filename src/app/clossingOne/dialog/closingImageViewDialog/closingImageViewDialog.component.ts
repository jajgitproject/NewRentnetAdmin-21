// @ts-nocheck
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GeneralService } from '../../../general/general.service';

export interface ClosingImageViewDialogData {
  title: string;
  imageUrl: string;
}

@Component({
  standalone: false,
  selector: 'app-closingImageViewDialog',
  templateUrl: './closingImageViewDialog.component.html',
  styleUrls: ['./closingImageViewDialog.component.sass'],
})
export class ClosingImageViewDialogComponent {
  dialogTitle: string;
  imageUrl = '';
  isPdf = false;

  constructor(
    public dialogRef: MatDialogRef<ClosingImageViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ClosingImageViewDialogData,
    private generalService: GeneralService
  ) {
    this.dialogTitle = data?.title || 'Image';
    const resolved = generalService.resolveStaticImageUrl(data?.imageUrl) || data?.imageUrl || '';
    this.imageUrl = resolved;
    this.isPdf = this.imageUrl.toLowerCase().endsWith('.pdf');
  }

  openImageInNewTab(): void {
    if (this.imageUrl) {
      window.open(this.imageUrl, '_blank');
    }
  }
}
