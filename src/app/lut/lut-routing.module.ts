// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LutComponent } from './lut.component';

const routes: Routes = [
  {
    path: '',
    component: LutComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LutRoutingModule {}

