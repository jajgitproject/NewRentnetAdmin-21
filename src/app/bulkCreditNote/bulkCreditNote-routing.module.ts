import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BulkCreditNoteComponent } from './bulkCreditNote.component';

const routes: Routes = [
  {
    path: '',
    component: BulkCreditNoteComponent,
    data: {
      requiredPageKey: 'Bulk Credit Note',
      alternatePageKeys: ['bulkCreditNote', 'createCreditNote', 'creditNoteApproval', 'creditNoteHome'],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BulkCreditNoteRoutingModule {}
