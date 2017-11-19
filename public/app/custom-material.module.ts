import { NgModule } from '@angular/core';
import {
	// form controls
	MatAutocompleteModule, MatCheckboxModule, MatDatepickerModule, MatNativeDateModule, MatInputModule, MatSelectModule, MatSliderModule, MatSlideToggleModule, MatRadioModule,
	// navigation
	MatMenuModule, MatSidenavModule, MatToolbarModule,
	// layout
	MatListModule, MatGridListModule, MatCardModule, MatStepperModule, MatTabsModule, MatExpansionModule,
	// buttons and indicators
	MatButtonModule, MatButtonToggleModule, MatChipsModule, MatIconModule, MatProgressSpinnerModule, MatProgressBarModule,
	// popups and modals
	MatDialogModule, MatTooltipModule, MatSnackBarModule,
	// data table
	MatTableModule, MatSortModule, MatPaginatorModule,
	// misc
	MatOptionModule, MatRippleModule

} from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';

@NgModule({
	imports: [
		// form controls
		MatAutocompleteModule, MatCheckboxModule, MatDatepickerModule, MatNativeDateModule, MatInputModule, MatSelectModule, MatSliderModule, MatSlideToggleModule, MatRadioModule,
		// navigation
		MatMenuModule, MatSidenavModule, MatToolbarModule,
		// layout
		MatListModule, MatGridListModule, MatCardModule, MatStepperModule, MatTabsModule, MatExpansionModule,
		// buttons and indicators
		MatButtonModule, MatButtonToggleModule, MatChipsModule, MatIconModule, MatProgressSpinnerModule, MatProgressBarModule,
		// popups and modals
		MatDialogModule, MatTooltipModule, MatSnackBarModule,
		// data table
		MatTableModule, MatSortModule, MatPaginatorModule,
		// misc
		MatOptionModule, MatRippleModule,
		// cdk
		CdkTableModule
	],
	exports: [
		// form controls
		MatAutocompleteModule, MatCheckboxModule, MatDatepickerModule, MatNativeDateModule, MatInputModule, MatSelectModule, MatSliderModule, MatSlideToggleModule, MatRadioModule,
		// navigation
		MatMenuModule, MatSidenavModule, MatToolbarModule,
		// layout
		MatListModule, MatGridListModule, MatCardModule, MatStepperModule, MatTabsModule, MatExpansionModule,
		// buttons and indicators
		MatButtonModule, MatButtonToggleModule, MatChipsModule, MatIconModule, MatProgressSpinnerModule, MatProgressBarModule,
		// popups and modals
		MatDialogModule, MatTooltipModule, MatSnackBarModule,
		// data table
		MatTableModule, MatSortModule, MatPaginatorModule,
		// misc
		MatOptionModule, MatRippleModule,
		// cdk
		CdkTableModule
	]
})
export class CustomMaterialModule {}
