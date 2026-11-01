// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SendVendorClosingDataComponent } from './sendVendorClosingData.component';

const routes: Routes = [
  {
    path: '',
    component: SendVendorClosingDataComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SendVendorClosingDataRoutingModule {}
