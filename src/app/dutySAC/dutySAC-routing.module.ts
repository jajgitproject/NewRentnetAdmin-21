// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DutySACComponent } from './dutySAC.component';

const routes: Routes = [
  {
    path: '',
    component: DutySACComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DutySACRoutingModule {}

