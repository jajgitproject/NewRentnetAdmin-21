// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SetAsCustomerKAMComponent } from './setAsCustomerKAM.component';


const routes: Routes = [
  {
    path: '',
    component: SetAsCustomerKAMComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SetAsCustomerKAMRoutingModule {}

