// @ts-nocheck
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationAuditSettingsComponent } from './applicationAuditSettings.component';

const routes: Routes = [{ path: '', component: ApplicationAuditSettingsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplicationAuditSettingsRoutingModule {}
