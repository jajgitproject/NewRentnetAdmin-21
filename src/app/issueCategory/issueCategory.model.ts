// @ts-nocheck
import { formatDate } from '@angular/common';
export class IssueCategory {
  issueCategoryID: number;
   issueCategory: string;
   userID:number;
    incidenceTypeID: number;
    incidenceType: string;
   activationStatus: boolean;

  constructor(issueCategory) {
    {
       this.issueCategoryID = issueCategory.issuecategoryID || -1;
       this.issueCategory = issueCategory.issuecategory || '';
        this.incidenceTypeID = issueCategory.incidenceTypeID || -1;
        this.incidenceType = issueCategory.incidenceType || '';
       this.activationStatus = issueCategory.activationStatus || '';
    }
  }
  
}

