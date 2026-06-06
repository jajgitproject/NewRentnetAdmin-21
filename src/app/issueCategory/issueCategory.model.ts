// @ts-nocheck
import { formatDate } from '@angular/common';
export class IssueCategory {
  issueCategoryID: number;
   issueCategory: string;
   severity: string;
   userID:number;
    incidenceTypeID: number;
    incidenceType: string;
   activationStatus: boolean;
   departmentID:number;
   department:string;

  constructor(issueCategory) {
    {
       this.issueCategoryID = issueCategory.issuecategoryID || -1;
       this.issueCategory = issueCategory.issuecategory || '';
       this.severity = issueCategory.severity || '';
        this.incidenceTypeID = issueCategory.incidenceTypeID || -1;
        this.incidenceType = issueCategory.incidenceType || '';
       this.activationStatus = issueCategory.activationStatus || '';
        this.departmentID = issueCategory.departmentID || '';
        this.department = issueCategory.department || '';

    }
  }
  
}

