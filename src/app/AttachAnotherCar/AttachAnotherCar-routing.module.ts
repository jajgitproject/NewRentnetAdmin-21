// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AttachAnotherCarComponent } from './AttachAnotherCar.component';

const routes: Routes = [
  {
    path: '',
    component: AttachAnotherCarComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttachAnotherCarRoutingModule {}

