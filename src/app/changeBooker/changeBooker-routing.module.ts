// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChangeBookerComponent } from './changeBooker.component';

const routes: Routes = [
  {
    path: '',
    component: ChangeBookerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChangeBookerRoutingModule {}

