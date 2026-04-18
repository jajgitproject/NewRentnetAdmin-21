import { NO_ERRORS_SCHEMA } from '@angular/core';
import { matDialogTestProviders } from '@testing/mat-dialog-test-providers';
import { PageGroupService } from '../../pageGroup.service';
import { GeneralService } from '../../../general/general.service';
import { of } from 'rxjs';
// @ts-nocheck
import { formatDate } from '@angular/common';
export class PageGroupDropDown {
   pageGroupID: number;
   pageGroup: string;

  constructor(pageGroupDropDown) {
    {
       this.pageGroupID = pageGroupDropDown.pageGroupID || '';
       this.pageGroup = pageGroupDropDown.pageGroup || '';
    }
  }
  
}


