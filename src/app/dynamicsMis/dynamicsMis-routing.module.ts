// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DynamicsMisComponent } from './dynamicsMis.component';

const routes: Routes = [
  {
    path: '',
    component: DynamicsMisComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DynamicsMisRoutingModule {}
