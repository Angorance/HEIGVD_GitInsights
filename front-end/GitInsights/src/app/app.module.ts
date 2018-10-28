import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatGridListModule, MatTooltipModule,
  MatStepperModule, MatIconModule, MatProgressSpinnerModule } from '@angular/material';
  import {MatDialogModule} from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';

import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BtnLoginComponent } from './btn-login/btn-login.component';
import { HttpClientModule } from '@angular/common/http';

import { RouterModule, Routes } from '@angular/router';
import { StatPageComponent } from './stat-page/stat-page.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { TimelineComponent } from './timeline/timeline.component';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';

const appRoutes: Routes = [
  { path: 'stats', component: StatPageComponent },
  { path: 'home', component: LoginPageComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    BtnLoginComponent,
    StatPageComponent,
    PageNotFoundComponent,
    LoginPageComponent,
    TimelineComponent,
    ErrorDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatGridListModule,
    MatStepperModule,
    MatTooltipModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes, { enableTracing: true }),
  ],
  exports: [
    AppComponent,
    BtnLoginComponent,
    StatPageComponent,
    PageNotFoundComponent,
    LoginPageComponent,
  ],
  providers: [],
  entryComponents: [ErrorDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
