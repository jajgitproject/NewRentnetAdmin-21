// @ts-nocheck
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
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
import { MyUploadComponent } from '../myupload/myupload.component';
import { MyUploadModule } from '../myupload/myupload.module';
import { CurrentDesginationService } from '../currentDesgination/currentDesgination.service';
//import { CurrentDesgination } from '../currentDesgination/currentDesgination.model';
import { CurrentDesginationModule } from '../currentDesgination/currentDesgination.module';
import { CurrentDesginationComponent } from '../currentDesgination/currentDesgination.component';
import { OrganizationalEntityStakeHoldersService } from '../organizationalEntityStakeHolders/organizationalEntityStakeHolders.service';
import { BrowserModule } from '@angular/platform-browser';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UnlockEmployeeService } from './unlockEmployee.service';
import { UnlockEmployeeComponent } from './unlockEmployee.component';
import { UnlockEmployeeRoutingModule } from './unlockEmployee-routing.module';
import { UnlockDialogComponent } from './dialogs/unlock/unlock.component';

// import { TwoDigitDecimaNumberDirective } from './twodigitdecimalnumber.directive';

@NgModule({
  declarations: [
    UnlockEmployeeComponent,
    UnlockDialogComponent
    // advanceTableForm,
    // DeleteDialogComponent,
   //CurrentDesginationComponent
  ],
  imports: [
    //BrowserModule,
    CommonModule,
    FormsModule,
    MatTooltipModule,
    ReactiveFormsModule,
    UnlockEmployeeRoutingModule,
    MatAutocompleteModule,
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
    CurrentDesginationModule
    //TwoDigitDecimaNumberDirective
  ],
  //entryComponents:[CurrentDesginationComponent],
  providers: [UnlockEmployeeService]
})
export class UnlockEmployeeModule {}


