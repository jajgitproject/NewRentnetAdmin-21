// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NextDayInstructionDetailsComponent } from './NextDayInstructionDetails.component';
// import { NextDayInstructionDetailsComponent } from './NextDayInstructionDetails.component';

const routes: Routes = [
  {
    path: '',
    component: NextDayInstructionDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NextDayInstructionDetailsRoutingModule {}

