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
  specialinformation: any = null;
    panelExpanded = false;
  allotmentID: any;

  constructor(private specialinformationService: SpecialinformationService,
    private route: ActivatedRoute, 
    private _generalService: GeneralService
  ) {}

  // ngOnInit(): void {
  //   if (this.AllotmentID) {
  //     // Initialization logic can go here
  //     this.loadSpecialinformation();
  //   }
   
  // }
  ngOnInit(): void {
     this.route.queryParams.subscribe(paramsData =>{
      const encryptedAllotmentID = paramsData.allotmentID;
      this.allotmentID = this._generalService.decrypt(decodeURIComponent(encryptedAllotmentID)); 
    });       
    this.loadSpecialinformation();
    // #region agent log
    fetch('http://127.0.0.1:7830/ingest/e71207c4-423e-4a42-a900-5bc43349cfbe',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'2871b3'},body:JSON.stringify({sessionId:'2871b3',runId:'run1',hypothesisId:'H5',location:'special-information.component.ts:ngOnInit',message:'special information init',data:{allotmentIDInput:this.AllotmentID,queryAllotmentID:this.allotmentID},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    // this.SubscribeUpdateService();
  }

 loadSpecialinformation(): void {
  const allotmentID = this.AllotmentID;
  this.specialinformationService.getSpecialinformationClosingData(allotmentID).subscribe(
    (data) => {
      if (data && data.length > 0) {
        this.specialinformation = data[0];
      } else {
        console.warn('No data received from API');
        this.specialinformation = null;
      }
      // #region agent log
      fetch('http://127.0.0.1:7830/ingest/e71207c4-423e-4a42-a900-5bc43349cfbe',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'2871b3'},body:JSON.stringify({sessionId:'2871b3',runId:'run1',hypothesisId:'H5',location:'special-information.component.ts:loadSpecialinformation-subscribe',message:'special information api response processed',data:{allotmentIDInput:this.AllotmentID,hasRows:!!(data&&data.length),hasData:!!this.specialinformation},timestamp:Date.now()})}).catch(()=>{});
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

