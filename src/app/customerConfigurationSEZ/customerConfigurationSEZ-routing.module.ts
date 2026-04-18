// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerConfigurationSEZComponent } from './customerConfigurationSEZ.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerConfigurationSEZComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerConfigurationSEZRoutingModule {}

