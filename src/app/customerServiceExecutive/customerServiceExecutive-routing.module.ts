// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerServiceExecutiveComponent } from './customerServiceExecutive.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerServiceExecutiveComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerServiceExecutiveRoutingModule {}

