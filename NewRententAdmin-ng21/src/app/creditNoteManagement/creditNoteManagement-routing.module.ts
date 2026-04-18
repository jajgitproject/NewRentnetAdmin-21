// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreditNoteManagementComponent } from './creditNoteManagement.component';

const routes: Routes = [
  {
    path: '',
    component: CreditNoteManagementComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreditNoteManagementRoutingModule {}

