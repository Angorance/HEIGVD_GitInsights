import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatGridListModule, MatStepperModule } from '@angular/material';
import { MatCardModule } from '@angular/material/card';

import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BtnLoginComponent } from './btn-login/btn-login.component';
import { HttpClientModule } from '@angular/common/http';

import { RouterModule, Routes } from '@angular/router';
import { StatPageComponent } from './stat-page/stat-page.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { CallbackPageComponent } from './callback-page/callback-page.component';

const appRoutes: Routes = [
  { path: "stats", component: StatPageComponent },
  { path: "home", component: LoginPageComponent },
  { path: "callback", component: CallbackPageComponent },
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "**", component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    BtnLoginComponent,
    StatPageComponent,
    PageNotFoundComponent,
    LoginPageComponent,
    CallbackPageComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatGridListModule,
    MatStepperModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes, { enableTracing: true }),
  ],
  exports: [
    AppComponent,
    BtnLoginComponent,
    StatPageComponent,
    PageNotFoundComponent,
    LoginPageComponent,
    CallbackPageComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
