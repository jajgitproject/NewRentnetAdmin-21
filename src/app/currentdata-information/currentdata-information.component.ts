// @ts-nocheck
import { Component, Input, OnInit } from '@angular/core';
import { CurrentdataInformationService } from './currentdata-information.service';

@Component({
  standalone: false,
  selector: 'app-currentdata-information',
  templateUrl: './currentdata-information.component.html',
  styleUrls: ['./currentdata-information.component.sass']
})
export class CurrentdataInformationComponent implements OnInit {
   @Input() AllotmentID!: number;
  currentdataInformation: any;
    panelExpanded = false;

  constructor(private currentdataService: CurrentdataInformationService) {}

  ngOnInit(): void {
    if (this.AllotmentID) {
      // Initialization logic can go here
      this.loadCurrentdataInformation();
    }
   
  }

  loadCurrentdataInformation(): void {
    const allotmentID = this.AllotmentID; // Use the input property
    this.currentdataService.getCurrentdataInformationClosingData(allotmentID).subscribe(
      (data) => {
        if (data && data.length > 0) {
         console.log(data); // Assuming the response is an array and we want the first item
          this.currentdataInformation = data[0];
        } else {
          this.currentdataInformation = null;
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

