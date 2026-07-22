import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslationService } from '../../core/services/translation.service';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class Contact {
  protected readonly translationService = inject(TranslationService);
  private readonly seoService = inject(SeoService);
  private readonly fb = inject(FormBuilder);

  protected contactForm: FormGroup;
  protected isSubmitting = signal(false);
  protected submitSuccess = signal<boolean | null>(null);

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

    this.contactForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required]],
      message: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.submitSuccess.set(null);

    // Simulate API request
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.submitSuccess.set(true);
      this.contactForm.reset();

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        this.submitSuccess.set(null);
      }, 5000);
    }, 1500);
  }

  // Field validation helpers
  isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}

