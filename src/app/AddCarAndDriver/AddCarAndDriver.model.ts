// @ts-nocheck
import { formatDate } from '@angular/common';
export class AddCarAndDriver {
   AddCarAndDriverID: number;
   AddCarAndDriver: string;
   activationStatus: string;
   updatedBy:number;
   updateDateTime: Date;

  constructor(AddCarAndDriver) {
    {
       this.AddCarAndDriverID = AddCarAndDriver.AddCarAndDriverID || -1;
       this.AddCarAndDriver = AddCarAndDriver.AddCarAndDriver || '';
       this.activationStatus = AddCarAndDriver.activationStatus || '';
       this.updatedBy=AddCarAndDriver.updatedBy || 10;
       this.updateDateTime = AddCarAndDriver.updateDateTime;
    }
  }
  
}

