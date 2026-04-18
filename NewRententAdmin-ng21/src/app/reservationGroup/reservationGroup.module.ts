// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReservationGroupComponent } from './reservationGroup.component';
import { FormDialogComponent as advanceTableForm } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MaterialFileInputModule } from '@compat/material-file-input-shim';
import { MatMenuModule } from '@angular/material/menu';
import { ReservationGroupService } from './reservationGroup.service';
import { ReservationGroupRoutingModule } from './reservationGroup-routing.module';
import { MyUploadComponent } from '../myupload/myupload.component';
import { MyUploadModule } from '../myupload/myupload.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CustomerPersonService } from '../customerPerson/customerPerson.service';
import { CustomerShortService } from '../customerShort/customerShort.service';
import { CustomerAlertMessageDetailsService } from '../customerAlertMessageDetails/customerAlertMessageDetails.service';
import { ReservationGroupDetailsService } from '../reservationGroupDetails/reservationGroupDetails.service';

@NgModule({
  declarations: [
    ReservationGroupComponent,
    advanceTableForm,
    DeleteDialogComponent
  ],
  imports: [
    MatAutocompleteModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ReservationGroupRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatSelectModule,
    MatCheckboxModule,
    MatCardModule,
    MatDatepickerModule,
    MatDialogModule,
    MatSortModule,
    MatToolbarModule,
    MaterialFileInputModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MyUploadModule,
    MatTooltipModule
  ],
  providers: [ReservationGroupService,
    CustomerShortService,
    CustomerPersonService,
    CustomerAlertMessageDetailsService,
    ReservationGroupDetailsService
  ]
})
export class ReservationGroupModule {}


