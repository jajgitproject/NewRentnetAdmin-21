// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DriverGradeComponent } from './driverGrade.component';

const routes: Routes = [
  {
    path: '',
    component: DriverGradeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriverGradeRoutingModule {}

