// @ts-nocheck

import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { SendDataToDynamicsService } from '../sendDataToDynamics.service';

import { SendCreditNotesToDynamicsService } from '../../sendCreditNotesToDynamics/sendCreditNotesToDynamics.service';



export type DynamicsSyncDetailsDocumentKind = 'invoice' | 'creditNote';



export interface DynamicsSyncDetailsDialogData {

  documentKind?: DynamicsSyncDetailsDocumentKind;

  title?: string;

  invoiceId?: number;

  invoiceCreditNoteId?: number;

  row?: any;

}



export interface DynamicsResponsePresentation {

  summary: string;

  details: { label: string; value: string }[];

  isError: boolean;

}



@Component({

  standalone: false,

  selector: 'app-invoice-sync-details-dialog',

  templateUrl: './invoice-sync-details-dialog.component.html',

  styleUrls: ['./invoice-sync-details-dialog.component.scss']

})

export class InvoiceSyncDetailsDialogComponent implements OnInit {

  loading = true;

  errorMessage = '';

  details: any = null;

  constructor(

    public dialogRef: MatDialogRef<InvoiceSyncDetailsDialogComponent>,

    @Inject(MAT_DIALOG_DATA) public data: DynamicsSyncDetailsDialogData,

    private sendDataToDynamicsService: SendDataToDynamicsService,

    private sendCreditNotesToDynamicsService: SendCreditNotesToDynamicsService,

    private changeDetectorRef: ChangeDetectorRef

  ) {}



  get isCreditNote(): boolean {

    return (this.data?.documentKind || 'invoice') === 'creditNote';

  }



  get dialogTitle(): string {

    if (this.data?.title) {

      return this.data.title;

    }

    return this.isCreditNote

      ? 'Credit Note & Dynamics Sync Details'

      : 'Invoice & Dynamics sync details';

  }



  get documentSectionTitle(): string {

    return this.isCreditNote ? 'Credit note' : 'Invoice';

  }



  ngOnInit(): void {

    this.seedFromGridRow(this.data?.row);

    const documentId = this.getDocumentId();

    if (!documentId) {

      this.setError(this.isCreditNote ? 'Invalid credit note.' : 'Invalid invoice.');

      return;

    }



    const details$ = this.isCreditNote

      ? this.sendCreditNotesToDynamicsService.getCreditNoteDynamicsSyncDetails(documentId)

      : this.sendDataToDynamicsService.getInvoiceDynamicsSyncDetails(documentId);



    details$.subscribe({

      next: (details) => this.mergeApiDetails(details),

      error: () => {

        this.errorMessage = 'Could not load latest Dynamics sync details from the server.';

        this.finishLoading();

      }

    });

  }



  private getDocumentId(): number {

    if (this.isCreditNote) {

      return Number(

        this.data?.invoiceCreditNoteId

        || this.data?.row?.invoiceCreditNoteID

        || this.data?.row?.InvoiceCreditNoteID

        || 0

      );

    }

    return Number(

      this.data?.invoiceId

      || this.data?.row?.invoiceID

      || this.data?.row?.InvoiceID

      || 0

    );

  }



  private seedFromGridRow(row: any): void {

    if (!row) {

      return;

    }



    const emptyDynamics = {

      syncDate: null,

      syncTime: null,

      dynamicsResponse: null,

      dynamicsResponseCode: null,

      dynamicsResponseStatus: null,

      dynamicsResponseDate: null,

      dynamicsResponseTime: null

    };



    if (this.isCreditNote) {

      this.details = {

        creditNoteNumberWithPrefix: row.creditNoteNumberWithPrefix ?? row.CreditNoteNumberWithPrefix,

        creditNoteDate: row.creditNoteDate ?? row.CreditNoteDate,

        invoiceNumberWithPrefix: row.invoiceNumberWithPrefix ?? row.InvoiceNumberWithPrefix,

        customerName: row.customerName ?? row.CustomerName,

        branchName: row.branchName ?? row.BranchName,

        syncStatus: row.creditNoteSyncStatus ?? row.CreditNoteSyncStatus ?? 'Unprocessed',

        ...emptyDynamics

      };

    } else {

      this.details = {

        invoiceNumberWithPrefix: row.invoiceNumberWithPrefix ?? row.InvoiceNumberWithPrefix,

        invoiceDate: row.invoiceDate ?? row.InvoiceDate,

        customerName: row.customerName ?? row.CustomerName,

        branchName: row.branchName ?? row.BranchName,

        syncStatus: row.invoiceSyncStatus ?? row.InvoiceSyncStatus ?? 'Unprocessed',

        ...emptyDynamics

      };

    }

    this.changeDetectorRef.markForCheck();

  }



  private mergeApiDetails(details: any): void {

    const source = details || {};

    if (this.isCreditNote) {

      this.details = {

        creditNoteNumberWithPrefix: source.creditNoteNumberWithPrefix ?? source.CreditNoteNumberWithPrefix ?? this.details?.creditNoteNumberWithPrefix,

        creditNoteDate: source.creditNoteDate ?? source.CreditNoteDate ?? this.details?.creditNoteDate,

        invoiceNumberWithPrefix: source.invoiceNumberWithPrefix ?? source.InvoiceNumberWithPrefix ?? this.details?.invoiceNumberWithPrefix,

        customerName: source.customerName ?? source.CustomerName ?? this.details?.customerName,

        branchName: source.branchName ?? source.BranchName ?? this.details?.branchName,

        syncStatus: source.syncStatus ?? source.SyncStatus ?? this.details?.syncStatus ?? 'Unprocessed',

        syncDate: source.syncDate ?? source.SyncDate,

        syncTime: source.syncTime ?? source.SyncTime,

        dynamicsResponse: source.dynamicsResponse ?? source.DynamicsResponse,

        dynamicsResponseCode: source.dynamicsResponseCode ?? source.DynamicsResponseCode,

        dynamicsResponseStatus: source.dynamicsResponseStatus ?? source.DynamicsResponseStatus,

        dynamicsResponseDate: source.dynamicsResponseDate ?? source.DynamicsResponseDate,

        dynamicsResponseTime: source.dynamicsResponseTime ?? source.DynamicsResponseTime

      };

    } else {

      this.details = {

        invoiceNumberWithPrefix: source.invoiceNumberWithPrefix ?? source.InvoiceNumberWithPrefix ?? this.details?.invoiceNumberWithPrefix,

        invoiceDate: source.invoiceDate ?? source.InvoiceDate ?? this.details?.invoiceDate,

        customerName: source.customerName ?? source.CustomerName ?? this.details?.customerName,

        branchName: source.branchName ?? source.BranchName ?? this.details?.branchName,

        syncStatus: source.syncStatus ?? source.SyncStatus ?? this.details?.syncStatus ?? 'Unprocessed',

        syncDate: source.syncDate ?? source.SyncDate,

        syncTime: source.syncTime ?? source.SyncTime,

        dynamicsResponse: source.dynamicsResponse ?? source.DynamicsResponse,

        dynamicsResponseCode: source.dynamicsResponseCode ?? source.DynamicsResponseCode,

        dynamicsResponseStatus: source.dynamicsResponseStatus ?? source.DynamicsResponseStatus,

        dynamicsResponseDate: source.dynamicsResponseDate ?? source.DynamicsResponseDate,

        dynamicsResponseTime: source.dynamicsResponseTime ?? source.DynamicsResponseTime

      };

    }

    this.finishLoading();

  }



  private setError(message: string): void {

    this.errorMessage = message || 'Unable to load sync details.';

    this.finishLoading();

  }



  private finishLoading(): void {

    this.loading = false;

    this.changeDetectorRef.detectChanges();

  }



  close(): void {

    this.dialogRef.close();

  }



  displayDate(value: any): string {

    if (!value) {

      return 'N/A';

    }

    if (typeof value === 'object' && !(value instanceof Date)) {

      const nested = value.date ?? value.Date ?? value.value;

      if (nested) {

        return this.displayDate(nested);

      }

    }

    const date = new Date(value);

    return isNaN(date.getTime()) ? String(value) : date.toLocaleDateString('en-GB');

  }



  displayTime(value: any): string {

    return this.formatTimeValue(value);

  }



  formatSyncTimestamp(dateValue: any, timeValue: any): string {

    const datePart = this.displayDate(dateValue);

    const timePart = this.formatTimeValue(timeValue);

    if (datePart === 'N/A' && timePart === 'N/A') {

      return 'N/A';

    }

    if (datePart === 'N/A') {

      return timePart;

    }

    if (timePart === 'N/A') {

      return datePart;

    }

    return `${datePart}, ${timePart}`;

  }



  private formatTimeValue(value: any): string {

    if (value === null || value === undefined || value === '') {

      return 'N/A';

    }



    if (typeof value === 'string') {

      const trimmed = value.trim();

      if (!trimmed) {

        return 'N/A';

      }

      const match = trimmed.match(/^(\d{1,2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?/);

      if (match) {

        const hours = match[1].padStart(2, '0');

        const minutes = match[2];

        const seconds = (match[3] ?? '00').padStart(2, '0');

        return `${hours}:${minutes}:${seconds}`;

      }

      return trimmed;

    }



    if (typeof value === 'object') {

      if (typeof value.hours === 'number' || typeof value.minutes === 'number' || typeof value.seconds === 'number') {

        const hours = value.hours ?? 0;

        const minutes = value.minutes ?? 0;

        const seconds = Math.floor(value.seconds ?? 0);

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

      }

      if (typeof value.ticks === 'number') {

        const totalSeconds = Math.floor(value.ticks / 10000000);

        const hours = Math.floor(totalSeconds / 3600);

        const minutes = Math.floor((totalSeconds % 3600) / 60);

        const seconds = totalSeconds % 60;

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

      }

    }



    return String(value);

  }



  displayText(value: any): string {

    if (value === null || value === undefined || String(value).trim() === '') {

      return 'N/A';

    }

    if (typeof value === 'object') {

      return JSON.stringify(value);

    }

    return String(value);

  }



  getSyncStatusBadgeClass(): string {

    const status = String(this.details?.syncStatus || '').trim().toLowerCase();

    if (status === 'successful') {

      return 'isdd-badge isdd-badge--success';

    }

    if (status === 'failed') {

      return 'isdd-badge isdd-badge--danger';

    }

    if (status === 'processing') {

      return 'isdd-badge isdd-badge--info';

    }

    return 'isdd-badge isdd-badge--muted';

  }



  getResponseCodeBadgeClass(): string {

    const code = String(this.details?.dynamicsResponseCode || '').trim();

    if (code === '200' || code === '201') {

      return 'isdd-badge isdd-badge--success';

    }

    if (code && code !== 'N/A') {

      return 'isdd-badge isdd-badge--danger';

    }

    return 'isdd-badge isdd-badge--muted';

  }



  getDynamicsResponsePresentation(): DynamicsResponsePresentation {

    const raw = this.details?.dynamicsResponse;

    if (raw === null || raw === undefined || String(raw).trim() === '') {

      const docLabel = this.isCreditNote ? 'credit note' : 'invoice';

      return { summary: `No Dynamics response has been recorded for this ${docLabel} yet.`, details: [], isError: false };

    }



    const text = String(raw).trim();

    if (text.startsWith('{') || text.startsWith('[')) {

      try {

        const parsed = JSON.parse(text);

        return this.buildPresentationFromJson(parsed);

      } catch {

        return { summary: text, details: [], isError: this.looksLikeError(text) };

      }

    }



    return {

      summary: text,

      details: [],

      isError: this.looksLikeError(text)

    };

  }



  private buildPresentationFromJson(data: any): DynamicsResponsePresentation {

    if (data == null) {

      return { summary: 'Empty response.', details: [], isError: false };

    }



    if (typeof data === 'string') {

      return { summary: data, details: [], isError: this.looksLikeError(data) };

    }



    if (Array.isArray(data)) {

      const lines = data

        .map((item, index) => this.flattenJsonEntry(`Item ${index + 1}`, item))

        .filter((entry) => entry.value);

      const summary = lines.length

        ? 'The integration returned multiple response items.'

        : 'Empty response list.';

      return { summary, details: lines, isError: this.looksLikeError(JSON.stringify(data)) };

    }



    const errorNode = data.error ?? data.Error;

    if (errorNode && typeof errorNode === 'object') {

      const summary =

        this.pickFirstString(errorNode, ['message', 'Message', 'error_description', 'ErrorDescription'])

        || 'Dynamics reported an error.';

      const details: { label: string; value: string }[] = [];

      const code = this.pickFirstString(errorNode, ['code', 'Code']);

      if (code) {

        details.push({ label: 'Error code', value: code });

      }

      const inner = errorNode.innererror ?? errorNode.InnerError;

      if (inner && typeof inner === 'object') {

        const innerMsg = this.pickFirstString(inner, ['message', 'Message']);

        if (innerMsg) {

          details.push({ label: 'Technical details', value: innerMsg });

        }

      }

      this.appendReadableFields(details, data, ['error', 'Error']);

      return { summary, details, isError: true };

    }



    const directMessage = this.pickFirstString(data, [

      'message',

      'Message',

      'result',

      'Result',

      'statusMessage',

      'StatusMessage',

      'title',

      'Title'

    ]);

    if (directMessage) {

      const details = this.collectScalarDetails(data, [

        'message',

        'Message',

        'result',

        'Result',

        'statusMessage',

        'StatusMessage',

        'title',

        'Title'

      ]);

      return {

        summary: directMessage,

        details,

        isError: this.looksLikeError(directMessage)

      };

    }



    const details = this.collectScalarDetails(data);

    if (details.length) {

      return {

        summary: 'Dynamics returned the following details.',

        details,

        isError: details.some((d) => this.looksLikeError(d.value))

      };

    }



    return {

      summary: 'Response received from Dynamics (see details below).',

      details: [{ label: 'Raw content', value: this.truncate(this.textFromJson(data), 1200) }],

      isError: false

    };

  }



  private textFromJson(data: any): string {

    try {

      return JSON.stringify(data, null, 2);

    } catch {

      return String(data);

    }

  }



  private pickFirstString(source: any, keys: string[]): string {

    if (!source || typeof source !== 'object') {

      return '';

    }

    for (const key of keys) {

      const val = source[key];

      if (val !== null && val !== undefined && String(val).trim() !== '') {

        return String(val).trim();

      }

    }

    return '';

  }



  private collectScalarDetails(source: any, excludeKeys: string[] = []): { label: string; value: string }[] {

    if (!source || typeof source !== 'object' || Array.isArray(source)) {

      return [];

    }

    const exclude = new Set(excludeKeys.map((k) => k.toLowerCase()));

    const details: { label: string; value: string }[] = [];

    Object.keys(source).forEach((key) => {

      if (exclude.has(key.toLowerCase())) {

        return;

      }

      const val = source[key];

      if (val === null || val === undefined) {

        return;

      }

      if (typeof val === 'object') {

        return;

      }

      const text = String(val).trim();

      if (text) {

        details.push({ label: this.humanizeLabel(key), value: text });

      }

    });

    return details;

  }



  private appendReadableFields(

    details: { label: string; value: string }[],

    source: any,

    excludeKeys: string[] = []

  ): void {

    this.collectScalarDetails(source, excludeKeys).forEach((entry) => {

      if (!details.some((d) => d.label === entry.label)) {

        details.push(entry);

      }

    });

  }



  private flattenJsonEntry(label: string, value: any): { label: string; value: string } {

    if (value === null || value === undefined) {

      return { label, value: '' };

    }

    if (typeof value === 'object') {

      const msg = this.pickFirstString(value, ['message', 'Message', 'error', 'Error']);

      if (msg) {

        return { label, value: msg };

      }

      return { label, value: this.truncate(this.textFromJson(value), 400) };

    }

    return { label, value: String(value) };

  }



  private humanizeLabel(key: string): string {

    const spaced = key

      .replace(/([a-z])([A-Z])/g, '$1 $2')

      .replace(/_/g, ' ')

      .trim();

    return spaced.charAt(0).toUpperCase() + spaced.slice(1);

  }



  private truncate(value: string, maxLen: number): string {

    if (!value || value.length <= maxLen) {

      return value || '';

    }

    return `${value.slice(0, maxLen)}…`;

  }



  private looksLikeError(text: string): boolean {

    const lower = String(text || '').toLowerCase();

    return lower.includes('error')

      || lower.includes('failed')

      || lower.includes('exception')

      || lower.includes('bad request')

      || lower.includes('invalid');

  }

}


