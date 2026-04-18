// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DisputeHistoryComponent } from './disputeHistory.component';


const routes: Routes = [
  {
    path: '',
    component: DisputeHistoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DisputeHistoryRoutingModule {}

