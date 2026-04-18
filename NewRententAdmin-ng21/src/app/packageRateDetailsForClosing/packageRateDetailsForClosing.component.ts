// @ts-nocheck
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GeneralService } from '../general/general.service';

import { Subscription } from 'rxjs';
import { PackageRateDetailsForClosingService } from './packageRateDetailsForClosing.service';

@Component({
  standalone: false,
  selector: 'app-packageRateDetailsForClosing',
  templateUrl: './packageRateDetailsForClosing.component.html',
  styleUrls: ['./packageRateDetailsForClosing.component.sass']
})
export class PackageRateDetailsForClosingComponent implements OnInit {
  @Input() DutySlipID;
  @Input() ReservationID;
  @Input() dataSourceforCard;
  allotmentID: any;
  panelExpanded: boolean = false;
  constructor(private packageRateDetailsForClosingService: PackageRateDetailsForClosingService, 

    public route: ActivatedRoute, private _generalService: GeneralService) { }

  ngOnInit(): void {
     this.route.queryParams.subscribe(paramsData =>{
      const encryptedAllotmentID = paramsData.allotmentID;
      this.allotmentID = this._generalService.decrypt(decodeURIComponent(encryptedAllotmentID)); 
             
    });       
    //this.loadDataForCard();
     console.log(this.dataSourceforCard);   
    // this.SubscribeUpdateService();
  }
    

  // loadDataForCard(): void {
  //   this.packageRateDetailsForClosingService.getPackageRateDetailsForClosingData(this.DutySlipID,this.ReservationID).subscribe(
  //     (data) => {
  //       if (data && data.length > 0) {
  //         this.dataSourceforCard = data;
  //         console.log(data) // Assuming the response is an array and we want the first item
  //       } else {
  //         this.dataSourceforCard = null; // Handle case where no data is returned
  //       }
  //     },
  //     (error) => {
  //       console.error('Error fetching Package information:', error);
  //     }
  //   );
  // }
  getHoursAndMinutes(totalMinutes: number): { hours: number; minutes: number } {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return { hours, minutes };
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


