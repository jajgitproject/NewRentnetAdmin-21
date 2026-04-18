// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerDesignationComponent } from './customerDesignation.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerDesignationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerDesignationRoutingModule {}

