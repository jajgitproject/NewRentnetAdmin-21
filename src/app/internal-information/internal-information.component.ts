// @ts-nocheck
import { Component, Input, OnInit } from '@angular/core';
import { GeneralService } from '../general/general.service';
import { ActivatedRoute } from '@angular/router';
import { IternallinformationService } from './internal-information.service';

@Component({
  standalone: false,
  selector: 'app-internal-information',
  templateUrl: './internal-information.component.html',
  styleUrls: ['./internal-information.component.sass']
})
export class IternallinformationComponent implements OnInit {
   @Input() AllotmentID!: number;
  @Input() reservationID!: number;
  iternallinformation: any = null;
    panelExpanded :boolean = false;
  allotmentID: any;
  ReservationID: any;

  constructor(private iternallinformationService: IternallinformationService,
    private route: ActivatedRoute, 
    private _generalService: GeneralService
  ) {}

  // ngOnInit(): void {
  //   if (this.AllotmentID) {
  //     // Initialization logic can go here
  //     this.loadIternallinformation();
  //   }
   
  // }
  ngOnInit(): void {
     this.route.queryParams.subscribe(paramsData =>{
      const encryptedReservationID = paramsData.reservationID;
      this.ReservationID = this._generalService.decrypt(decodeURIComponent(encryptedReservationID));
    });       
    this.loadIternallinformation();
    // this.SubscribeUpdateService();
  }

 loadIternallinformation(): void {
  const reservationID = this.ReservationID;
  this.iternallinformationService.getIternallinformationClosingData(reservationID).subscribe(
    (data) => {
      if (data && data.length > 0) {
        this.iternallinformation = data[0];
      } else {
        console.warn('No data received from API');
        this.iternallinformation = null;
      }
    },
    (error) => {
      console.error('Error fetching current data information:', error);
    }
  );
}

 togglePanel(): void {
    this.panelExpanded = !this.panelExpanded;

    // Optional: scroll into view only on expand
    if (this.panelExpanded) {
      setTimeout(() => this.scrollToLinkButton(), 300); // wait for animation
    }
  }

  scrollToLinkButton() {
    const element = document.getElementById('linkButtonSection');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  onPanelOpen(): void {
    // Optional logic on open
  }

  onPanelClose(): void {
    // Optional logic on close
  }
}

