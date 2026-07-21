import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { homeContent as homePt } from '../content/pt/home';
import { portfolioContent as portfolioPt } from '../content/pt/portfolio';
import { governanceContent as governancePt } from '../content/pt/governance';
import { contactContent as contactPt } from '../content/pt/contact';
import { newsContent as newsPt } from '../content/pt/news';

import { homeContent as homeEn } from '../content/en/home';
import { portfolioContent as portfolioEn } from '../content/en/portfolio';
import { governanceContent as governanceEn } from '../content/en/governance';
import { contactContent as contactEn } from '../content/en/contact';
import { newsContent as newsEn } from '../content/en/news';

export type Language = 'pt' | 'en';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  // Default language is 'pt'
  readonly currentLang = signal<Language>('pt');

  private readonly dictionary = {
    pt: {
      nav: {
        home: 'Início',
        about: 'Sobre',
        portfolio: 'Portfólio',
        governance: 'Governança',
        news: 'Notícias',
        contact: 'Contato'
      },
      home: homePt,
      portfolio: portfolioPt,
      governance: governancePt,
      contact: contactPt,
      news: newsPt
    },
    en: {
      nav: {
        home: 'Home',
        about: 'About',
        portfolio: 'Portfolio',
        governance: 'Governance',
        news: 'News',
        contact: 'Contact'
      },
      home: homeEn,
      portfolio: portfolioEn,
      governance: governanceEn,
      contact: contactEn,
      news: newsEn
    }
  };

  readonly currentContent = computed(() => {
    return this.dictionary[this.currentLang()];
  });

  constructor() {
    if (this.isBrowser) {
      const savedLang = localStorage.getItem('blue_fox_lang') as Language;
      if (savedLang === 'pt' || savedLang === 'en') {
        this.currentLang.set(savedLang);
      } else {
        const browserLang = navigator.language.substring(0, 2);
        if (browserLang === 'en') {
          this.currentLang.set('en');
        }
      }
    }
  }

  setLanguage(lang: Language) {
    this.currentLang.set(lang);
    if (this.isBrowser) {
      localStorage.setItem('blue_fox_lang', lang);
    }
  }

  toggleLanguage() {
    this.setLanguage(this.currentLang() === 'pt' ? 'en' : 'pt');
  }
}
