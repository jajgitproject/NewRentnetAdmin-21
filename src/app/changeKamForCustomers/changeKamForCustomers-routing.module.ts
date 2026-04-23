// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChangeKamForCustomersComponent } from './changeKamForCustomers.component';

const routes: Routes = [
  {
    path: '',
    component: ChangeKamForCustomersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChangeKamForCustomersRoutingModule {}

