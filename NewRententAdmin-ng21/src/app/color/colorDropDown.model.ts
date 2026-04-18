// @ts-nocheck
import { formatDate } from '@angular/common';
export class ColorDropDown {
   colorID: number;
   color: string;

  constructor(colorDropDown) {
    {
       this.colorID = colorDropDown.colorID || -1;
       this.color = colorDropDown.color || '';
    }
  }
  
}

