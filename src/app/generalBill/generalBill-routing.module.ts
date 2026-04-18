// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GeneralBillComponent } from './generalBill.component';

const routes: Routes = [
  {
    path: '',
    component: GeneralBillComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneralBillRoutingModule {}

