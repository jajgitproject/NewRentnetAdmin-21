// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerCategorySoldOutConfigComponent } from './customerCategorySoldOutConfig.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerCategorySoldOutConfigComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerCategorySoldOutConfigRoutingModule {}
