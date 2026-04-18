// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SingleDutySingleBillForLocalComponent } from './SingleDutySingleBillForLocal.component';

const routes: Routes = [
  {
    path: '',
    component: SingleDutySingleBillForLocalComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SingleDutySingleBillForLocalRoutingModule {}

