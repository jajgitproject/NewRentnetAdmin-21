// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchDriverByLocationComponent } from './searchDriverByLocation.component';

const routes: Routes = [
  {
    path: '',
    component: SearchDriverByLocationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchDriverByLocationRoutingModule {}

