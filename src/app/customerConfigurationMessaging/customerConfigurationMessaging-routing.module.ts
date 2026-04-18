// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerConfigurationMessagingComponent } from './customerConfigurationMessaging.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerConfigurationMessagingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerConfigurationMessagingRoutingModule {}

