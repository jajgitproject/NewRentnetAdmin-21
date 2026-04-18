// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerPersonPreferedDriverComponent } from './customerPersonPreferedDriver.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerPersonPreferedDriverComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerPersonPreferedDriverRoutingModule {}

