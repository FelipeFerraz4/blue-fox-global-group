import { Component, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../core/services/translation.service';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-founder',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './founder.html',
  styleUrl: './founder.css'
})
export class FounderComponent {
  protected readonly translationService = inject(TranslationService);
  private readonly seoService = inject(SeoService);

  constructor() {
    effect(() => {
      const lang = this.translationService.currentLang();
      const content = this.translationService.currentContent().founder;
      this.seoService.updateMetadata({
        title: content.title,
        description: content.subtitle,
        url: `https://bluefoxglobalgroup.com/${lang}/founder`,
        keywords: 'Felipe Ferraz, Fundador, Founder, CEO, Liderança, Empreendedorismo, UFPE, Mestrado, Hackathon, Blue Fox'
      });
    });
  }
}

