import { Component, inject, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../core/services/translation.service';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class Contact {
  protected readonly translationService = inject(TranslationService);
  private readonly seoService = inject(SeoService);

  /** Link `mailto:` com assunto já preenchido, no idioma atual. */
  protected readonly mailtoHref = computed(() => {
    const { emailValue, mailCard } = this.translationService.currentContent().contact;
    return `mailto:${emailValue}?subject=${encodeURIComponent(mailCard.subject)}`;
  });

  constructor() {
    effect(() => {
      const lang = this.translationService.currentLang();
      const content = this.translationService.currentContent().contact;
      this.seoService.updateMetadata({
        title: content.title,
        description: content.subtitle,
        url: `https://bluefoxglobalgroup.com/${lang}/contact`,
        keywords: 'Contato, Contact, Fale Conosco, Parcerias, Investimento, Blue Fox Global Group'
      });
    });
  }
}
