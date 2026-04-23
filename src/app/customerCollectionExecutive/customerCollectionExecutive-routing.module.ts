// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerCollectionExecutiveComponent } from './customerCollectionExecutive.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerCollectionExecutiveComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerCollectionExecutiveRoutingModule {}

