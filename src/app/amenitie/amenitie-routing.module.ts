// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AmenitieComponent } from './amenitie.component';

const routes: Routes = [
  {
    path: '',
    component: AmenitieComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AmenitieRoutingModule {}

