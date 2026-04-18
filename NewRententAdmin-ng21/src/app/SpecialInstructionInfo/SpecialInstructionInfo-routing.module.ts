// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SpecialInstructionInfoComponent } from './SpecialInstructionInfo.component';

const routes: Routes = [
  {
    path: '',
    component: SpecialInstructionInfoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpecialInstructionInfoRoutingModule {}

