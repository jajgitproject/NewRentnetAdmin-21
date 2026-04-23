// @ts-nocheck
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreditNoteHistoryComponent } from './creditnotehistory.component';

const routes: Routes = [
  {
    path: '',
    component: CreditNoteHistoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreditNoteHistoryRoutingModule { }


