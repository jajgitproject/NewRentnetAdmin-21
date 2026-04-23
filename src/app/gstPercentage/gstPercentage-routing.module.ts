// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GSTPercentageComponent } from './gstPercentage.component';

const routes: Routes = [
  {
    path: '',
    component: GSTPercentageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GSTPercentageRoutingModule {}

