import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {PlatService} from '../../../services/plat-service';
import {Plat} from '../../../models/plat';

@Component({
  selector: 'app-plat-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './plat-form.html',
  styleUrl: './plat-form.scss'
})
export class PlatForm implements OnInit {

  @Input() plat: Plat | null = null;

  @Output() saved = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  saving = signal(false);
  errorMessage = signal('');

  form = {
    name: '',
    description: '',
    type: 'PIZZA',
    prix: null as number | null,
    prixFamilial: null as number | null,
    disponible: true,
    ordre: null as number | null
  };

  categories = [
    { value: 'PIZZA', label: 'Pizzas' },
    { value: 'PATES', label: 'Pâtes' },
    { value: 'PANINI', label: 'Paninis' },
    { value: 'PAIN_BAGNAT', label: 'Pains bagnats' },
    { value: 'SALADE', label: 'Salades' },
    { value: 'MENU_ENFANT', label: 'Menus enfants' },
    { value: 'DESSERT', label: 'Desserts' },
    { value: 'GLACE', label: 'Glaces' },
    { value: 'BOISSON', label: 'Boissons' }
  ];

  constructor(private platService: PlatService) {}

  ngOnInit(): void {
    if (this.plat) {
      this.form = {
        name: this.plat.name ?? '',
        description: this.plat.description ?? '',
        type: this.plat.type ?? 'PIZZA',
        prix: this.plat.prix ?? null,
        prixFamilial: this.plat.prixFamilial ?? null,
        disponible: this.plat.disponible ?? true,
        ordre: this.plat.ordre ?? null
      };
    }
  }

  get isPizza(): boolean {
    return this.form.type === 'PIZZA';
  }

  onCategoryChange(): void {
    if (!this.isPizza) {
      this.form.prixFamilial = null;
    }
  }

  close(): void {
    if (!this.saving()) {
      this.closed.emit();
    }
  }

  onSubmit(): void {
    this.errorMessage.set('');

    if (!this.form.name.trim()) {
      this.errorMessage.set('Le nom du plat est obligatoire.');
      return;
    }

    if (this.form.prix === null || this.form.prix < 0) {
      this.errorMessage.set('Veuillez saisir un prix valide.');
      return;
    }

    this.saving.set(true);

    const payload = {
      ...(this.plat ?? {}),
      name: this.form.name.trim(),
      description: this.form.description.trim(),
      type: this.form.type,
      prix: Number(this.form.prix),
      prixFamilial: this.isPizza && this.form.prixFamilial !== null
        ? Number(this.form.prixFamilial)
        : null,
      disponible: this.form.disponible,
      ordre: this.form.ordre !== null ? Number(this.form.ordre) : null,
      imageUrl: this.plat?.imageUrl
    } as Plat;

    const request$ = this.plat
      ? this.platService.update(this.plat.id, payload)
      : this.platService.create(payload);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.saved.emit();
      },
      error: (error) => {
        console.error('Erreur lors de l’enregistrement du plat :', error);
        this.saving.set(false);
        this.errorMessage.set(
          error?.error?.message || 'Une erreur est survenue lors de l’enregistrement.'
        );
      }
    });
  }
}
