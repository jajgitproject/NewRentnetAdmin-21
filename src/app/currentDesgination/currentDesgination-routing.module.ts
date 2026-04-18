// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CurrentDesginationComponent } from './currentDesgination.component';

const routes: Routes = [
  {
    path: '',
    component: CurrentDesginationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CurrentDesginationRoutingModule {}

