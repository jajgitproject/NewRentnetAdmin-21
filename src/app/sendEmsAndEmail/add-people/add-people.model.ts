// @ts-nocheck
import { formatDate } from '@angular/common';
export class AddPeople
{
  primaryMobile:string;
  customer:string;
  employee:string;
  addPeople:string;
  primaryEmail:string;
  employeeEmail:string;
  employeeMobile:string;
  numberMobile:string;
  numberEmail:string;
  isBooker:boolean;
  isPassenger:boolean;
  customerPersonID:number;
  name:string
  constructor(addPeople){
    {
      this.primaryMobile = addPeople.primaryMobile || '';
       this.addPeople = addPeople.addPeople || '';
       this.customer = addPeople.customer || '';
       this.employee = addPeople.addPeople || '';
    }
  }
}
