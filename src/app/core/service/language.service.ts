import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  public languages: string[] = ['en', 'es', 'de'];

  constructor(public translate: TranslateService) {
    translate.addLangs(this.languages);

    const stored = localStorage.getItem('lang');
    const browserLang: string = stored ?? translate.getBrowserLang() ?? 'en';
    translate.use(browserLang.match(/en|es|de/) ? browserLang : 'en');
  }

  public setLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }
}

