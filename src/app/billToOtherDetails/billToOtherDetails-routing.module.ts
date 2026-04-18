// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillToOtherDetailsComponent } from './billToOtherDetails.component';

const routes: Routes = [
  {
    path: '',
    component: BillToOtherDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillToOtherDetailsRoutingModule {}

