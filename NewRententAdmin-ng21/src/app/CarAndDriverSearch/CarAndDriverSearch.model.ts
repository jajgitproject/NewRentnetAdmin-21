// @ts-nocheck
import { formatDate } from '@angular/common';
export class CarAndDriverSearch {
   CarAndDriverSearchID: number;
   CarAndDriverSearch: string;
   activationStatus: string;
   updatedBy:number;
   updateDateTime: Date;

  constructor(CarAndDriverSearch) {
    {
       this.CarAndDriverSearchID = CarAndDriverSearch.CarAndDriverSearchID || -1;
       this.CarAndDriverSearch = CarAndDriverSearch.CarAndDriverSearch || '';
       this.activationStatus = CarAndDriverSearch.activationStatus || '';
       this.updatedBy=CarAndDriverSearch.updatedBy || 10;
       this.updateDateTime = CarAndDriverSearch.updateDateTime;
    }
  }
  
}

