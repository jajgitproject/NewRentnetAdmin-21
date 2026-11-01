// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerGroupDSEmailsComponent } from './customerGroupDSEmails.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerGroupDSEmailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerGroupDSEmailsRoutingModule {}
