// @ts-nocheck
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreditNoteApprovalComponent } from './creditNoteApproval.component';

const routes: Routes = [
  {
    path: '',
    component: CreditNoteApprovalComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreditNoteApprovalRoutingModule {}

