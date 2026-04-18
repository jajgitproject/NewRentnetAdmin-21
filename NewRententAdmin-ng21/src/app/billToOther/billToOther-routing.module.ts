// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillToOtherComponent } from './billToOther.component';

const routes: Routes = [
  {
    path: '',
    component: BillToOtherComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillToOtherRoutingModule {}

