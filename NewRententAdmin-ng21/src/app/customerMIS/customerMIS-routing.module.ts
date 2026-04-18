// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerMISComponent } from './customerMIS.component';


const routes: Routes = [
  {
    path: '',
    component: CustomerMISComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerMISRoutingModule {}

