// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerPersonInstructionComponent } from './customerPersonInstruction.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerPersonInstructionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerPersonInstructionRoutingModule {}

