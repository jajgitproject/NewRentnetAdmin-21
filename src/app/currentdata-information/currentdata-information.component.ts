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
  currentdataInformation: any = null;
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
          this.currentdataInformation = data[0];
        } else {
          this.currentdataInformation = null;
        }
        // #region agent log
        fetch('http://127.0.0.1:7830/ingest/e71207c4-423e-4a42-a900-5bc43349cfbe',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'2871b3'},body:JSON.stringify({sessionId:'2871b3',runId:'run1',hypothesisId:'H4',location:'currentdata-information.component.ts:loadCurrentdataInformation-subscribe',message:'current data api response processed',data:{allotmentID:this.AllotmentID,hasRows:!!(data&&data.length),hasData:!!this.currentdataInformation},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
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

