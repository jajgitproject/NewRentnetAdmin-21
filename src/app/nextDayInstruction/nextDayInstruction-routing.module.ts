// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NextDayInstructionComponent } from './nextDayInstruction.component';

const routes: Routes = [
  {
    path: '',
    component: NextDayInstructionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NextDayInstructionRoutingModule {}

