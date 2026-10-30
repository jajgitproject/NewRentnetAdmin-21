// @ts-nocheck
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GeneralService } from '../../../general/general.service';
import { QcPhotoSlot } from '../../../dutySlipQualityCheck/qc-photo-url.util';

export interface ClosingImageViewDialogData {
  title: string;
  imagePath: string;
}

@Component({
  standalone: false,
  selector: 'app-closingImageViewDialog',
  templateUrl: './closingImageViewDialog.component.html',
  styleUrls: ['./closingImageViewDialog.component.sass'],
})
export class ClosingImageViewDialogComponent {
  dialogTitle: string;
  photoSlot: QcPhotoSlot;
  isPdf = false;
  loadFailed = false;

  constructor(
    public dialogRef: MatDialogRef<ClosingImageViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ClosingImageViewDialogData,
    private generalService: GeneralService
  ) {
    this.dialogTitle = data?.title || 'Image';
    this.photoSlot = new QcPhotoSlot(data?.imagePath, generalService);
    this.updatePdfFlag();
  }

  get displayUrl(): string | null {
    return this.photoSlot?.displayUrl ?? null;
  }

  onImageFailed(): void {
    if (this.photoSlot?.advanceOnFailed(this.generalService)) {
      this.loadFailed = false;
      this.updatePdfFlag();
      return;
    }
    this.loadFailed = true;
  }

  openImageInNewTab(): void {
    const url = this.displayUrl;
    if (url) {
      window.open(url, '_blank');
    }
  }

  private updatePdfFlag(): void {
    const url = (this.displayUrl ?? '').toLowerCase();
    this.isPdf = url.endsWith('.pdf');
  }
}
