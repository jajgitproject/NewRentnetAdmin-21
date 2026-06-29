// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RebillingDataComponent } from './rebillingData.component';

const routes: Routes = [
  {
    path: '',
    component: RebillingDataComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RebillingDataRoutingModule {}
