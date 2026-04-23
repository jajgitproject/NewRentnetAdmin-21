// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerBlockingComponent } from './customerBlocking.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerBlockingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerBlockingRoutingModule {}

