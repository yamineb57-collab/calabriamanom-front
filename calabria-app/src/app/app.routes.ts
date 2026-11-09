import { Routes } from '@angular/router';
import {Home} from './pages/home/home';
import {Menu} from './pages/menu/menu';
import {About} from './pages/about/about';
import {Contact} from './pages/contact/contact';
import {Login} from './admin/login/login';
import {Dashboard} from './admin/dashboard/dashboard';
import {MenuManagement} from './admin/menu-management/menu-management';

export const routes: Routes = [
  {path: '', component: Home},
  {path: 'plats', component: Menu},
  {path: 'about', component: About},
  {path: 'contact', component: Contact},

  { path: 'admin', component: Login },
  { path: 'admin/dashboard', component: Dashboard },
  { path: 'admin/carte', component: MenuManagement }
];
