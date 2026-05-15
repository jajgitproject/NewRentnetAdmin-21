// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChangeDetectorRef, Component, Inject, NgZone } from '@angular/core';
import { EmailInfoModel } from './EmailInfo.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../general/general.service';
import { ControlPanelDetails } from '../controlPanelDesign/controlPanelDesign.model';
import { EmailInfoService } from './EmailInfo.service';
import { HttpErrorResponse } from '@angular/common/http';
import { EMAIL_INFO_DOWNLOAD_STYLES } from './email-info-download-styles';
@Component({
  standalone: false,
  selector: 'app-EmailInfo',
  templateUrl: './EmailInfo.component.html',
  styleUrls: ['./EmailInfo.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class EmailInfoComponent {
 emailList: EmailInfoModel[] = [];
  dialogTitle: string;
  reservationID: any;
  constructor(
    public dialogRef: MatDialogRef<EmailInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _generalService: GeneralService,
    public emailInfoService: EmailInfoService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
  ) {
    // Set the defaults
    this.dialogTitle = 'Email Info';
    // Accept whichever identifier the caller provides. Some screens pass
    // reservationID, others pass reservationGroupID (or hand over the whole
    // row via advanceTable); fall back through all of them.
    this.reservationID =
      data?.reservationID ??
      data?.reservationGroupID ??
      data?.advanceTable?.reservationID ??
      data?.advanceTable?.reservationGroupID ??
      null;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() 
  {
    if (this.reservationID === null || this.reservationID === undefined || this.reservationID === '') {
      console.warn('[EmailInfo] No reservation identifier supplied; skipping load.');
      this.emailList = [];
      return;
    }
    this.loadData();      
  }

  getReservationGroupNo(): string {
    const id =
      this.emailList?.[0]?.reservationGroupID ??
      this.emailList?.[0]?.ReservationGroupID;
    return id != null && id !== '' && id !== 0 ? String(id) : 'N/A';
  }

  private formatAddressPair(details: string, google: string): string {
    const d = (details ?? '').trim();
    const g = (google ?? '').trim();
    if (d && g) {
      return `${d} ${g}`;
    }
    return d || g || 'N/A';
  }

  getPickupAddressDisplay(info: any): string {
    const pickup = info?.pickup;
    return this.formatAddressPair(
      pickup?.pickupAddressDetails,
      pickup?.pickupAddress
    );
  }

  getDropAddressDisplay(info: any): string {
    const drop = info?.drop;
    return this.formatAddressPair(
      drop?.dropOffAddressDetails,
      drop?.dropOffAddress
    );
  }

  getSpecialInstructionsDisplay(info: any): string {
    const list = info?.specialInstructions ?? info?.SpecialInstructions ?? [];
    if (!Array.isArray(list) || list.length === 0) {
      return 'N/A';
    }
    const texts = list
      .map((x) => (x?.specialInstruction ?? x?.SpecialInstruction ?? '').trim())
      .filter(Boolean);
    return texts.length ? texts.join('; ') : 'N/A';
  }

  public loadData() 
  {
    this.emailInfoService.getData(this.reservationID).subscribe(
    data =>   
    {
      // Be resilient to different response shapes: an array directly,
      // an object wrapping the array (e.g. { data: [...] } or
      // { reservationDetails: [...] }), or a single reservation object.
      let list: any = data;
      if (list && !Array.isArray(list)) {
        if (Array.isArray(list.data)) list = list.data;
        else if (Array.isArray(list.reservationDetails)) list = list.reservationDetails;
        else if (Array.isArray(list.emailList)) list = list.emailList;
        else if (list.reservationID !== undefined) list = [list];
        else list = [];
      }
      // Defer the state mutation to the next microtask so bindings that
      // already read 'N/A' during the in-flight change-detection pass do
      // not collide with the new value (NG0100).
      this.ngZone.run(() => {
        setTimeout(() => {
          this.emailList = list || [];
          this.cdr.detectChanges();
        }, 0);
      });
    },
    (error: HttpErrorResponse) => 
    { 
      console.error('[EmailInfo] Failed to load email details:', error);
      this.emailList = [];
      this.cdr.detectChanges();
    });
  }
    
  copyEmail() {
  const content = document.getElementById('emailContent');
  if (!content) return;

  const range = document.createRange();
  range.selectNode(content);

  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);

  try {
    document.execCommand('copy');
    selection.removeAllRanges();
    //alert('Email content copied to clipboard!');
  } catch (err) {
    console.error('Failed to copy:', err);
  }
}

  /** Downloads the email preview as a standalone .html file with proper styling (no Angular encapsulation). */
  downloadEmailHtml(): void {
    const content = document.getElementById('emailContent');
    if (!content) {
      console.warn('[EmailInfo] emailContent not found');
      return;
    }
    const fullDoc =
      '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">' +
      '<meta name="viewport" content="width=device-width, initial-scale=1">' +
      '<title>Booking Request</title><style>' +
      EMAIL_INFO_DOWNLOAD_STYLES +
      '</style></head><body>' +
      content.outerHTML +
      '</body></html>';
    const blob = new Blob([fullDoc], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeId = String(this.reservationID ?? 'booking').replace(/[^\w.-]+/g, '_');
    a.download = `Booking-Request-${safeId}.html`;
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

}


