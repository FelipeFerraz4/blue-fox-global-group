import { Routes } from '@angular/router';

const featureRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then(m => m.Home)
  },
  {
    path: 'portfolio',
    loadComponent: () => import('./features/portfolio/portfolio').then(m => m.Portfolio)
  },
  {
    path: 'about',
    loadComponent: () => import('./features/governance/governance').then(m => m.Governance)
  },
  {
    path: 'founder',
    loadComponent: () => import('./features/founder/founder').then(m => m.FounderComponent)
  },
  {
    path: 'news',
    loadComponent: () => import('./features/news/news').then(m => m.News)
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/contact/contact').then(m => m.Contact)
  },
  {
    path: 'privacy',
    loadComponent: () => import('./features/privacy/privacy').then(m => m.Privacy)
  },
  {
    path: 'terms',
    loadComponent: () => import('./features/terms/terms').then(m => m.Terms)
  }
];

export const routes: Routes = [
  {
    path: 'pt',
    children: featureRoutes
  },
  {
    path: 'en',
    children: featureRoutes
  },
  // Compatibility / default redirects to /pt or /en
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'pt'
  },
  {
    path: 'portfolio',
    redirectTo: 'pt/portfolio'
  },
  {
    path: 'about',
    redirectTo: 'pt/about'
  },
  {
    path: 'founder',
    redirectTo: 'pt/founder'
  },
  {
    path: 'news',
    redirectTo: 'pt/news'
  },
  {
    path: 'contact',
    redirectTo: 'pt/contact'
  },
  {
    path: '**',
    redirectTo: 'pt'
  }
];

