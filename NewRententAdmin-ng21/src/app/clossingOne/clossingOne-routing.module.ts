// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClossingOneComponent } from './clossingOne.component';

const routes: Routes = [
  {
    path: '',
    component: ClossingOneComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClossingOneRoutingModule {}

