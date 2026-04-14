import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'personas', pathMatch: 'full' },
  { path: 'personas', loadComponent: () => import('./pages/personas/persona-list/persona-list').then(m => m.PersonaList) },
  { path: 'personas/new', loadComponent: () => import('./pages/personas/persona-form/persona-form').then(m => m.PersonaForm) },
  { path: 'personas/edit/:id', loadComponent: () => import('./pages/personas/persona-form/persona-form').then(m => m.PersonaForm) }
];
