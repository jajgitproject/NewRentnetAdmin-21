// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerCarAndDriverDetailsSMSEMailComponent } from './customerCarAndDriverDetailsSMSEMail.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerCarAndDriverDetailsSMSEMailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerCarAndDriverDetailsSMSEMailRoutingModule {}

