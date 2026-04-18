// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SpecialInstructionComponent } from './specialInstruction.component';

const routes: Routes = [
  {
    path: '',
    component: SpecialInstructionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpecialInstructionRoutingModule {}

