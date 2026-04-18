// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerAlertMessageDetailsComponent } from './customerAlertMessageDetails.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerAlertMessageDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerAlertMessageDetailsRoutingModule {}

