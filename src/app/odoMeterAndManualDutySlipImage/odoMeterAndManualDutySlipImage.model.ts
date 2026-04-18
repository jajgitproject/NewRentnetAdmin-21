// @ts-nocheck
import { formatDate } from '@angular/common';
export class OdoMeterAndManualDutySlipImage {
   dutySlipImage:string;
   tripEndODOMeterImage:string;
   tripStartODOMeterImage:string;  
  
 constructor(odoMeterAndManualDutySlipImage) {
   {
    
      this.dutySlipImage = odoMeterAndManualDutySlipImage.dutySlipImage || '';
      this.tripEndODOMeterImage = odoMeterAndManualDutySlipImage.tripEndODOMeterImage || '';
      this.tripStartODOMeterImage = odoMeterAndManualDutySlipImage.tripStartODOMeterImage || '';
     
   }
 }
}

 
