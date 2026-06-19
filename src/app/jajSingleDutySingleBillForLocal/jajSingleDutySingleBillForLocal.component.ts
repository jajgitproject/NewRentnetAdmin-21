// @ts-nocheck
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormDialogComponent } from '../bank/dialogs/form-dialog/form-dialog.component';
import { DeleteDialogCityComponent } from '../dashboard/city-master/dialogscity/delete-city/delete-city.component';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { JajSingleDutySingleBillForLocal } from './jajSingleDutySingleBillForLocal.model';
import { JajSingleDutySingleBillForLocalService } from './jajSingleDutySingleBillForLocal.service';
import { PdfPrintService } from '../general/pdf-print.service';
@Component({
  standalone: false,
  selector: 'app-jajSingleDutySingleBillForLocal',
  templateUrl: './jajSingleDutySingleBillForLocal.component.html',
  styleUrls: ['./jajSingleDutySingleBillForLocal.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class JajSingleDutySingleBillForLocalComponent implements OnInit, OnDestroy {
  dataSource: any;
  advanceTable: JajSingleDutySingleBillForLocal | null;
  sortingData: number;
  sortType: string;
  search : FormControl = new FormControl();
  invoiceID: number;
  reservationID: number;
  vehicleName: any;
  dutySlipPdfUrl: SafeResourceUrl | null = null;
  printDutySlipEmbedUrl: SafeResourceUrl | null = null;
  invoiceLogoUrl: string | null = null;
  private dutySlipResizeObserver: ResizeObserver | null = null;
  private dutySlipResizeTimeouts: ReturnType<typeof setTimeout>[] = [];
  private readonly onDutySlipIframeMessage = (event: MessageEvent): void => {
    if (event.origin !== window.location.origin) return;
    if (event.data?.type !== 'dutySlipIframeResize') return;
    const iframe = this.dutySlipIframe?.nativeElement as HTMLIFrameElement | undefined;
    if (iframe) {
      this.resizePrintDutySlipIframe(iframe);
    }
  };

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public route:ActivatedRoute,
    public jajSingleDutySingleBillForLocalServiceService: JajSingleDutySingleBillForLocalService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService,
    private sanitizer: DomSanitizer,
    private pdfPrintService: PdfPrintService
  ) {}
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
 @ViewChild('printSection', { static: false }) printSection: ElementRef;
 @ViewChild('printableArea', { static: false }) printableArea: ElementRef;
  @ViewChild('dutySlipIframe', { static: false }) dutySlipIframe: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.invoiceLogoUrl = 'assets/images/logoeco1.png';
    window.addEventListener('message', this.onDutySlipIframeMessage);
    this.route.queryParams.subscribe(paramsData =>{
      this.invoiceID   = paramsData.invoiceID;
       this.reservationID=paramsData.reservationID;
       this.vehicleName = paramsData.vehicleName;
    });
    this.loadData();
    
  }

  ngOnDestroy(): void {
    window.removeEventListener('message', this.onDutySlipIframeMessage);
    this.disconnectDutySlipResizeObserver();
    this.dutySlipResizeTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
    this.dutySlipResizeTimeouts = [];
  }

  public loadData() 
  {
     this.jajSingleDutySingleBillForLocalServiceService.printDutySlipInfo(this.invoiceID).subscribe
   (
     data =>   
     {
       this.dataSource = data;
       this.dutySlipPdfUrl = null;
       this.printDutySlipEmbedUrl = null;
       this.buildPrintDutySlipEmbedUrl();
       if (this.dataSource?.dutySlipImage) {
         this.dataSource.dutySlipImage = this._generalService.resolveStaticImageUrl(
           this.dataSource.dutySlipImage
         );
         if (this.isPdfUrl(this.dataSource.dutySlipImage)) {
           this.dutySlipPdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
             this.dataSource.dutySlipImage
           );
         }
       }
     },
     (error: HttpErrorResponse) => { this.dataSource = null;}
   );
 }
 printWithSelectPdf() {
  const element = this.printableArea?.nativeElement as HTMLElement;
  const invoiceNumber = this.dataSource?.invoiceModel?.invoiceNumberWithPrefix?.trim();
  const fileName = invoiceNumber || `Invoice_${this.invoiceID || 'print'}`;
  const iframeImageFallback = this.dataSource?.dutySlipImage || undefined;
  this.pdfPrintService.printElementAsPdf(element, fileName, {
    iframeImageFallback,
    liveElement: element
  });
}
getHoursAndMinutes(totalMinutes: number): { hours: number; minutes: number } {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return { hours, minutes };
}

isPdfUrl(url: string): boolean {
  return (url ?? '').toLowerCase().split('?')[0].endsWith('.pdf');
}

isTollOrParking(type: string): boolean {
  return type === 'Toll' || type === 'Parking';
}

rfidFastagAttachments() {
  return (this.dataSource?.invoiceTollParkingModel ?? [])
    .filter(img => img?.tollParkingImage && !this.isTollOrParking(img.tollParkingType));
}

buildPrintDutySlipEmbedUrl(): void {
  const dutySlipID = this.dataSource?.dutySlipID;
  const reservationID =
    this.dataSource?.reservationID ??
    this.dataSource?.invoiceReservationModel?.reservationID;

  if (!dutySlipID || !reservationID) {
    return;
  }

  const dutySlipType = (this.dataSource?.dutySlipType || '').toString().trim();
  const route = dutySlipType === 'GeneralDutySlipWithMap'
    ? 'printdutyslip'
    : 'PrintDutySlipWithoutMap';

  const base = `${window.location.origin}${window.location.pathname}`;
  const url = `${base}#/${route}?dutySlipID=${dutySlipID}&reservationID=${reservationID}`;
  this.printDutySlipEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
}

resizePrintDutySlipIframe(iframe: HTMLIFrameElement): void {
  try {
    const doc = iframe.contentDocument ?? iframe.contentWindow?.document;
    if (!doc) return;
    const height = Math.max(
      doc.body?.scrollHeight ?? 0,
      doc.documentElement?.scrollHeight ?? 0,
      doc.body?.offsetHeight ?? 0,
      doc.documentElement?.offsetHeight ?? 0
    );
    if (height > 0) {
      iframe.style.height = `${height}px`;
    }
  } catch {
    // Same-origin only; fallback keeps auto height from CSS
  }
}

private disconnectDutySlipResizeObserver(): void {
  this.dutySlipResizeObserver?.disconnect();
  this.dutySlipResizeObserver = null;
}

private setupDutySlipResizeObserver(iframe: HTMLIFrameElement): void {
  this.disconnectDutySlipResizeObserver();
  try {
    const doc = iframe.contentDocument ?? iframe.contentWindow?.document;
    if (!doc?.body) return;
    this.dutySlipResizeObserver = new ResizeObserver(() => {
      this.resizePrintDutySlipIframe(iframe);
    });
    this.dutySlipResizeObserver.observe(doc.body);
    if (doc.documentElement) {
      this.dutySlipResizeObserver.observe(doc.documentElement);
    }
  } catch {
    // Same-origin only
  }
}

private scheduleDutySlipResizeFallbacks(iframe: HTMLIFrameElement): void {
  this.dutySlipResizeTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
  this.dutySlipResizeTimeouts = [300, 1000, 3000].map(delay =>
    setTimeout(() => this.resizePrintDutySlipIframe(iframe), delay)
  );
}

onPrintDutySlipIframeLoad(event: Event): void {
  const iframe = event.target as HTMLIFrameElement;
  this.resizePrintDutySlipIframe(iframe);
  this.setupDutySlipResizeObserver(iframe);
  this.scheduleDutySlipResizeFallbacks(iframe);
}

}



