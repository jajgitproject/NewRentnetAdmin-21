// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddCarAndDriverComponent } from './AddCarAndDriver.component';

const routes: Routes = [
  {
    path: '',
    component: AddCarAndDriverComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddCarAndDriverRoutingModule {}

