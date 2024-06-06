import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CatalogoComponent } from './pages/catalogo/catalogo.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { ClientResolver } from './services/client.resolver';

export const routes: Routes = [
  // { path: ':businessSlug', component: HomeComponent },
  // { path: ':businessSlug/inicio', component: HomeComponent },
  // { path: ':businessSlug/catalogo', component: CatalogoComponent },
  // { path: ':businessSlug/productos', component: CatalogoComponent },
  // { path: ':businessSlug/carta', component: CatalogoComponent },
  // { path: '', component: HomeComponent },
  {
    path: '',
    children: [
      {
        path: '',
        component: HomeComponent,
        title: 'Inicio',
        resolve: {
          businessSlug: ClientResolver,
        }
      },
      {
        path: 'inicio',
        component: HomeComponent,
        title: 'Inicio',        
        resolve: {
          businessSlug: ClientResolver,
        }
      },
      // {
      //   path: 'productos',
      //   component: CatalogoComponent,
      //   title: 'Productos',
      // },
      // {
      //   path: 'catalogo',
      //   component: CatalogoComponent,
      //   title: 'Catálogo',
      // },
      // {
      //   path: 'carta',
      //   component: CatalogoComponent,
      //   title: 'La carta',
      // },
    ],
    title: 'Inicio',
  },
  {
    path: 'negocio-no-existente',
    component: NotFoundComponent,
    title: 'Negocio no existente',
  },
  { path: '**', component: NotFoundComponent },
];
