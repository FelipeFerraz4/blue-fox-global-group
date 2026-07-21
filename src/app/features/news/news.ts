import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news.html',
  styleUrl: './news.css'
})
export class News {
  protected readonly translationService = inject(TranslationService);
}
