// @ts-nocheck
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Component, ElementRef, HostListener, Input, inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
@Component({
  standalone: false,
    selector: 'app-file-upload',
    templateUrl: './file-upload.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: FileUploadComponent,
            multi: true,
        },
    ],
    styleUrls: ['./file-upload.component.scss'],
    imports: [MatButtonModule]
})
export class FileUploadComponent implements ControlValueAccessor {
  private host = inject<ElementRef<HTMLInputElement>>(ElementRef);

  onChange!: (value: File | null) => void;
  public file: File | null = null;

  @HostListener('change', ['$event']) emitFiles(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target?.files?.item(0);
    if (file) {
      this.onChange(file);
      this.file = file;
    }
  }

  writeValue(value: null) {
    // clear file input
    this.host.nativeElement.value = '';
    this.file = null;
  }

  registerOnChange(fn: (value: File | null) => void) {
    this.onChange = fn;
  }

  registerOnTouched(_fn: () => void) {
    // add code here
  }
}


