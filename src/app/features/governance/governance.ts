import { Component, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../core/services/translation.service';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-governance',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './governance.html',
  styleUrl: './governance.css'
})
export class Governance {
  protected readonly translationService = inject(TranslationService);
  private readonly seoService = inject(SeoService);

  constructor() {
    effect(() => {
      const lang = this.translationService.currentLang();
      const content = this.translationService.currentContent().governance;
      this.seoService.updateMetadata({
        title: content.title,
        description: content.subtitle,
        url: `https://bluefoxglobalgroup.com/${lang}/about`,
        keywords: 'Governança, About, Sobre, Transparência, Ética, Valores, Holding, Blue Fox'
      });
    });
  }
}

