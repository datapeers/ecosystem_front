import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PrimengModule } from './primeng/primeng.module';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';
import { GraphQLModule } from '@graphqlApollo/graphql.module';

// ?---------- Components & Services ---------------------
import { AppComponent } from './app.component';
import { TopNavComponent } from './navbar/top-nav/top-nav.component';
import { SideNavComponent } from './navbar/side-nav/side-nav.component';
import { SignInComponent } from './authentication/sign-in/sign-in.component';
import { SignUpComponent } from './authentication/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './authentication/forgot-password/forgot-password.component';
import { AuthService } from './authentication/auth.service';
import { appReducers } from '@appStore/app.reducer';
import { ToastService } from '@shared/services/toast.service';
import { HomeComponent } from './home/home.component';
import { BackgroundComponent } from './shared/components/layout/background/background.component';
import { SideNavItemComponent } from './navbar/side-nav/side-nav-item/side-nav-item.component';

@NgModule({
  declarations: [
    AppComponent,
    TopNavComponent,
    SideNavComponent,
    SignInComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    HomeComponent,
    BackgroundComponent,
    SideNavItemComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    provideAuth(() => getAuth()),
    PrimengModule,
    StoreModule.forRoot(appReducers, {}),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
    FontAwesomeModule,
    GraphQLModule,
    HttpClientModule,
  ],
  providers: [AuthService, ToastService],
  bootstrap: [AppComponent],
})
export class AppModule {}
