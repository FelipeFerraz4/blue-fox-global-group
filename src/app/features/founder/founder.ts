import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-founder',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './founder.html',
  styleUrl: './founder.css'
})
export class FounderComponent {
  protected readonly translationService = inject(TranslationService);
}
