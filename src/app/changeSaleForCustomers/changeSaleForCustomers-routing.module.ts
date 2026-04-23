// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChangeSaleForCustomersComponent } from './changeSaleForCustomers.component';

const routes: Routes = [
  {
    path: '',
    component: ChangeSaleForCustomersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChangeSaleForCustomersRoutingModule {}

