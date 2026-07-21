import { Component, signal } from '@angular/core';
import { Header } from './shared/components/header/header';
import { Home } from './features/home/home';
import { Portfolio } from './features/portfolio/portfolio';
import { Governance } from './features/governance/governance';
import { News } from './features/news/news';
import { Contact } from './features/contact/contact';
import { Footer } from './shared/components/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    Header,
    Home,
    Portfolio,
    Governance,
    News,
    Contact,
    Footer
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Blue Fox Global Group');
}
