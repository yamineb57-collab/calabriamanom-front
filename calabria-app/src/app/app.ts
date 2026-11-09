import { Component, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import {Navbar} from './pages/navbar/navbar';
import {Footer} from './pages/footer/footer';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, Footer, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  private router = inject(Router);

  showPublicLayout = true;

  constructor() {
    this.updateLayout();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.updateLayout());
  }

  private updateLayout(): void {
    this.showPublicLayout = !this.router.url.startsWith('/admin');
  }
}
