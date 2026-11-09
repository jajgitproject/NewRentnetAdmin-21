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
      [style.max-height]="maxHeight"
      (error)="onError()"
      (load)="onLoad($event)" />
  `,
})
export class StaticImageComponent implements OnChanges {
  @Input() src: string | null | undefined;
  @Input() alt = '';
  @Input() cssClass = '';
  @Input() height: string | null = null;
  @Input() width: string | null = null;
  @Input() maxWidth: string | null = null;
  @Input() maxHeight: string | null = null;

  @Output() load = new EventEmitter<Event>();
  @Output() resolved = new EventEmitter<string>();
  @Output() failed = new EventEmitter<void>();

  currentSrc: string | null = null;
  hidden = false;
  private candidates: string[] = [];
  private candidateIndex = 0;

  constructor(private generalService: GeneralService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['src']) {
      this.resetSrc();
    }
  }

  onLoad(event: Event): void {
    this.load.emit(event);
    if (this.currentSrc) {
      this.resolved.emit(this.currentSrc);
    }
  }

  onError(): void {
    const nextIndex = this.candidateIndex + 1;
    if (nextIndex < this.candidates.length) {
      this.candidateIndex = nextIndex;
      this.currentSrc = this.candidates[nextIndex];
      return;
    }
    this.hidden = true;
    this.failed.emit();
  }

  private resetSrc(): void {
    this.hidden = false;
    this.candidates = [];
    this.candidateIndex = 0;
    const value = (this.src ?? '').toString().trim();
    if (!value || /^(null|undefined)$/i.test(value)) {
      this.currentSrc = null;
      return;
    }

    if (value.startsWith('data:')) {
      this.candidates = [value];
      this.currentSrc = value;
      return;
    }

    const candidates = this.generalService.qcPhotoUrlCandidates(value);
    if (candidates.length > 0) {
      this.candidates = candidates;
      this.currentSrc = candidates[0];
      return;
    }

    if (value.startsWith('data:') || /^https?:\/\//i.test(value)) {
      this.candidates = [value];
      this.currentSrc = value;
      return;
    }

    const resolved = this.generalService.resolveStaticImageUrl(value);
    this.candidates = resolved ? [resolved] : [];
    this.currentSrc = resolved;
  }
}
