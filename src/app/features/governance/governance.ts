import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-governance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './governance.html',
  styleUrl: './governance.css'
})
export class Governance {
  protected readonly translationService = inject(TranslationService);
}
