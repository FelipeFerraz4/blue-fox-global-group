import { Component, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../core/services/translation.service';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './privacy.html',
  styleUrl: './privacy.css'
})
export class Privacy {
  protected readonly translationService = inject(TranslationService);
  private readonly seoService = inject(SeoService);

  constructor() {
    effect(() => {
      const lang = this.translationService.currentLang();
      const content = this.translationService.currentContent().privacy;
      this.seoService.updateMetadata({
        title: content.title,
        description: content.subtitle,
        url: `https://bluefoxglobalgroup.com/${lang}/privacy`,
        keywords: 'Política de Privacidade, Privacy Policy, Blue Fox Global Group, Termos, Segurança'
      });
    });
  }
}
