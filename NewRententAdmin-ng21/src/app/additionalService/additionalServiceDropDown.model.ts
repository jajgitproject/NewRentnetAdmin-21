// @ts-nocheck
import { formatDate } from '@angular/common';
export class AdditionalServiceDropDown {
   additionalServiceID: number;
   additionalService: string;

  constructor(additionalServiceDropDown) 
    {
       this.additionalServiceID = additionalServiceDropDown.additionalServiceID || -1;
       this.additionalService = additionalServiceDropDown.additionalService|| '';
    }
  }

