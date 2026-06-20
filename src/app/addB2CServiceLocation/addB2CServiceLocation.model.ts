
import { formatDate } from '@angular/common';
export class AddB2CServiceLocation {
   b2CServiceLocationID: number;
   b2CCityName: string;
   ecoCityID: number;
   ecoCityName: string;
   ecoServiceLocationID: number;
   ecoServiceLocation: string;
   createdBy: number;
   activationStatus: boolean;

  constructor(addB2CServiceLocation) {
    {
       this.b2CServiceLocationID = addB2CServiceLocation.b2CServiceLocationID || -1;
       this.b2CCityName = addB2CServiceLocation.b2CCityName || '';
       this.ecoCityID = addB2CServiceLocation.ecoCityID || 0;
       this.ecoCityName = addB2CServiceLocation.ecoCityName || '';
       this.ecoServiceLocationID = addB2CServiceLocation.ecoServiceLocationID || 0;
       this.ecoServiceLocation = addB2CServiceLocation.ecoServiceLocation || '';
       this.createdBy = addB2CServiceLocation.createdBy || 0;
       this.activationStatus = addB2CServiceLocation.activationStatus || '';
    }
  }
  
}

