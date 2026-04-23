// @ts-nocheck
import { formatDate } from '@angular/common';
export class FetchDataFromAppDropDown {
  fetchDataFromAppDetailsID: number;
   fetchDataFromApp: string;

  constructor(fetchDataFromAppDropDown) {
    {
       this.fetchDataFromAppDetailsID = fetchDataFromAppDropDown.fetchDataFromAppDetailsID || -1;
       this.fetchDataFromApp = fetchDataFromAppDropDown.fetchDataFromApp || '';
    }
  }
  
}

