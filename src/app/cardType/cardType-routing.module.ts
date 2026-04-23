// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CardTypeComponent } from './cardType.component';

const routes: Routes = [
  {
    path: '',
    component: CardTypeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CardTypeRoutingModule {}

