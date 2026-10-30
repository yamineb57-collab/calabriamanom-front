import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Horaire {
  jour: string;
  midi: string;
  soir: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.scss']
})
export class Contact {

  readonly telephone = '0382585858';
  readonly telephoneInternational = '+33382585858';

  readonly adresse = '2 bis rue des Jardins, 57100 Manom, France';

  horaires: Horaire[] = [
    { jour: 'Lundi', midi: 'Fermé', soir: 'Fermé' },
    { jour: 'Mardi', midi: '11:30 – 13:30', soir: '18:30 – 21:00' },
    { jour: 'Mercredi', midi: '11:30 – 13:30', soir: '18:30 – 21:00' },
    { jour: 'Jeudi', midi: '11:30 – 13:30', soir: '18:30 – 21:00' },
    { jour: 'Vendredi', midi: '11:30 – 13:30', soir: '18:30 – 21:00' },
    { jour: 'Samedi', midi: '11:30 – 13:30', soir: '18:30 – 21:00' },
    { jour: 'Dimanche', midi: 'Fermé', soir: '18:30 – 21:00' }
  ];

  contactForm = {
    nom: '',
    email: '',
    telephone: '',
    objet: '',
    message: ''
  };

  messageInfo = '';

  onSubmit(): void {
    // L'envoi du formulaire sera configuré ultérieurement.
    this.messageInfo =
      'Le formulaire n’est pas encore connecté. Vous pouvez nous contacter par téléphone en attendant.';
  }

}
