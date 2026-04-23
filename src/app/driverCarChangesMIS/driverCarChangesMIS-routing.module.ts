// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DriverCarChangesMISComponent } from './driverCarChangesMIS.component';

const routes: Routes = [
  {
    path: '',
    component: DriverCarChangesMISComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriverCarChangesMISRoutingModule {}

