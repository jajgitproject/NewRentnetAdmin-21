// @ts-nocheck
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GeneralService } from '../../../general/general.service';

export interface DriverComplianceImagePreviewData {
  title: string;
  imageUrl: string;
}

@Component({
  standalone: false,
  selector: 'app-driver-compliance-image-preview-dialog',
  templateUrl: './image-preview-dialog.component.html',
  styleUrls: ['./image-preview-dialog.component.sass'],
})
export class DriverComplianceImagePreviewDialogComponent {
  dialogTitle: string;
  imageUrl = '';
  isPdf = false;
  previewFailed = false;

  constructor(
    public dialogRef: MatDialogRef<DriverComplianceImagePreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DriverComplianceImagePreviewData,
    private generalService: GeneralService
  ) {
    this.dialogTitle = data?.title || 'Document image';
    const raw = data?.imageUrl || '';
    this.imageUrl =
      this.generalService.resolveStaticImageUrl(raw) || raw || '';
    this.isPdf = this.imageUrl.toLowerCase().includes('.pdf');
  }
}
