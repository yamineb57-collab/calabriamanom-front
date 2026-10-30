import { Routes } from '@angular/router';
import {Home} from './pages/home/home';
import {Menu} from './pages/menu/menu';

export const routes: Routes = [
  {path: '', component: Home},
  {path: 'plats', component: Menu}
];
