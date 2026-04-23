// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllotCarAndDriverComponent } from './allotCarAndDriver.component';

const routes: Routes = [
  {
    path: '',
    component: AllotCarAndDriverComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllotCarAndDriverRoutingModule {}

