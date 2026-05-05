// @ts-nocheck
import { Component, Input, OnInit } from '@angular/core';
import { CustomerInformationService } from './customer-information.service';
import { ActivatedRoute } from '@angular/router';
import { GeneralService } from '../general/general.service';

import { Subscription } from 'rxjs';

@Component({
  standalone: false,
  selector: 'app-customer-information',
  templateUrl: './customer-information.component.html',
  styleUrls: ['./customer-information.component.sass']
})
export class CustomerInformationComponent implements OnInit {
  @Input() AllotmentID: any;
  customerInformation: any = null;
  panelExpanded = false;
   allotmentID: any;
  constructor(private customerService: CustomerInformationService, 

    public route: ActivatedRoute, private _generalService: GeneralService) { }

  ngOnInit(): void {
     this.route.queryParams.subscribe(paramsData =>{
      const encryptedAllotmentID = paramsData.allotmentID;
      this.allotmentID = this._generalService.decrypt(decodeURIComponent(encryptedAllotmentID)); 
    });       
    this.loadCustomerInformation();
    // this.SubscribeUpdateService();
  }
    // if (this.allotmentID) {
    //   // Initialization logic can go here
    //   this.loadCustomerInformation();
    // }
  //}

  loadCustomerInformation(): void {
    const AllotmentID = this.AllotmentID; // Use the input property
    this.customerService.getCustomerInformationClosingData(AllotmentID).subscribe(
      (data) => {
        if (data && data.length > 0) {
          this.customerInformation = data[0];
        } else {
          this.customerInformation = null; // Handle case where no data is returned
        }
      },
      (error) => {
        console.error('Error fetching customer information:', error);
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

  //   showNotification(colorName, text, placementFrom, placementAlign) {
  //   this.snackBar.open(text, '', {
  //     duration: 2000,
  //     verticalPosition: placementFrom,
  //     horizontalPosition: placementAlign,
  //     panelClass: colorName
  //   });
  // }

   /////////////////To Recieve Updates Start////////////////////////////
    messageReceived: string;
    MessageArray:string[]=[];
    private subscriptionName: Subscription; //important to create a subscription
  
    // SubscribeUpdateService()
    // {
    //   this.subscriptionName=this._generalService.getUpdate().subscribe
    //   (
    //     message => 
    //     { 
    //       //message contains the data sent from service
    //       this.messageReceived = message.text;
    //       this.MessageArray=this.messageReceived.split(":");
    //       if(this.MessageArray.length==3)
    //       {
    //         if(this.MessageArray[0]=="ReservationClosingDetailsCreate")
    //         {
    //           if(this.MessageArray[1]=="ReservationClosingDetailsView")
    //           {
    //             if(this.MessageArray[2]=="Success")
    //             {
                  
    //               this.showNotification(
    //               'snackbar-success',
    //               'Reservation Details Created...!!!',
    //               'bottom',
    //               'center'
    //             );
    //             }
    //           }
    //         }
    //         else if(this.MessageArray[0]=="ReservationClosingDetailsUpdate")
    //         {
    //           if(this.MessageArray[1]=="ReservationClosingDetailsView")
    //           {
    //             if(this.MessageArray[2]=="Success")
    //             {
                 
    //              this.showNotification(
    //               'snackbar-success',
    //               'Reservation Details Updated...!!!',
    //               'bottom',
    //               'center'
    //             );
    //             }
    //           }
    //         }
    //         else if(this.MessageArray[0]=="ReservationClosingDetailsDelete")
    //         {
    //           if(this.MessageArray[1]=="ReservationClosingDetailsView")
    //           {
    //             if(this.MessageArray[2]=="Success")
    //             {
                 
    //              this.showNotification(
    //               'snackbar-success',
    //               'Reservation Details Deleted...!!!',
    //               'bottom',
    //               'center'
    //             );
    //             }
    //           }
    //         }
    //         else if(this.MessageArray[0]=="ReservationClosingDetailsAll")
    //         {
    //           if(this.MessageArray[1]=="ReservationClosingDetailsView")
    //           {
    //             if(this.MessageArray[2]=="Failure")
    //             {
                 
    //              this.showNotification(
    //               'snackbar-danger',
    //               'Operation Failed.....!!!',
    //               'bottom',
    //               'center'
    //             );
    //             }
    //           }
    //         }
    //         else if(this.MessageArray[0]=="DataNotFound")
    //         {
    //           if(this.MessageArray[1]=="DuplicacyError")
    //           {
    //             if(this.MessageArray[2]=="Failure")
    //             {
                 
    //              this.showNotification(
    //               'snackbar-danger',
    //               'Duplicate Value Found.....!!!',
    //               'bottom',
    //               'center'
    //             );
    //             }
    //           }
    //         }
    //       }
    //     }
    //   );
    // }

    
}


