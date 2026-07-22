import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { homeContent as homePt } from '../content/pt/home';
import { portfolioContent as portfolioPt } from '../content/pt/portfolio';
import { governanceContent as governancePt } from '../content/pt/governance';
import { founderContent as founderPt } from '../content/pt/founder';
import { contactContent as contactPt } from '../content/pt/contact';
import { newsContent as newsPt } from '../content/pt/news';

import { homeContent as homeEn } from '../content/en/home';
import { portfolioContent as portfolioEn } from '../content/en/portfolio';
import { governanceContent as governanceEn } from '../content/en/governance';
import { founderContent as founderEn } from '../content/en/founder';
import { contactContent as contactEn } from '../content/en/contact';
import { newsContent as newsEn } from '../content/en/news';

export type Language = 'pt' | 'en';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private readonly platformId = inject(PLATFORM_ID);
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
      news: newsPt
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
        // Respeita a escolha previamente salva pelo usuário
        this.currentLang.set(savedLang);
      } else {
        // Detecção inteligente por idioma do navegador:
        // Se o idioma primário do usuário não for Português, inicializa em Inglês ('en')
        const browserLang = (navigator.language || (navigator.languages && navigator.languages[0]) || '').toLowerCase();

        if (browserLang.startsWith('pt')) {
          this.currentLang.set('pt');
        } else {
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
