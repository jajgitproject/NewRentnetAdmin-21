// @ts-nocheck
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LumpsuminformationComponent } from './lumpsum-information.component';


const routes: Routes = [
  {
    path: '',
    component: LumpsuminformationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LumpsuminformationRoutingModule {}

