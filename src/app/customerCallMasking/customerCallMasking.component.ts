import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { CustomerCallMaskingService } from './customerCallMasking.service';

@Component({
  standalone: false,
  selector: 'app-customerCallMasking',
  templateUrl: './customerCallMasking.component.html',
  styleUrls: ['./customerCallMasking.component.sass']
})
export class CustomerCallMaskingComponent implements OnInit {
  form = new FormGroup({
    femaleEnabled: new FormControl(true),
    maleEnabled: new FormControl(false)
  });
  isLoading = false;
  isSaving = false;

  constructor(
    private customerCallMaskingService: CustomerCallMaskingService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.load();
  }

  save(): void {
    this.isSaving = true;
    this.customerCallMaskingService.save({
      femaleEnabled: this.form.value.femaleEnabled === true,
      maleEnabled: this.form.value.maleEnabled === true
    }).subscribe(
      (setting) => {
        this.isSaving = false;
        this.apply(setting);
        this.snackBar.open('Saved', 'Close', { duration: 3000 });
      },
      (error) => {
        this.isSaving = false;
        this.snackBar.open(this.errorMessage(error, 'Call mask gender setting could not be saved.'), 'Close', { duration: 4000 });
      }
    );
  }

  private load(): void {
    this.isLoading = true;
    this.customerCallMaskingService.get().subscribe(
      (setting) => {
        this.apply(setting);
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        this.snackBar.open(this.errorMessage(error, 'Call mask gender setting could not be loaded.'), 'Close', { duration: 4000 });
      }
    );
  }

  private apply(setting: { femaleEnabled?: boolean; maleEnabled?: boolean }): void {
    this.form.patchValue({
      femaleEnabled: setting?.femaleEnabled === true,
      maleEnabled: setting?.maleEnabled === true
    });
  }

  private errorMessage(error: any, fallback: string): string {
    const message = error?.error?.message;
    if (typeof message === 'string' && message.trim()) {
      return message;
    }
    return fallback;
  }
}
