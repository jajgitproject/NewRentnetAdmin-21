// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CancelAttotmentComponent } from './cancelAttotment.component';

const routes: Routes = [
  {
    path: '',
    component: CancelAttotmentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CancelAttotmentRoutingModule {}

