// @ts-nocheck
import { formatDate } from '@angular/common';
export class Page 
{
   pageID: number;
   page: string;
   path: string;
   title: string;
   moduleName: string;
   icon: string;
   class: string;
   groupTitle: string;
   menuIndex: number;
   parentMenuID: number;
   parentMenuName : string;
   isItTopMenu: string;
   remark: string;
   activationStatus: boolean;
   pageGroup:string;
   pageGroupID:number;
   
  constructor(page) 
  {
    {
       this.pageID = page.pageID || -1;
       this.page = page.page || '';
       this.path = page.path  || '';
       this.title = page.title  || '';
       this.moduleName = page.moduleName  || '';
       this.icon = page.icon  || 'fab fa-envira';
       this.class = page.class  || '';
       this.groupTitle = page.groupTitle  || 'false';
       this.menuIndex = page.menuIndex  || '';
       this.parentMenuID = page.parentMenuID || -1;
       this.parentMenuName = page.parentMenuName || '';
       this.isItTopMenu = page.isItTopMenu   || '';
       this.remark = page.remark  || '';
       this.activationStatus = page.activationStatus || '';
       this.pageGroup = page.pageGroup || '';
       this.pageGroupID = page.pageGroupID || '';
    
    }
  }  
}

