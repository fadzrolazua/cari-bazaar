import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { BAZAAR_REPOSITORY } from './core/application/ports/bazaar.repository';
import { USER_LOCATION_PROVIDER } from './core/application/ports/user-location.provider';
import { HttpBazaarRepository } from './core/infrastructure/repositories/http-bazaar.repository';
import { BrowserGeolocationProvider } from './core/infrastructure/location/browser-geolocation.provider';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideRouter(routes),
    {
      provide: BAZAAR_REPOSITORY,
      useClass: HttpBazaarRepository,
    },
    {
      provide: USER_LOCATION_PROVIDER,
      useClass: BrowserGeolocationProvider,
    },
  ],
};
