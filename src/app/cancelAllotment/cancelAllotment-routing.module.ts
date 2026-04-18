// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CancelAllotmentComponent } from './cancelAllotment.component';

const routes: Routes = [
  {
    path: '',
    component: CancelAllotmentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CancelAllotmentRoutingModule {}

