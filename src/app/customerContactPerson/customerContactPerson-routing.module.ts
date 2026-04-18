// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerContactPersonComponent } from './customerContactPerson.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerContactPersonComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerContactPersonRoutingModule {}

