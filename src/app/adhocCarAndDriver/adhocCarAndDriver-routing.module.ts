// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdhocCarAndDriverComponent } from './adhocCarAndDriver.component';

const routes: Routes = [
  {
    path: '',
    component: AdhocCarAndDriverComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdhocCarAndDriverRoutingModule {}

