// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DutyTollParkingEntryComponent } from './dutyTollParkingEntry.component';

const routes: Routes = [
  {
    path: '',
    component: DutyTollParkingEntryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DutyTollParkingEntryRoutingModule {}

