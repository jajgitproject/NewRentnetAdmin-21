
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaxGarageInOutKMMinutesComponent } from './maxGarageInOutKMMinutes.component';

const routes: Routes = [
  {
    path: '',
    component: MaxGarageInOutKMMinutesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaxGarageInOutKMMinutesRoutingModule {}
