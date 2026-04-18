// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../general/general.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ControlPanelDetails, StopsModel } from '../controlPanelDesign/controlPanelDesign.model';
@Component({
  standalone: false,
  selector: 'app-TimeAndAddressInfo',
  templateUrl: './TimeAndAddressInfo.component.html',
  styleUrls: ['./TimeAndAddressInfo.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class TimeAndAddressInfoComponent {
  public timeAndAddressInfo: StopsModel;
  public dangerousMapUrl: string;
  public trustedUrl: SafeUrl;
  dialogTitle: string;
  status: string = '';
  buttonDisabled: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<TimeAndAddressInfoComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { advanceTable: StopsModel, status?: any },
    public _generalService: GeneralService,
    private sanitizer: DomSanitizer
  ) {
    // Set the defaults
    this.dialogTitle = 'Time & Address Info';
    this.timeAndAddressInfo = this.data.advanceTable;
    // Extract status robustly (string or nested)
    // this.status = this.extractStatus(data?.status);
    // const normalized = (this.status || '').trim().toLowerCase();
    // this.buttonDisabled = normalized !== 'changes allow';
    this.status = this.extractStatus(data);
    const normalizedStatus = (this.status || '').toLowerCase().trim();
    this.buttonDisabled = normalizedStatus !== 'changes allow';

    console.log('STATUS:', this.status);
    console.log('NORMALIZED:', normalizedStatus);
    console.log('BUTTON DISABLED:', this.buttonDisabled);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  private extractStatus(input: any): string {
    try {
      if (typeof input === 'string') return input;
      if (input?.status && typeof input.status === 'string') return input.status;
      if (input?.status?.status && typeof input.status.status === 'string') return input.status.status;
      return '';
    } catch {
      return '';
    }
  }
}
