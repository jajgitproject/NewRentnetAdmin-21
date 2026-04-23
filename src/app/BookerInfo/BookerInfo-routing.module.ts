// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookerInfoComponent } from './BookerInfo.component';

const routes: Routes = [
  {
    path: '',
    component: BookerInfoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookerInfoRoutingModule {}

