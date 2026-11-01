// @ts-nocheck
import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import moment from 'moment';
import { finalize, timeout } from 'rxjs/operators';
import { TimeoutError } from 'rxjs';
import { RejectedQCDriverPhotoSearchCriteria } from './rejectedQCDriverPhoto.model';
import { RejectedQCDriverPhotoService } from './rejectedQCDriverPhoto.service';

@Component({
  standalone: false,
  selector: 'app-rejectedQCDriverPhoto',
  templateUrl: './rejectedQCDriverPhoto.component.html',
  styleUrls: ['./rejectedQCDriverPhoto.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class RejectedQCDriverPhotoComponent {
  qcDateFromCtrl = new FormControl('', Validators.required);
  qcDateToCtrl = new FormControl('', Validators.required);
  imageCountCtrl = new FormControl(null, [Validators.required, Validators.min(1)]);

  downloading = false;
  loadError = '';

  constructor(
    private rejectedQCDriverPhotoService: RejectedQCDriverPhotoService,
    private snackBar: MatSnackBar
  ) {}

  canDownload(): boolean {
    return !this.downloading
      && this.qcDateFromCtrl.valid
      && this.qcDateToCtrl.valid
      && this.imageCountCtrl.valid;
  }

  refresh(): void {
    this.qcDateFromCtrl.setValue('');
    this.qcDateToCtrl.setValue('');
    this.imageCountCtrl.setValue(null);
    this.qcDateFromCtrl.markAsPristine();
    this.qcDateToCtrl.markAsPristine();
    this.imageCountCtrl.markAsPristine();
    this.loadError = '';
  }

  download(): void {
    this.qcDateFromCtrl.markAsTouched();
    this.qcDateToCtrl.markAsTouched();
    this.imageCountCtrl.markAsTouched();

    if (!this.canDownload()) {
      this.loadError = 'QC Date From, QC Date To, and Image Count are required.';
      return;
    }

    const fromDate = this.qcDateFromCtrl.value;
    const toDate = this.qcDateToCtrl.value;
    if (fromDate && toDate && moment(fromDate).isAfter(moment(toDate), 'day')) {
      this.loadError = 'QC Date From cannot be later than QC Date To.';
      return;
    }

    const criteria: RejectedQCDriverPhotoSearchCriteria = {
      qcDateFrom: moment(fromDate).format('YYYY-MM-DD'),
      qcDateTo: moment(toDate).format('YYYY-MM-DD'),
      imageCount: Number(this.imageCountCtrl.value)
    };

    this.downloading = true;
    this.loadError = '';

    this.rejectedQCDriverPhotoService.downloadRejectedDriverPhotos(criteria).pipe(
      timeout(300000),
      finalize(() => {
        this.downloading = false;
      })
    ).subscribe(
      async (response: HttpResponse<Blob>) => {
        const blob = response.body;

        if (!blob || blob.size === 0) {
          this.loadError = 'ZIP file is empty or unavailable.';
          this.showNotification('snackbar-danger', this.loadError, 'bottom', 'center');
          return;
        }

        const contentType = (blob.type || '').toLowerCase();
        if (contentType.includes('application/json') || contentType.includes('text/plain')) {
          const message = await this.extractErrorMessage(blob, 'Download failed.');
          this.loadError = message;
          this.showNotification('snackbar-danger', message, 'bottom', 'center');
          return;
        }

        this.triggerZipDownload(blob);
        const summaryMessage = this.buildDownloadSummaryMessage(response);
        this.showNotification('snackbar-success', summaryMessage, 'bottom', 'center');
      },
      async (error: HttpErrorResponse | TimeoutError) => {
        if (error instanceof TimeoutError) {
          const message = 'Download timed out. Try a smaller image count or narrower date range.';
          this.loadError = message;
          this.showNotification('snackbar-danger', message, 'bottom', 'center');
          return;
        }

        const message = await this.extractHttpErrorMessage(error, 'Download failed.');
        this.loadError = message;
        this.showNotification('snackbar-danger', message, 'bottom', 'center');
      }
    );
  }

  private buildDownloadSummaryMessage(response: HttpResponse<Blob>): string {
    const headers = response.headers;
    const requested = headers.get('X-Requested-Image-Count');
    const included = headers.get('X-Included-Image-Count');
    const available = headers.get('X-Available-Image-Count');
    const skipped = headers.get('X-Skipped-Missing-Count');
    const customMessage = headers.get('X-Download-Message');

    if (customMessage) {
      return customMessage;
    }

    if (requested && included) {
      let message = `Downloaded ${included} of ${requested} requested image(s).`;
      if (available && Number(available) < Number(requested)) {
        message += ` Only ${available} image(s) were available in the selected date range.`;
      }
      if (skipped && Number(skipped) > 0) {
        message += ` ${skipped} file(s) could not be read and were skipped.`;
      }
      return message;
    }

    return 'Rejected QC driver photos downloaded successfully.';
  }

  private async extractHttpErrorMessage(error: HttpErrorResponse, fallback: string): Promise<string> {
    if (error?.error instanceof Blob) {
      return this.extractErrorMessage(error.error, fallback);
    }

    if (error?.error?.message) {
      return error.error.message;
    }

    return error?.message || fallback;
  }

  private async extractErrorMessage(blob: Blob, fallback: string): Promise<string> {
    try {
      const text = await blob.text();
      if (!text) {
        return fallback;
      }

      const parsed = JSON.parse(text);
      if (parsed?.message) {
        return parsed.message;
      }

      return text;
    } catch {
      return fallback;
    }
  }

  private triggerZipDownload(blob: Blob): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'RejectedQCDriverPhoto.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  private showNotification(colorName: string, text: string, placementFrom: any, placementAlign: any): void {
    this.snackBar.open(text, '', {
      duration: 4000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
}
