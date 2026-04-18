// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerSpecificFieldsComponent } from './customerSpecificFields.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerSpecificFieldsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerSpecificFieldsRoutingModule {}

