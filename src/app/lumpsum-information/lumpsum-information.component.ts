// @ts-nocheck
import { Component, Input, OnInit } from '@angular/core';
import { GeneralService } from '../general/general.service';
import { ActivatedRoute } from '@angular/router';
import { LumpsuminformationService } from './lumpsum-information.service';

@Component({
  standalone: false,
  selector: 'app-lumpsum-information',
  templateUrl: './lumpsum-information.component.html',
  styleUrls: ['./lumpsum-information.component.sass']
})
export class LumpsuminformationComponent implements OnInit {
   @Input() AllotmentID!: number;
  @Input() reservationID!: number;
  lumpsuminformation: any;
    panelExpanded = false;
  allotmentID: any;
  ReservationID: any;

  constructor(private lumpsuminformationService: LumpsuminformationService,
    private route: ActivatedRoute, 
    private _generalService: GeneralService
  ) {}

  // ngOnInit(): void {
  //   if (this.AllotmentID) {
  //     // Initialization logic can go here
  //     this.loadLumpsuminformation();
  //   }
   
  // }
  ngOnInit(): void {
     this.route.queryParams.subscribe(paramsData =>{
      const encryptedReservationID = paramsData.reservationID;
      this.ReservationID = this._generalService.decrypt(decodeURIComponent(encryptedReservationID));
    });       
    this.loadLumpsuminformation();
    // this.SubscribeUpdateService();
  }

 loadLumpsuminformation(): void {
  const reservationID = this.ReservationID;
  this.lumpsuminformationService.getLumpsuminformationClosingData(reservationID).subscribe(
    (data) => {
      if (data && data.length > 0) {
        this.lumpsuminformation = data[0];
      } else {
        console.warn('No data received from API');
        this.lumpsuminformation = null;
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

