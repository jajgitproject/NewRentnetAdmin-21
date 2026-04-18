// @ts-nocheck
import { formatDate } from '@angular/common';
export class Test {
   testID: number;
   name: string;
   gender: string;
   dob:Date;
   dobString:string;
   image:string
   salary:number;
   activationStatus: string;
   updatedBy:number;
   updateDateTime: Date;

  constructor(test) {
    {
       this.testID = test.testID || -1;
       this.name = test.name || '';
       this.gender = test.gender || '';
       this.dobString = test.dobString || '';
       this.salary = test.salary  || '';
       this.image = test.image  || '';
       this.activationStatus = test.activationStatus || '';
       this.updatedBy=test.updatedBy || 10;
       this.updateDateTime = test.updateDateTime;
       this.dob=new Date();
    }
  }
  
}

