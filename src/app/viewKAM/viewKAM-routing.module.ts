// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewKAMComponent } from './viewKAM.component';

const routes: Routes = [
  {
    path: '',
    component: ViewKAMComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewKAMRoutingModule {}

