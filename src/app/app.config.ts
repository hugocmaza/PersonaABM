import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MAT_DATE_LOCALE, MatDateFormats, provideNativeDateAdapter } from '@angular/material/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

const APP_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: { day: '2-digit', month: '2-digit', year: 'numeric' }
  },
  display: {
    dateInput: { day: '2-digit', month: '2-digit', year: 'numeric' },
    monthYearLabel: { month: 'long', year: 'numeric' },
    dateA11yLabel: { day: '2-digit', month: 'long', year: 'numeric' },
    monthYearA11yLabel: { month: 'long', year: 'numeric' }
  }
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideNativeDateAdapter(APP_DATE_FORMATS),
    { provide: MAT_DATE_LOCALE, useValue: 'es-AR' },
    provideRouter(routes)
  ]
};
