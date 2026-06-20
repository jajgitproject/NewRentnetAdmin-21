// @ts-nocheck
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { GeneralService } from '../../general/general.service';

@Component({
  selector: 'app-static-image',
  standalone: true,
  imports: [CommonModule],
  template: `
    <img
      *ngIf="currentSrc && !hidden"
      [src]="currentSrc"
      [alt]="alt"
      [class]="cssClass"
      [style.height]="height"
      [style.width]="width"
      [style.max-width]="maxWidth"
      (error)="onError()"
      (load)="load.emit($event)" />
  `,
})
export class StaticImageComponent implements OnChanges {
  @Input() src: string | null | undefined;
  @Input() alt = '';
  @Input() cssClass = '';
  @Input() height: string | null = null;
  @Input() width: string | null = null;
  @Input() maxWidth: string | null = null;

  @Output() load = new EventEmitter<Event>();
  @Output() failed = new EventEmitter<void>();

  currentSrc: string | null = null;
  hidden = false;

  constructor(private generalService: GeneralService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['src']) {
      this.resetSrc();
    }
  }

  onError(): void {
    this.hidden = true;
    this.failed.emit();
  }

  private resetSrc(): void {
    this.hidden = false;
    const value = (this.src ?? '').toString().trim();
    if (!value || /^(null|undefined)$/i.test(value)) {
      this.currentSrc = null;
      return;
    }
    if (/^https?:\/\//i.test(value)) {
      this.currentSrc = value;
      return;
    }
    this.currentSrc = this.generalService.resolveStaticImageUrl(value);
  }
}
