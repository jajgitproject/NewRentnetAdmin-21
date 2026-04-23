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
    this.qcDetails = this.data?.dataSource?.[0]
  }
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  
 ///----For Image
 openImageInNewTab(imageUrl: string) {
  window.open(imageUrl, '_blank');
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
  // ngOnInit() {
  //   this.loadData();
   
  // }

  // public loadData() {
   
  //   this.dutySlipQualityCheckedByExecutiveService.getdutyQualityCheckDataDetails(this.allotmentID).subscribe
  //     (
  //       data => {

  //         this.dataSource = data;
  //         //console.log(this.dataSource)
       
  //       },
  //       (error: HttpErrorResponse) => { this.dataSource = null; }
  //     );
  // }
}


