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
  hasAnySpecialInstruction = false;
  mergedInstructions: string = "";


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

  prepareInstructions() 
  {
    const allInstructions: string[] = [];
    this.emailList.forEach(b => {
      if (b.specialInstruction && Array.isArray(b.specialInstruction)) {
        b.specialInstruction.forEach(ins => {
          if (ins.specialInstruction) {
            allInstructions.push(ins.specialInstruction);
          }
        });
      }
    });

    this.hasAnySpecialInstruction = allInstructions.length > 0;

    if (this.hasAnySpecialInstruction) 
    {
      this.mergedInstructions = allInstructions.join(", ");
    }
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
          if (this.emailList && this.emailList.length > 0) {
            this.prepareInstructions();
          }
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


