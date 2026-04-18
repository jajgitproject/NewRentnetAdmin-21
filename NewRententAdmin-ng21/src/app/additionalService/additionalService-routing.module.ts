// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdditionalServiceComponent } from './additionalService.component';

const routes: Routes = [
  {
    path: '',
    component: AdditionalServiceComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdditionalServiceRoutingModule {}

