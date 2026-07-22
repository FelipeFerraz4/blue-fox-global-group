import { Component, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../core/services/translation.service';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news.html',
  styleUrl: './news.css'
})
export class News {
  protected readonly translationService = inject(TranslationService);
  private readonly seoService = inject(SeoService);

  constructor() {
    effect(() => {
      const lang = this.translationService.currentLang();
      const content = this.translationService.currentContent().news;
      this.seoService.updateMetadata({
        title: content.title,
        description: content.subtitle,
        url: `https://bluefoxglobalgroup.com/${lang}/news`,
        keywords: 'Notícias, Comunicados, News, Updates, Blue Fox, Investimentos'
      });
    });
  }
}

