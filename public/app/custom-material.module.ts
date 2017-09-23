import { NgModule } from '@angular/core';
import {
	// form controls
	MdAutocompleteModule, MdCheckboxModule, MdDatepickerModule, MdInputModule, MdSelectModule, MdSliderModule,
	// navigation
	MdMenuModule, MdSidenavModule, MdToolbarModule,
	// layout
	MdListModule, MdGridListModule, MdCardModule, MdStepperModule, MdTabsModule, MdExpansionModule,
	// buttons and indicators
	MdButtonModule, MdButtonToggleModule, MdChipsModule, MdIconModule, MdProgressSpinnerModule, MdProgressBarModule,
	// popups and modals
	MdDialogModule, MdTooltipModule, MdSnackBarModule,
	// data table
	MdTableModule, MdSortModule, MdPaginatorModule
} from '@angular/material';

@NgModule({
	imports: [
		// form controls
		MdAutocompleteModule, MdCheckboxModule, MdDatepickerModule, MdInputModule, MdSelectModule, MdSliderModule,
		// navigation
		MdMenuModule, MdSidenavModule, MdToolbarModule,
		// layout
		MdListModule, MdGridListModule, MdCardModule, MdStepperModule, MdTabsModule, MdExpansionModule,
		// buttons and indicators
		MdButtonModule, MdButtonToggleModule, MdChipsModule, MdIconModule, MdProgressSpinnerModule, MdProgressBarModule,
		// popups and modals
		MdDialogModule, MdTooltipModule, MdSnackBarModule,
		// data table
		MdTableModule, MdSortModule, MdPaginatorModule
	],
	exports: [
		// form controls
		MdAutocompleteModule, MdCheckboxModule, MdDatepickerModule, MdInputModule, MdSelectModule, MdSliderModule,
		// navigation
		MdMenuModule, MdSidenavModule, MdToolbarModule,
		// layout
		MdListModule, MdGridListModule, MdCardModule, MdStepperModule, MdTabsModule, MdExpansionModule,
		// buttons and indicators
		MdButtonModule, MdButtonToggleModule, MdChipsModule, MdIconModule, MdProgressSpinnerModule, MdProgressBarModule,
		// popups and modals
		MdDialogModule, MdTooltipModule, MdSnackBarModule,
		// data table
		MdTableModule, MdSortModule, MdPaginatorModule
	]
})
export class CustomMaterialModule {}
