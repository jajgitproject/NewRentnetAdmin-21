// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ServiceTypeComponent } from './serviceType.component';

const routes: Routes = [
  {
    path: '',
    component: ServiceTypeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceTypeRoutingModule {}

