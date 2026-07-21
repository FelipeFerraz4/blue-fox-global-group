import { Component, inject, OnInit, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  protected readonly translationService = inject(TranslationService);
  private readonly platformId = inject(PLATFORM_ID);

  // Animated stats values
  protected animatedStats = signal<string[]>(['0', '0', '0', '0']);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.animateCounters();
    } else {
      // Server-side default static values
      this.animatedStats.set(['4+', '15+', '$500M+', '250+']);
    }
  }

  private animateCounters() {
    const targets = [4, 15, 500, 250];
    const current = [0, 0, 0, 0];
    const steps = 60;
    const duration = 1500; // 1.5s
    const intervalTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      for (let i = 0; i < targets.length; i++) {
        current[i] = Math.floor((targets[i] / steps) * step);
        if (current[i] > targets[i]) current[i] = targets[i];
      }

      this.animatedStats.set([
        `${current[0]}+`,
        `${current[1]}+`,
        `$${current[2]}M+`,
        `${current[3]}+`
      ]);

      if (step >= steps) {
        clearInterval(timer);
        // Ensure exact target strings at the end
        this.animatedStats.set(['4+', '15+', '$500M+', '250+']);
      }
    }, intervalTime);
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }
}
