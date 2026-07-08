// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DynamicsMis20Component } from './dynamicsMis.component';

const routes: Routes = [
  {
    path: '',
    component: DynamicsMis20Component
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DynamicsMis20RoutingModule {}
