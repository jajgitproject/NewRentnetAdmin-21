// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DutyAllotmentStatusSearchComponent } from './dutyAllotmentStatusSearch.component';

const routes: Routes = [
  {
    path: '',
    component: DutyAllotmentStatusSearchComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DutyAllotmentStatusSearchRoutingModule {}

