import { Component, inject, OnInit, signal, PLATFORM_ID, effect } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../core/services/translation.service';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  protected readonly translationService = inject(TranslationService);
  private readonly seoService = inject(SeoService);
  private readonly platformId = inject(PLATFORM_ID);

  // Animated stats values
  protected animatedStats = signal<string[]>(['0', '0', '0', '0']);

  constructor() {
    effect(() => {
      const lang = this.translationService.currentLang();
      const content = this.translationService.currentContent().home;
      this.seoService.updateMetadata({
        title: content.hero.title,
        description: content.hero.subtitle,
        url: `https://bluefoxglobalgroup.com/${lang}`,
        keywords: 'Blue Fox, Global Group, Holding, Investimentos, Tecnologia, Aquarismo, Technology, Innovation'
      });
    });
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.animateCounters();
    } else {
      this.animatedStats.set(['1', '2026', '2', '1']);
    }
  }

  private animateCounters() {
    const targets = [1, 2026, 2, 1];
    const current = [0, 0, 0, 0];
    const steps = 60;
    const duration = 1500;
    const intervalTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      for (let i = 0; i < targets.length; i++) {
        current[i] = Math.floor((targets[i] / steps) * step);
        if (current[i] > targets[i]) current[i] = targets[i];
      }

      this.animatedStats.set([
        `${current[0]}`,
        `${current[1]}`,
        `${current[2]}`,
        `${current[3]}`
      ]);

      if (step >= steps) {
        clearInterval(timer);
        this.animatedStats.set(['1', '2026', '2', '1']);
      }
    }, intervalTime);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'active': return 'status-active';
      case 'soon': return 'status-soon';
      case 'future': return 'status-future';
      default: return '';
    }
  }

  getStatusLabel(status: string): string {
    const labels = this.translationService.currentContent().portfolio.statusLabels;
    return (labels as Record<string, string>)[status] || status;
  }
}

