// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerTypeComponent } from './customerType.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerTypeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerTypeRoutingModule {}

