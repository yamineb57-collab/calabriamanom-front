import { Routes } from '@angular/router';
import {Home} from './pages/home/home';
import {Menu} from './pages/menu/menu';
import {About} from './pages/about/about';

export const routes: Routes = [
  {path: '', component: Home},
  {path: 'plats', component: Menu},
  {path: 'about', component: About}
];
