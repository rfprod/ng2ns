import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LazyComponent } from './components/lazy.component';

const LAZY_ROUTES: Routes = [
	{ path: '', component: LazyComponent }
];

@NgModule({
	imports: [ RouterModule.forChild(LAZY_ROUTES) ],
	exports: [ RouterModule ]
})
export class LazyRoutingModule {}
