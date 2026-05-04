// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChangeDutyTypeClosingComponent } from './changeDutyTypeClosing.component';


const routes: Routes = [
  {
    path: '',
    component: ChangeDutyTypeClosingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChangeDutyTypeClosingRoutingModule {}

