// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RejectedQCDriverPhotoComponent } from './rejectedQCDriverPhoto.component';

const routes: Routes = [
  {
    path: '',
    component: RejectedQCDriverPhotoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RejectedQCDriverPhotoRoutingModule {}
