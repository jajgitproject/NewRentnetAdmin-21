import { isPlatformBrowser } from '@angular/common';
import {
  ClassProvider,
  FactoryProvider,
  InjectionToken,
  PLATFORM_ID,
} from '@angular/core';

export const WINDOW = new InjectionToken<Window>('WindowToken');

export abstract class WindowRef {
  abstract get nativeWindow(): Window;
}

export class BrowserWindowRef extends WindowRef {
  override get nativeWindow(): Window {
    return window;
  }
}

export function windowFactory(
  browserWindowRef: BrowserWindowRef,
  platformId: object
): Window {
  if (isPlatformBrowser(platformId)) {
    return browserWindowRef.nativeWindow;
  }
  return {} as Window;
}

export const browserWindowProvider: ClassProvider = {
  provide: WindowRef,
  useClass: BrowserWindowRef,
};

export const windowProvider: FactoryProvider = {
  provide: WINDOW,
  useFactory: windowFactory,
  deps: [WindowRef, PLATFORM_ID],
};

export const WINDOW_PROVIDERS = [browserWindowProvider, windowProvider];
