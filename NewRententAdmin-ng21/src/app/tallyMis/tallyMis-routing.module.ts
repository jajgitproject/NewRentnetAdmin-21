// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TallyMisComponent } from './tallyMis.component';


const routes: Routes = [
  {
    path: '',
    component: TallyMisComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TallyMisRoutingModule {}

