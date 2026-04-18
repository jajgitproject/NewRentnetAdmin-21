// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreditNoteHomeComponent } from './creditNoteHome.component';


const routes: Routes = [
  {
    path: '',
    component: CreditNoteHomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreditNoteHomeRoutingModule {}

