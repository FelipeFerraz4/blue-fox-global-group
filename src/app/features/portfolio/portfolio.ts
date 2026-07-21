import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.css'
})
export class Portfolio {
  protected readonly translationService = inject(TranslationService);
  protected readonly selectedCategory = signal<string>('all');

  protected readonly filteredCompanies = computed(() => {
    const category = this.selectedCategory();
    const companies = this.translationService.currentContent().portfolio.companies;
    
    if (category === 'all') {
      return companies;
    }
    
    return companies.filter(c => c.category === category);
  });

  getCategoryLabel(category: string): string {
    const categories = this.translationService.currentContent().portfolio.categories;
    return (categories as Record<string, string>)[category] || category;
  }

  setCategory(category: string) {
    this.selectedCategory.set(category);
  }
}
