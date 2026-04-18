// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageGroupComponent } from './pageGroup.component';

const routes: Routes = [
  {
    path: '',
    component: PageGroupComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageGroupRoutingModule {}

