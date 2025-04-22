import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';
import { routes} from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes, withPreloading(PreloadAllModules)), 
    provideHttpClient( withInterceptors([authInterceptor])),
    
  ]
};
