// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GarageInComponent } from './garageIn.component';

const routes: Routes = [
  {
    path: '',
    component: GarageInComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GarageInRoutingModule {}

