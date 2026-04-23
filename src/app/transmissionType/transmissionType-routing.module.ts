// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransmissionTypeComponent } from './transmissionType.component';

const routes: Routes = [
  {
    path: '',
    component: TransmissionTypeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransmissionTypeRoutingModule {}

