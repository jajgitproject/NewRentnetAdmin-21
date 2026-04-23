// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerContractComponent } from './customerContract.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerContractComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerContractRoutingModule {}

