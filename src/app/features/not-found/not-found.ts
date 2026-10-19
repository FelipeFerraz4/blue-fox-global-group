import { Component, inject, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../core/services/translation.service';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css'
})
export class NotFound {
  protected readonly translationService = inject(TranslationService);
  private readonly seoService = inject(SeoService);

  constructor() {
    effect(() => {
      const lang = this.translationService.currentLang();
      const content = this.translationService.currentContent().notFound;
      this.seoService.updateMetadata({
        title: `${content.code} · ${content.title}`,
        description: content.subtitle,
        url: `https://bluefoxglobalgroup.com/${lang}`,
        robots: 'noindex, follow',
        canonical: false
      });
    });
  }
}
