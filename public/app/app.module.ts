import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { APP_BASE_HREF, LocationStrategy, PathLocationStrategy } from '@angular/common';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FlexLayoutModule } from '@angular/flex-layout';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

/*
*	Some material components rely on hammerjs
*	CustomMaterialModule loads exact material modules
*/
import '../../node_modules/hammerjs/hammer.js';
import { CustomMaterialModule } from './modules/custom-material.module';

import { AuthGuardGeneral } from './services/auth-guard-general.service';
import { AnonimousGuard } from './services/anonimous-guard.service';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { AppNavComponent } from './components/app-nav.component';
import { AppInfoComponent } from './components/app-info.component';
import { AppIntroComponent } from './components/app-intro.component';
import { AppLoginComponent } from './components/app-login.component';
import { DashboardDetailsComponent } from './components/dashboard-details.component';

import { TranslateModule } from './modules/translate/index';

import { CustomServiceWorkerService } from './services/custom-service-worker.service';
import { CustomDeferredService } from './services/custom-deferred.service';
import { CustomHttpHandlersService } from './services/custom-http-handlers.service';
import { EventEmitterService } from './services/event-emitter.service';
import { WebsocketService } from './services/websocket.service';

import { UsersListService } from './services/users-list.service';
import { UserService } from './services/user.service';
import { ServerStaticDataService } from './services/server-static-data.service';
import { PublicDataService } from './services/public-data.service';

@NgModule({
	declarations: [
		AppComponent, AppNavComponent, AppInfoComponent, AppIntroComponent, AppLoginComponent,
		DashboardDetailsComponent
	],
	imports: [
		BrowserModule, BrowserAnimationsModule, FlexLayoutModule, CustomMaterialModule,
		FormsModule, ReactiveFormsModule, HttpClientModule, TranslateModule, AppRoutingModule
	],
	providers: [
		{ provide: APP_BASE_HREF, useValue: '/' }, { provide: LocationStrategy, useClass: PathLocationStrategy },
		{ provide: 'Window', useValue: window }, CustomServiceWorkerService, CustomDeferredService,
		CustomHttpHandlersService, EventEmitterService, WebsocketService, UserService, AuthGuardGeneral,
		AnonimousGuard, UsersListService, ServerStaticDataService, PublicDataService
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA
	],
	bootstrap: [ AppComponent ]
})
export class AppModule {}
