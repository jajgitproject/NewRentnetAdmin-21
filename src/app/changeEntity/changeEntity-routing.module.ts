// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChangeEntityComponent } from './changeEntity.component';

const routes: Routes = [
  {
    path: '',
    component: ChangeEntityComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChangeEntityRoutingModule {}

