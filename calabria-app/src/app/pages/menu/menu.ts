import {Component, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {registerLocaleData} from '@angular/common';
import localeFr from '@angular/common/locales/fr';

import {Plat} from '../../models/plat';
import {PlatService} from '../../services/plat-service';

registerLocaleData(localeFr, 'fr-FR');

interface CategorieMenu {
  type: string;
  label: string;
  description: string;
  plats: Plat[];
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.html',
  styleUrls: ['./menu.scss']
})
export class Menu implements OnInit {

  plats = signal<Plat[]>([]);
  categories: CategorieMenu[] = [];

  loading = signal(true);
  errorMessage = '';

  private readonly categoriesConfig = [
    {
      type: 'PIZZA',
      label: 'Nos pizzas',
      description: 'Les incontournables de la maison.'
    },
    {
      type: 'PATES',
      label: 'Nos pâtes',
      description: 'De quoi satisfaire toutes les envies.'
    },
    {
      type: 'PANINI',
      label: 'Nos paninis',
      description: 'Une pause gourmande.'
    },
    {
      type: 'PAIN_BAGNAT',
      label: 'Pains bagnats',
      description: 'Simples et généreux.'
    },
    {
      type: 'SALADE',
      label: 'Nos salades',
      description: 'Une touche de fraîcheur.'
    },
    {
      type: 'MENU_ENFANT',
      label: 'Menus enfants',
      description: 'Les petits aussi ont leur menu.'
    },
    {
      type: 'DESSERT',
      label: 'Nos desserts',
      description: 'Une note sucrée pour finir.'
    },
    {
      type: 'GLACE',
      label: 'Nos glaces',
      description: 'Une pause tout en douceur.'
    },
    {
      type: 'BOISSON',
      label: 'Nos boissons',
      description: 'Pour accompagner votre repas.'
    }
  ];

  constructor(private platService: PlatService) {
  }

  ngOnInit(): void {
    this.loadPlats();
  }

  loadPlats(): void {
    this.loading.set(true);
    this.errorMessage = '';

    this.platService.getAllPlats().subscribe({
      next: (plats) => {
        const sortedPlats = [...plats].sort(
          (a, b) => (a.ordre ?? 9999) - (b.ordre ?? 9999)
        );

        this.plats.set(sortedPlats);

        this.buildCategories();

        this.loading.set(false);

        console.log('Catégories construites :', this.categories);
        console.log(this.plats())
      },

      error: (error) => {
        console.error('Erreur lors du chargement des plats', error);

        this.errorMessage =
          'Impossible de charger la carte pour le moment. Réessaie dans quelques instants.';

        this.loading.set(false);
      }
    });
  }

  private buildCategories(): void {
    this.categories = this.categoriesConfig
      .map((config) => ({
        ...config,
        plats: this.plats().filter(
          (plat) => plat.type === config.type
        )
      }))
      .filter((categorie) => categorie.plats.length > 0);
  }

  getCategoryId(type: string): string {
    return `categorie-${type.toLowerCase()}`;
  }

  scrollToCategory(type: string): void {
    const element = document.getElementById(
      this.getCategoryId(type)
    );

    if (!element) {
      return;
    }

    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  trackByPlatId(index: number, plat: Plat): number {
    return plat.id ?? index;
  }

  trackByCategory(index: number, categorie: CategorieMenu): string {
    return categorie.type;
  }
}
