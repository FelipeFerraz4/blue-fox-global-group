import { Routes } from '@angular/router';

export const routes: Routes = [
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
    path: '**',
    redirectTo: ''
  }
];
