// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { GeneralService } from '../general/general.service';
@Component({
  standalone: false,
  selector: 'app-dutySlipMap',
  templateUrl: './dutySlipMap.component.html',
  styleUrls: ['./dutySlipMap.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class DutySlipMapComponent {

  mapUrl = '';
  dutySlipID: any;
  reservationID: any;
  type: any;

  constructor(
    private route: ActivatedRoute,
    private _generalService:GeneralService
  ) {}

  ngOnInit() {

    this.route.queryParams.subscribe(paramsData => {

     const encryptedDutySlipID = paramsData.dutySlipID;
      this.dutySlipID = this._generalService.decrypt(decodeURIComponent(encryptedDutySlipID));
      const encryptedReservationID = paramsData.reservationID;
      this.reservationID = Number(this._generalService.decrypt(decodeURIComponent(encryptedReservationID)));
      const encryptMapurl=paramsData.mapUrl;
      this.mapUrl = this._generalService.decrypt(decodeURIComponent(encryptMapurl));
    });
  }
}



