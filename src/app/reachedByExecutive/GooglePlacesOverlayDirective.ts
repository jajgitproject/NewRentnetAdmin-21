// @ts-nocheck
import { Directive, ElementRef, HostListener, Input, OnInit, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

@Directive({
  standalone: false,
  selector: '[googlePlacesOverlay]'
})
export class GooglePlacesOverlayDirective implements OnInit, OnDestroy {
  @Input() googlePlacesOverlay: TemplateRef<any>;
  private overlayRef: OverlayRef;

  constructor(private overlay: Overlay, private elementRef: ElementRef, private viewContainerRef: ViewContainerRef) {}

  ngOnInit() {
    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay.position()
        .flexibleConnectedTo(this.elementRef)
        .withPositions([{
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top'
        }]),
      scrollStrategy: this.overlay.scrollStrategies.reposition()
    });
  }

  @HostListener('focus') onFocus() {
    const portal = new TemplatePortal(this.googlePlacesOverlay, this.viewContainerRef);
    this.overlayRef.attach(portal);
  }

  @HostListener('document:click', ['$event.target']) onClick(target: HTMLElement) {
    if (!this.elementRef.nativeElement.contains(target)) {
      this.overlayRef.detach();
    }
  }

  ngOnDestroy() {
    this.overlayRef.dispose();
  }
}


