import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, Location } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { homeContent as homePt } from '../content/pt/home';
import { portfolioContent as portfolioPt } from '../content/pt/portfolio';
import { governanceContent as governancePt } from '../content/pt/governance';
import { founderContent as founderPt } from '../content/pt/founder';
import { contactContent as contactPt } from '../content/pt/contact';
import { newsContent as newsPt } from '../content/pt/news';

import { privacyContent as privacyPt } from '../content/pt/privacy';
import { termsContent as termsPt } from '../content/pt/terms';

import { homeContent as homeEn } from '../content/en/home';
import { portfolioContent as portfolioEn } from '../content/en/portfolio';
import { governanceContent as governanceEn } from '../content/en/governance';
import { founderContent as founderEn } from '../content/en/founder';
import { contactContent as contactEn } from '../content/en/contact';
import { newsContent as newsEn } from '../content/en/news';
import { privacyContent as privacyEn } from '../content/en/privacy';
import { termsContent as termsEn } from '../content/en/terms';

export type Language = 'pt' | 'en';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  // Default language signal
  readonly currentLang = signal<Language>('pt');

  private readonly dictionary = {
    pt: {
      nav: {
        home: 'Início',
        about: 'Sobre',
        portfolio: 'Portfólio',
        founder: 'Fundador',
        news: 'Notícias',
        contact: 'Contato'
      },
      home: homePt,
      portfolio: portfolioPt,
      governance: governancePt,
      founder: founderPt,
      contact: contactPt,
      news: newsPt,
      privacy: privacyPt,
      terms: termsPt
    },
    en: {
      nav: {
        home: 'Home',
        about: 'About',
        portfolio: 'Portfolio',
        founder: 'Founder',
        news: 'News',
        contact: 'Contact'
      },
      home: homeEn,
      portfolio: portfolioEn,
      governance: governanceEn,
      founder: founderEn,
      contact: contactEn,
      news: newsEn,
      privacy: privacyEn,
      terms: termsEn
    }
  };

  readonly currentContent = computed(() => {
    return this.dictionary[this.currentLang()];
  });

  constructor() {
    this.syncLanguageFromUrl(this.location.path());

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event) => {
      this.syncLanguageFromUrl(event.urlAfterRedirects || event.url);
    });
  }

  private syncLanguageFromUrl(path: string) {
    const segments = path.split('/').filter(Boolean);
    if (segments.length > 0) {
      const firstSegment = segments[0];
      if (firstSegment === 'pt' || firstSegment === 'en') {
        if (this.currentLang() !== firstSegment) {
          this.currentLang.set(firstSegment as Language);
        }
      }
    }
  }

  setLanguage(lang: Language) {
    const currentUrl = this.router.url;
    const segments = currentUrl.split('/').filter(Boolean);

    if (segments.length > 0 && (segments[0] === 'pt' || segments[0] === 'en')) {
      segments[0] = lang;
    } else {
      segments.unshift(lang);
    }

    const newUrl = '/' + segments.join('/');
    this.currentLang.set(lang);
    if (this.isBrowser) {
      localStorage.setItem('blue_fox_lang', lang);
    }
    this.router.navigateByUrl(newUrl);
  }

  toggleLanguage() {
    this.setLanguage(this.currentLang() === 'pt' ? 'en' : 'pt');
  }
}

