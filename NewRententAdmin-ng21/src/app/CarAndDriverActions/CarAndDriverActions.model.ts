// @ts-nocheck
import { formatDate } from '@angular/common';
export class CarAndDriverActions {
   CarAndDriverActionsID: number;
   CarAndDriverActions: string;
   activationStatus: string;
   updatedBy:number;
   updateDateTime: Date;

  constructor(CarAndDriverActions) {
    {
       this.CarAndDriverActionsID = CarAndDriverActions.CarAndDriverActionsID || -1;
       this.CarAndDriverActions = CarAndDriverActions.CarAndDriverActions || '';
       this.activationStatus = CarAndDriverActions.activationStatus || '';
       this.updatedBy=CarAndDriverActions.updatedBy || 10;
       this.updateDateTime = CarAndDriverActions.updateDateTime;
    }
  }
  
}

