import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { IntegrationHealthComponent } from './integrationHealth.component';
import { IntegrationHealthRoutingModule } from './integrationHealth-routing.module';
import { IntegrationHealthService } from './integrationHealth.service';

@NgModule({
  declarations: [IntegrationHealthComponent],
  imports: [
    CommonModule,
    FormsModule,
    IntegrationHealthRoutingModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule
  ],
  providers: [IntegrationHealthService]
})
export class IntegrationHealthModule {}
