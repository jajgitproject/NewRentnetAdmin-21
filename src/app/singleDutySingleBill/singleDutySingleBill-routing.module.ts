// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SingleDutySingleBillComponent } from './singleDutySingleBill.component';

const routes: Routes = [
  {
    path: '',
    component: SingleDutySingleBillComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SingleDutySingleBillRoutingModule {}

