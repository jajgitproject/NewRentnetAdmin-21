import { Component, Directive, Input, NgModule } from '@angular/core';

@Directive({
  selector: 'input[ngxMatFileInput]',
  standalone: false,
})
export class NgxMatFileInputDirective {
  @Input() placeholder: string | undefined;
}

@Component({
  selector: 'ngx-mat-file-input',
  template: '',
  standalone: false,
})
export class NgxMatFileInputComponent {
  @Input() placeholder: string | undefined;
  @Input() accept: string | undefined;
}

@NgModule({
  declarations: [NgxMatFileInputDirective, NgxMatFileInputComponent],
  exports: [NgxMatFileInputDirective, NgxMatFileInputComponent],
})
export class MaterialFileInputModule {}

