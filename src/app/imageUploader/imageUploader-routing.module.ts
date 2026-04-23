// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImageUploaderComponent } from './imageUploader.component';

const routes: Routes = [
  {
    path: '',
    component: ImageUploaderComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImageUploaderRoutingModule {}

