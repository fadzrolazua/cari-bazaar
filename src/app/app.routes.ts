import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/bazaar-explorer/bazaar-explorer').then(
        ({ BazaarExplorerComponent }) => BazaarExplorerComponent,
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
