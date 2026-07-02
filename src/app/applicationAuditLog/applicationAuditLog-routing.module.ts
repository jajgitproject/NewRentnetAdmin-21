// @ts-nocheck
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationAuditLogComponent } from './applicationAuditLog.component';

const routes: Routes = [{ path: '', component: ApplicationAuditLogComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplicationAuditLogRoutingModule {}
