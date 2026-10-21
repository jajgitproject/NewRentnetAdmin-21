// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../general/general.service';
import { PassengerModel } from '../controlPanelDesign/controlPanelDesign.model';
import { DutySlipQualityCheckDetails } from './DutySlipQualityCheckDetails.model';
import { DutySlipQualityCheckedByExecutiveService } from '../dutySlipQualityCheckedByExecutive/dutySlipQualityCheckedByExecutive.service';
import { DutySlipQualityCheckedByExecutive } from '../dutySlipQualityCheckedByExecutive/dutySlipQualityCheckedByExecutive.model';
import { HttpErrorResponse } from '@angular/common/http';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { formatQcVerdict, truncateQcMessage } from '../dutySlipQualityCheck/qc-ai-verdict.util';
import { bindQcPhotoSlots, QcPhotoSlot } from '../dutySlipQualityCheck/qc-photo-url.util';
@Component({
  standalone: false,
  selector: 'app-DutySlipQualityCheckDetails',
  templateUrl: './DutySlipQualityCheckDetails.component.html',
  styleUrls: ['./DutySlipQualityCheckDetails.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class DutySlipQualityCheckDetailsComponent {
  DutySlipQualityCheckDetails: any;
  dialogTitle: string;
  allotmentID: number;
  dataSource: DutySlipQualityCheckedByExecutive[] | null;
  qcDetails:any;
  formatQcVerdict = formatQcVerdict;
  truncateQcMessage = truncateQcMessage;
  selfieSlot: QcPhotoSlot;
  frontSlot: QcPhotoSlot;
  interiorsSlot: QcPhotoSlot;
  breathSlot: QcPhotoSlot;


  constructor(
    public dialogRef: MatDialogRef<DutySlipQualityCheckDetailsComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    public _generalService: GeneralService,
    public dutySlipQualityCheckedByExecutiveService: DutySlipQualityCheckedByExecutiveService
  ) {
    // Set the defaults
    this.dialogTitle = 'Quality Check Details';
    this.DutySlipQualityCheckDetails = this.data;
    this.qcDetails = this.data?.dataSource?.[0];
    this.mapQcDetailFields();
  }

  private mapQcDetailFields(): void {
    if (!this.qcDetails) {
      return;
    }
    this.qcDetails.breatheAnalyzerImage = this.qcDetails.breatheAnalyzerImage
      || this.qcDetails.breathAnalyzer
      || this.qcDetails.BreatheAnalyzerImage
      || this.qcDetails.BreathAnalyzer
      || null;
    this.qcDetails.breatheAnalyzerReading = this.qcDetails.breatheAnalyzerReading
      ?? this.qcDetails.BreatheAnalyzerReading
      ?? null;
    this.qcDetails.frontPhotoAIVerdict = this.firstText(this.qcDetails.frontPhotoAIVerdict, this.qcDetails.FrontPhotoAIVerdict);
    this.qcDetails.selfieWithUniformAIVerdict = this.firstText(this.qcDetails.selfieWithUniformAIVerdict, this.qcDetails.SelfieWithUniformAIVerdict);
    this.qcDetails.interiorsWithAmenitiesAIVerdict = this.firstText(this.qcDetails.interiorsWithAmenitiesAIVerdict, this.qcDetails.InteriorsWithAmenitiesAIVerdict);
    this.qcDetails.frontPhotoAIMessage = this.firstText(this.qcDetails.frontPhotoAIMessage, this.qcDetails.FrontPhotoAIMessage);
    this.qcDetails.selfieWithUniformAIMessage = this.firstText(this.qcDetails.selfieWithUniformAIMessage, this.qcDetails.SelfieWithUniformAIMessage);
    this.qcDetails.interiorsWithAmenitiesAIMessage = this.firstText(this.qcDetails.interiorsWithAmenitiesAIMessage, this.qcDetails.InteriorsWithAmenitiesAIMessage);
    const slots = bindQcPhotoSlots(this._generalService, {
      selfie: this.qcDetails.selfieWithUniform,
      front: this.qcDetails.frontPhoto,
      interiors: this.qcDetails.interiorsWithAmenities,
    });
    this.selfieSlot = slots.selfie;
    this.frontSlot = slots.front;
    this.interiorsSlot = slots.interiors;
    const breathRaw = this.qcDetails.breatheAnalyzerImage || this.qcDetails.isolatedCabin;
    this.breathSlot = new QcPhotoSlot(breathRaw, this._generalService);
  }

  onQcSelfieImageFailed(): void {
    this.selfieSlot?.advanceOnFailed(this._generalService);
  }

  onQcFrontImageFailed(): void {
    this.frontSlot?.advanceOnFailed(this._generalService);
  }

  onQcInteriorsImageFailed(): void {
    this.interiorsSlot?.advanceOnFailed(this._generalService);
  }

  onQcBreathImageFailed(): void {
    this.breathSlot?.advanceOnFailed(this._generalService);
  }

  private firstText(...values: any[]): string {
    const found = values.find((value) => value != null && String(value).trim() !== '');
    return found == null ? '' : String(found);
  }
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  
 ///----For Image
 openImageInNewTab(imageUrl: string) {
  if (imageUrl) {
    window.open(imageUrl, '_blank');
  }
}

onContextMenu(event: MouseEvent, item: DutySlipQualityCheckDetails) {
  event.preventDefault();
  this.contextMenuPosition.x = event.clientX + 'px';
  this.contextMenuPosition.y = event.clientY + 'px';
  this.contextMenu.menuData = { item: item };
  this.contextMenu.menu.focusFirstItem('mouse');
  this.contextMenu.openMenu();
}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

