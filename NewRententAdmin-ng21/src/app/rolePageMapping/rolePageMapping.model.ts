// @ts-nocheck
import { formatDate } from '@angular/common';
export class RolePageMapping {
  rolePageMappingID: number;
  roleID: number;
  role: string;
  pageID: number;
  page: string;
  activationStatus: boolean;
  pageGroup:string;
  pageGroupID:number;
 
  constructor(rolePageMapping) {
    {
        this.rolePageMappingID =  -1;
      //   this.roleID =  -1;
      //  this.role =  '';
      //  this.pageID =  -1;
      //  this.page =  '';
      //  this.activationStatus =  true;
      this.roleID = rolePageMapping?.roleID || '';
       this.role = rolePageMapping?.role || '';
       this.pageID = rolePageMapping?.pageID || '';
       this.page = rolePageMapping?.page  || '';
       this.pageGroupID = rolePageMapping?.pageGroupID || '';
       this.pageGroup = rolePageMapping?.pageGroup  || '';
       this.activationStatus = rolePageMapping?.activationStatus || '';

    }
  }
  
}

