// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerPersonAlertMessagesComponent } from './customerPersonAlertMessages.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerPersonAlertMessagesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerPersonAlertMessagesRoutingModule {}

