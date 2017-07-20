import { NgModule} from '@angular/core';
import { MaterialModule, MdToolbarModule, MdMenuModule, MdSidenavModule, MdButtonModule, MdCheckboxModule, MdTooltipModule } from '@angular/material';

@NgModule({
	imports: [
		MaterialModule, // all at once
		/*
		* or selected manually (the list is not full)
		MdToolbarModule, MdMenuModule, MdSidenavModule,
		MdButtonModule, MdCheckboxModule,
		MdTooltipModule, ...
		*/
	],
	exports: [
		MaterialModule, // all at once
		/*
		*	or selected manually (the list is not full)
		MdToolbarModule, MdMenuModule, MdSidenavModule,
		MdButtonModule, MdCheckboxModule,
		MdTooltipModule, ...
		*/
	]
})
export class CustomMaterialModule {}
