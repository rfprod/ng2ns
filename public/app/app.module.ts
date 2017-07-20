import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { LocationStrategy, PathLocationStrategy } from '@angular/common';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { APP_ROUTES } from './app.routes';

/*
*	Some material components rely on hammerjs
*	CustomMaterialModule loads exact material modules
*/
import '../../node_modules/hammerjs/hammer.js';
import { CustomMaterialModule } from './custom-material.module';

import { AppComponent } from './app.component';
import { TRANSLATION_PROVIDERS, TranslatePipe, TranslateService } from './translate/index';
import { AppNavComponent } from './components/app-nav.component';
import { AppInfoComponent } from './components/app-info.component';
import { DashboardIntroComponent } from './components/dashboard-intro.component';
import { DashboardLoginComponent } from './components/dashboard-login.component';
import { DashboardDetailsComponent } from './components/dashboard-details.component';
import { EventEmitterService } from './services/event-emitter.service';
import { UsersListService } from './services/users-list.service';
import { UserService } from './services/user.service';
import { ServerStaticDataService } from './services/server-static-data.service';
import { PublicDataService } from './services/public-data.service';
import { nvD3 } from 'ng2-nvd3';

declare let $: JQueryStatic;

@NgModule({
	declarations: [ AppComponent, TranslatePipe, AppNavComponent, AppInfoComponent, DashboardIntroComponent, DashboardLoginComponent, DashboardDetailsComponent, nvD3 ],
	imports 		: [ BrowserModule, BrowserAnimationsModule, CustomMaterialModule, FormsModule, ReactiveFormsModule, HttpModule, RouterModule.forRoot(APP_ROUTES) ],
	providers 	: [ {provide: LocationStrategy, useClass: PathLocationStrategy}, TRANSLATION_PROVIDERS, TranslateService, EventEmitterService, UserService, UsersListService, ServerStaticDataService, PublicDataService ],
	schemas 		: [ CUSTOM_ELEMENTS_SCHEMA ],
	bootstrap 	: [ AppComponent ],
})
export class AppModule {}
