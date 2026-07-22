import { Component, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../core/services/translation.service';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './terms.html',
  styleUrl: './terms.css'
})
export class Terms {
  protected readonly translationService = inject(TranslationService);
  private readonly seoService = inject(SeoService);

  constructor() {
    effect(() => {
      const lang = this.translationService.currentLang();
      const content = this.translationService.currentContent().terms;
      this.seoService.updateMetadata({
        title: content.title,
        description: content.subtitle,
        url: `https://bluefoxglobalgroup.com/${lang}/terms`,
        keywords: 'Termos de Serviço, Terms of Service, Blue Fox Global Group, Regras de Uso'
      });
    });
  }
}
