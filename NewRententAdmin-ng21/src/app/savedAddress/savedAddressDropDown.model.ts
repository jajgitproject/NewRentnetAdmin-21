// @ts-nocheck
import { formatDate } from '@angular/common';
export class SavedAddressDropDown {
 
   savedAddressID: number;
   savedAddressName: string;

  constructor(savedAddressDropDown) {
    {
       this.savedAddressID = savedAddressDropDown.savedAddressID || -1;
       this.savedAddressName = savedAddressDropDown.savedAddressName || '';
    }
  }
  
}

