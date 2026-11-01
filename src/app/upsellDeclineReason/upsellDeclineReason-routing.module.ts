// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UpsellDeclineReasonComponent } from './upsellDeclineReason.component';

const routes: Routes = [
  {
    path: '',
    component: UpsellDeclineReasonComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpsellDeclineReasonRoutingModule {}
