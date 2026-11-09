
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Plat } from '../../models/plat';
import { PlatService } from '../../services/plat-service';
import { PlatForm } from './plat-form/plat-form';

interface Categorie {
  type: string;
  label: string;
}

@Component({
  selector: 'app-menu-management',
  standalone: true,
  imports: [CommonModule, RouterLink, PlatForm],
  templateUrl: './menu-management.html',
  styleUrl: './menu-management.scss'
})
export class MenuManagement implements OnInit {

  plats = signal<Plat[]>([]);
  loading = signal(true);
  errorMessage = signal('');

  selectedCategory = signal('TOUS');

  showForm = signal(false);
  selectedPlat = signal<Plat | null>(null);

  savingAvailability = signal<number | null>(null);

  readonly categories: Categorie[] = [
    { type: 'TOUS', label: 'Tous les plats' },
    { type: 'PIZZA', label: 'Pizzas' },
    { type: 'PATES', label: 'Pâtes' },
    { type: 'PANINI', label: 'Paninis' },
    { type: 'PAIN_BAGNAT', label: 'Pains bagnats' },
    { type: 'SALADE', label: 'Salades' },
    { type: 'MENU_ENFANT', label: 'Menus enfants' },
    { type: 'DESSERT', label: 'Desserts' },
    { type: 'GLACE', label: 'Glaces' },
    { type: 'BOISSON', label: 'Boissons' }
  ];

  constructor(private platService: PlatService) {}

  ngOnInit(): void {
    this.loadPlats();
  }

  loadPlats(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.platService.getAllPlats().subscribe({
      next: (plats) => {
        this.plats.set(
          [...plats].sort(
            (a, b) => (a.ordre ?? 9999) - (b.ordre ?? 9999)
          )
        );
        this.loading.set(false);
      },
      error: (error) => {
        console.error(error);
        this.errorMessage.set('Impossible de charger votre carte.');
        this.loading.set(false);
      }
    });
  }

  get filteredPlats(): Plat[] {
    const category = this.selectedCategory();

    if (category === 'TOUS') {
      return this.plats();
    }

    return this.plats().filter(plat => plat.type === category);
  }

  get availableCount(): number {
    return this.plats().filter(plat => plat.disponible).length;
  }

  get unavailableCount(): number {
    return this.plats().filter(plat => !plat.disponible).length;
  }

  selectCategory(type: string): void {
    this.selectedCategory.set(type);
  }

  openCreateForm(): void {
    this.selectedPlat.set(null);
    this.showForm.set(true);
  }

  openEditForm(plat: Plat): void {
    this.selectedPlat.set({ ...plat });
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.selectedPlat.set(null);
  }

  onPlatSaved(): void {
    this.closeForm();
    this.loadPlats();
  }

  toggleAvailability(plat: Plat): void {
    if (this.savingAvailability() !== null) {
      return;
    }

    const updatedPlat: Plat = {
      ...plat,
      disponible: !plat.disponible
    };

    this.savingAvailability.set(plat.id);

    this.platService.update(plat.id, updatedPlat).subscribe({
      next: (savedPlat) => {
        this.plats.update(current =>
          current.map(p => p.id === plat.id ? savedPlat : p)
        );
        this.savingAvailability.set(null);
      },
      error: (error) => {
        console.error(error);
        this.errorMessage.set(
          'Impossible de modifier la disponibilité du plat.'
        );
        this.savingAvailability.set(null);
      }
    });
  }

  deletePlat(plat: Plat): void {
    const confirmed = confirm(
      `Voulez-vous vraiment supprimer "${plat.name}" ?`
    );

    if (!confirmed) {
      return;
    }

    this.platService.delete(plat.id).subscribe({
      next: () => {
        this.plats.update(current =>
          current.filter(p => p.id !== plat.id)
        );
      },
      error: (error) => {
        console.error(error);
        this.errorMessage.set('Impossible de supprimer ce plat.');
      }
    });
  }

  getCategoryLabel(type: string): string {
    return this.categories.find(c => c.type === type)?.label ?? type;
  }

  trackByPlatId(index: number, plat: Plat): number {
    return plat.id ?? index;
  }
}
