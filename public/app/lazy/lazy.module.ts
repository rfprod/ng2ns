import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LazyComponent } from './components/lazy.component';

import { LazyRoutingModule } from './lazy-routing.module';

@NgModule({
	declarations:	[ LazyComponent ],
	imports:			[ CommonModule, LazyRoutingModule ],
	bootstrap:		[]
})
export class LazyModule {}
