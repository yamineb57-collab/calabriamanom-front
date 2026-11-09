import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { Plat } from '../../models/plat';
import { PlatService } from '../../services/plat-service';
import {AuthService} from '../../services/auth-service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {

  plats = signal<Plat[]>([]);
  username = signal('Administrateur');

  loading = signal(true);
  errorMessage = signal('');

  logoutLoading = signal(false);

  constructor(
    private platService: PlatService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadPlats();
  }

  private loadCurrentUser(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        if (!user.roles.includes('ROLE_ADMIN')) {
          this.router.navigate(['/admin']);
          return;
        }

        this.username.set(user.username);
      },
      error: () => {
        this.router.navigate(['/admin']);
      }
    });
  }

  public loadPlats(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.platService.getAllPlats().subscribe({
      next: (plats) => {
        const sortedPlats = [...plats].sort(
          (a, b) => (a.ordre ?? 9999) - (b.ordre ?? 9999)
        );

        this.plats.set(sortedPlats);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des plats :', error);
        this.errorMessage.set(
          'Impossible de charger les informations de la carte.'
        );
        this.loading.set(false);
      }
    });
  }

  get totalPlats(): number {
    return this.plats().length;
  }

  get totalCategories(): number {
    return new Set(this.plats().map(plat => plat.type)).size;
  }

  get unavailablePlats(): number {
    return this.plats().filter(plat => !plat.disponible).length;
  }

  get availablePlats(): number {
    return this.plats().filter(plat => plat.disponible).length;
  }

  /**
   * Retourne le nom lisible d'une catégorie.
   */
  getCategoryLabel(type: string): string {
    const labels: Record<string, string> = {
      PIZZA: 'Pizza',
      PATES: 'Pâtes',
      PANINI: 'Panini',
      PAIN_BAGNAT: 'Pain bagnat',
      SALADE: 'Salade',
      GLACE: 'Glace',
      DESSERT: 'Dessert',
      BOISSON: 'Boisson',
      MENU_ENFANT: 'Menu enfant'
    };

    return labels[type] ?? type;
  }

  get previewPlats(): Plat[] {
    return this.plats().slice(0, 5);
  }

  logout(): void {
    if (this.logoutLoading()) {
      return;
    }

    this.logoutLoading.set(true);

    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/admin']);
      },
      error: (error) => {
        console.error('Erreur lors de la déconnexion :', error);
        this.logoutLoading.set(false);
      }
    });
  }

  trackByPlatId(index: number, plat: Plat): number {
    return plat.id ?? index;
  }
}
