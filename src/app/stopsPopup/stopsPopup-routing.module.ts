// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StopsPopupComponent } from './stopsPopup.component';

const routes: Routes = [
  {
    path: '',
    component: StopsPopupComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StopsPopupRoutingModule {}

