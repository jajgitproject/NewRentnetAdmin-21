// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CappingFacilityConfigComponent } from './cappingFacilityConfig.component';

const routes: Routes = [
  {
    path: '',
    component: CappingFacilityConfigComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CappingFacilityConfigRoutingModule {}
