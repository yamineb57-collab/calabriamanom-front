import { TypePlat } from './type-plat';

export interface Plat {
  id: number;
  name: string;
  description: string;
  imageURL: string;
  type: TypePlat;
}
