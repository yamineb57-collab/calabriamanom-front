/**
 * Informations pratiques de la pizzeria, en un seul endroit :
 * utilisées par l'accueil, la page contact, le pied de page, et plus tard les données structurées SEO.
 */
export interface PlageHoraire {
  /** Format HH:mm, heure de Paris */
  debut: string;
  fin: string;
}

export interface HoraireJours {
  libelle: string;
  /** 0 = dimanche, 1 = lundi, ... 6 = samedi */
  jours: number[];
  /** Liste vide = fermé */
  plages: PlageHoraire[];
}

export interface InfosPratiques {
  nom: string;
  telephone: string;
  telephoneLien: string;
  adresse: { rue: string; codePostal: string; ville: string };
  itineraire: string;
  horaires: HoraireJours[];
  livraison: { forfait: string; minimum: string };
}

export const INFOS_PRATIQUES: InfosPratiques = {
  nom: 'Pizza Calabria',
  telephone: '03 82 58 58 58',
  telephoneLien: 'tel:+33382585858',
  adresse: { rue: '2, rue des Jardins', codePostal: '57100', ville: 'Manom' },
  itineraire:
    'https://www.google.com/maps/search/?api=1&query=2+rue+des+Jardins+57100+Manom',
  horaires: [
    {
      libelle: 'Mardi au samedi',
      jours: [2, 3, 4, 5, 6],
      plages: [
        { debut: '11:30', fin: '13:30' },
        { debut: '18:30', fin: '21:00' },
      ],
    },
    { libelle: 'Dimanche', jours: [0], plages: [{ debut: '18:30', fin: '21:00' }] },
    { libelle: 'Lundi', jours: [1], plages: [] },
  ],
  livraison: { forfait: '2,50 €', minimum: '13 €' },
};

/** « 11:30 » devient « 11h30 » */
export function formaterHeure(heure: string): string {
  return heure.replace(':', 'h');
}
