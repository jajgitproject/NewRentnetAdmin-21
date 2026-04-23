// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TollParkingISTImagesComponent } from './TollParkingISTImages.component';

const routes: Routes = [
  {
    path: '',
    component: TollParkingISTImagesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TollParkingISTImagesRoutingModule {}

