// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChangeCityComponent } from './changeCity.component';


const routes: Routes = [
  {
    path: '',
    component: ChangeCityComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChangeCityRoutingModule {}

