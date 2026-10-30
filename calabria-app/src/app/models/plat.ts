export interface Plat {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
  type: string;
  prix: number;
  prixFamilial?: number | null;
  disponible: boolean;
  ordre?: number | null;
}
