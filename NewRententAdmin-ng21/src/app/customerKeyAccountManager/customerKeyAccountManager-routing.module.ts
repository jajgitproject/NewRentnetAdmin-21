// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerKeyAccountManagerComponent } from './customerKeyAccountManager.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerKeyAccountManagerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerKeyAccountManagerRoutingModule {}

