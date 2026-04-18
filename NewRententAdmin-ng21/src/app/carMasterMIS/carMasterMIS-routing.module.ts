// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CarMasterMISComponent } from './carMasterMIS.component';

const routes: Routes = [
  {
    path: '',
    component: CarMasterMISComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarMasterMISRoutingModule {}

