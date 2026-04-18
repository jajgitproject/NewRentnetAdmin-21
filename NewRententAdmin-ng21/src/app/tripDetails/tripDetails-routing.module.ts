// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TripDetailsComponent } from './tripDetails.component';

const routes: Routes = [
  {
    path: '',
    component: TripDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TripDetailsRoutingModule {}

