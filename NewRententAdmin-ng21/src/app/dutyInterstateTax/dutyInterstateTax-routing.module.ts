// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DutyInterstateTaxComponent } from './dutyInterstateTax.component';

const routes: Routes = [
  {
    path: '',
    component: DutyInterstateTaxComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DutyInterstateTaxRoutingModule {}

