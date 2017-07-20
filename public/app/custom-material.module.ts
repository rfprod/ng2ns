import { NgModule} from '@angular/core';
import { MdToolbarModule, MdMenuModule, MdSidenavModule, MdButtonModule, MdCheckboxModule } from '@angular/material';

@NgModule({
	imports: [
		MdToolbarModule, MdMenuModule, MdSidenavModule,
		MdButtonModule, MdCheckboxModule
	],
	exports: [
		MdToolbarModule, MdMenuModule, MdSidenavModule,
		MdButtonModule, MdCheckboxModule
	]
})
export class CustomMaterialModule {}
