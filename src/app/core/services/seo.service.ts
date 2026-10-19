import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';

export interface SeoData {
    title: string;
    description: string;
    image?: string;
    url: string;
    type?: string;
    keywords?: string;
    author?: string;
    robots?: string;
    /** `false` remove canonical e hreflang (ex.: página 404). Padrão: true. */
    canonical?: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class SeoService {
    private readonly defaultSiteName = 'Blue Fox Global Group';
    private readonly siteUrl = 'https://bluefoxglobalgroup.com';
    /** Imagem de compartilhamento 1200x630 em public/og-default.jpg. */
    private readonly defaultImage = '/og-default.jpg';

    constructor(
        private titleService: Title,
        private metaService: Meta,
        // DOCUMENT funciona no navegador e no servidor (SSR/prerender), ao contrário do `document` global.
        @Inject(DOCUMENT) private document: Document
    ) { }

    updateMetadata(data: SeoData) {
        const {
            title,
            description,
            image = this.defaultImage,
            url,
            type = 'website',
            keywords,
            author = 'Blue Fox Global Group',
            robots = 'index, follow',
            canonical = true
        } = data;

        const fullTitle = title.includes(this.defaultSiteName)
            ? title
            : `${title} | ${this.defaultSiteName}`;

        // Open Graph e Twitter exigem URL absoluta para a imagem.
        const absoluteImage = /^https?:\/\//.test(image)
            ? image
            : `${this.siteUrl}${image.startsWith('/') ? '' : '/'}${image}`;

        const isEnglish = /^https?:\/\/[^/]+\/en(\/|$)/.test(url);
        const locale = isEnglish ? 'en_US' : 'pt_BR';
        const alternateLocale = isEnglish ? 'pt_BR' : 'en_US';

        // Standard SEO Meta Tags
        this.titleService.setTitle(fullTitle);
        this.metaService.updateTag({ name: 'description', content: description });
        this.metaService.updateTag({ name: 'robots', content: robots });
        this.metaService.updateTag({ name: 'author', content: author });

        if (keywords) {
            this.metaService.updateTag({ name: 'keywords', content: keywords });
        }

        // Open Graph Meta Tags (Facebook / LinkedIn / WhatsApp)
        this.metaService.updateTag({ property: 'og:site_name', content: this.defaultSiteName });
        this.metaService.updateTag({ property: 'og:title', content: fullTitle });
        this.metaService.updateTag({ property: 'og:description', content: description });
        this.metaService.updateTag({ property: 'og:image', content: absoluteImage });
        this.metaService.updateTag({ property: 'og:image:width', content: '1200' });
        this.metaService.updateTag({ property: 'og:image:height', content: '630' });
        this.metaService.updateTag({ property: 'og:image:alt', content: this.defaultSiteName });
        this.metaService.updateTag({ property: 'og:type', content: type });
        this.metaService.updateTag({ property: 'og:url', content: url });
        this.metaService.updateTag({ property: 'og:locale', content: locale });
        this.metaService.updateTag({ property: 'og:locale:alternate', content: alternateLocale });

        // Twitter Card Meta Tags
        this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
        this.metaService.updateTag({ name: 'twitter:title', content: fullTitle });
        this.metaService.updateTag({ name: 'twitter:description', content: description });
        this.metaService.updateTag({ name: 'twitter:image', content: absoluteImage });

        if (canonical) {
            this.updateCanonicalUrl(url);
            this.updateHreflangTags(url);
        } else {
            this.removeCanonicalAndHreflang();
        }
    }

    private updateCanonicalUrl(url: string) {
        let link: HTMLLinkElement | null =
            this.document.querySelector("link[rel='canonical']");

        if (!link) {
            link = this.document.createElement('link');
            link.setAttribute('rel', 'canonical');
            this.document.head.appendChild(link);
        }

        link.setAttribute('href', url);
    }

    private updateHreflangTags(currentUrl: string) {
        // Build matching alternate URLs for pt and en
        const urlPath = currentUrl.replace(/^https?:\/\/[^\/]+/, '');
        const segments = urlPath.split('/').filter(Boolean);

        if (segments.length > 0 && (segments[0] === 'pt' || segments[0] === 'en')) {
            segments.shift();
        }

        const pathWithoutLang = segments.length > 0 ? '/' + segments.join('/') : '';
        const ptUrl = `${this.siteUrl}/pt${pathWithoutLang}`;
        const enUrl = `${this.siteUrl}/en${pathWithoutLang}`;

        const languages = [
            { lang: 'pt', href: ptUrl },
            { lang: 'en', href: enUrl },
            { lang: 'x-default', href: ptUrl }
        ];

        languages.forEach(({ lang, href }) => {
            let link: HTMLLinkElement | null =
                this.document.querySelector(`link[rel='alternate'][hreflang='${lang}']`);

            if (!link) {
                link = this.document.createElement('link');
                link.setAttribute('rel', 'alternate');
                link.setAttribute('hreflang', lang);
                this.document.head.appendChild(link);
            }

            link.setAttribute('href', href);
        });
    }

    private removeCanonicalAndHreflang() {
        this.document
            .querySelectorAll("link[rel='canonical'], link[rel='alternate'][hreflang]")
            .forEach((el) => el.remove());
    }
}
