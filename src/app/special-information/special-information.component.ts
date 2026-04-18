// @ts-nocheck
import { Component, Input, OnInit } from '@angular/core';
import { SpecialinformationService } from './special-information.service';
import { GeneralService } from '../general/general.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-special-information',
  templateUrl: './special-information.component.html',
  styleUrls: ['./special-information.component.sass']
})
export class SpecialinformationComponent implements OnInit {
   @Input() AllotmentID!: number;
  specialinformation: any;
    panelExpanded = false;
  allotmentID: any;

  constructor(private specialinformationService: SpecialinformationService,
    private route: ActivatedRoute, 
    private _generalService: GeneralService
  ) {}

  // ngOnInit(): void {
  //   if (this.AllotmentID) {
  //     console.log("AllotmentID passed to component:", this.AllotmentID);
  //     // Initialization logic can go here
  //     this.loadSpecialinformation();
  //   }
   
  // }
  ngOnInit(): void {
     this.route.queryParams.subscribe(paramsData =>{
      const encryptedAllotmentID = paramsData.allotmentID;
      this.allotmentID = this._generalService.decrypt(decodeURIComponent(encryptedAllotmentID)); 
        console.log(this.AllotmentID);
        console.log(this.allotmentID);           
    });       
    this.loadSpecialinformation();
    // this.SubscribeUpdateService();
  }

 loadSpecialinformation(): void {
  const allotmentID = this.AllotmentID;
  this.specialinformationService.getSpecialinformationClosingData(allotmentID).subscribe(
    (data) => {
      console.log('Data from API:', data); // ✅ DEBUG
      if (data && data.length > 0) {
        this.specialinformation = data[0];
        console.log('Setting specialinformation:', this.specialinformation); // ✅ DEBUG
      } else {
        console.warn('No data received from API');
        this.specialinformation = null;
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

