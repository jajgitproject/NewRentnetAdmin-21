// @ts-nocheck
import { Component, OnInit,} from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { GeneralService } from '../general/general.service';
@Component({
  standalone: false,
  selector: 'app-bookingScreen',
  templateUrl: './bookingScreen.component.html',
  styleUrls: ['./bookingScreen.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class BookingScreenComponent implements OnInit {
  ReservationID: any;
  action: any;
  ReservationGroupID: string;
  status: any;
  buttonDisabled: boolean = false;
  constructor(public route:ActivatedRoute,public _generalService: GeneralService
  ) {}
  ngOnInit() 
  {
    this.route.queryParams.subscribe(paramsData =>{
      
      const encryptedReservationID   = paramsData.reservationID;
      const encryptedReservationGroupID   = paramsData.reservationGroupID;
      const encryptedAction   = paramsData.action;
      const encryptedStatus   = paramsData.status;
      
      
      this.ReservationID = this._generalService.decrypt(decodeURIComponent(encryptedReservationID));
      this.ReservationGroupID = this._generalService.decrypt(decodeURIComponent(encryptedReservationGroupID));
      this.action = this._generalService.decrypt(decodeURIComponent(encryptedAction));
      
      // Decrypt status if available in query params
      if(encryptedStatus) {
        this.status = this._generalService.decrypt(decodeURIComponent(encryptedStatus));
      } else {
        this.status = '';
      }
      
        this.buttonDisabled = this.status !== 'Changes allow';
    });
  }

 
}

        


