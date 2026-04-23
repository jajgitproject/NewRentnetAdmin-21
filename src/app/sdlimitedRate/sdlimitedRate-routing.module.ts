// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SDLimitedRateComponent } from './sdlimitedRate.component';

const routes: Routes = [
  {
    path: '',
    component: SDLimitedRateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SDLimitedRateRoutingModule {}

