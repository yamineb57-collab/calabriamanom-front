import { HoraireJours, formaterHeure } from './infos-pratiques';

export interface StatutOuverture {
  ouvert: boolean;
  texte: string;
}

const JOURS_EN: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

const NOMS_JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

function enMinutes(heure: string): number {
  const [h, m] = heure.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Dit si la pizzeria est ouverte à l'instant donné, en heure de Paris,
 * quel que soit le fuseau horaire de l'ordinateur du visiteur.
 */
export function calculerStatut(maintenant: Date, horaires: HoraireJours[]): StatutOuverture {
  const parties = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Paris',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(maintenant);

  const valeur = (type: string): string => parties.find((p) => p.type === type)?.value ?? '0';
  const jour = JOURS_EN[valeur('weekday')] ?? 0;
  const minutes = (Number(valeur('hour')) % 24) * 60 + Number(valeur('minute'));

  const plagesDu = (j: number) => horaires.find((h) => h.jours.includes(j))?.plages ?? [];

  // Ouvert en ce moment ?
  for (const plage of plagesDu(jour)) {
    if (minutes >= enMinutes(plage.debut) && minutes < enMinutes(plage.fin)) {
      return { ouvert: true, texte: `Ouvert jusqu'à ${formaterHeure(plage.fin)}` };
    }
  }

  // Prochaine ouverture aujourd'hui
  const prochaine = plagesDu(jour).find((p) => enMinutes(p.debut) > minutes);
  if (prochaine) {
    return { ouvert: false, texte: `Fermé, ouvre à ${formaterHeure(prochaine.debut)}` };
  }

  // Prochaine ouverture un autre jour
  for (let decalage = 1; decalage <= 7; decalage++) {
    const j = (jour + decalage) % 7;
    const premiere = plagesDu(j)[0];
    if (premiere) {
      const quand = decalage === 1 ? 'demain' : NOMS_JOURS[j];
      return { ouvert: false, texte: `Fermé, ouvre ${quand} à ${formaterHeure(premiere.debut)}` };
    }
  }

  return { ouvert: false, texte: 'Fermé' };
}
