// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PersonShortComponent } from './personShort.component';

const routes: Routes = [
  {
    path: '',
    component: PersonShortComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonShortRoutingModule {}

