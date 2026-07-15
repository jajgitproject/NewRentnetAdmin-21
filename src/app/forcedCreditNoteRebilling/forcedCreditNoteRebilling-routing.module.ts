// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForcedCreditNoteRebillingComponent } from './forcedCreditNoteRebilling.component';

const routes: Routes = [
  {
    path: '',
    component: ForcedCreditNoteRebillingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForcedCreditNoteRebillingRoutingModule {}
