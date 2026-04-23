// @ts-nocheck
import { formatDate } from '@angular/common';
export class TestDropDown {
 
   testID: number;
   name: string;

  constructor(testDropDown) {
    {
       this.testID = testDropDown.testID || -1;
       this.name = testDropDown.name || '';
    }
  }
  
}

