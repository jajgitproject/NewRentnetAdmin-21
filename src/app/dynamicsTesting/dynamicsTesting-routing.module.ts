// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DynamicsTestingComponent } from './dynamicsTesting.component';

const routes: Routes = [
  {
    path: '',
    component: DynamicsTestingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DynamicsTestingRoutingModule {}
