// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MOPDetailsComponent } from './mopDetailsShow.component';

const routes: Routes = [
  {
    path: '',
    component: MOPDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MOPDetailsRoutingModule {}

