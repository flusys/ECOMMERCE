import { NgModule } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from "primeng/dropdown";
import { CalendarModule } from "primeng/calendar";
import { SelectButtonModule } from "primeng/selectbutton";
import { InputSwitchModule } from "primeng/inputswitch";
import { PasswordModule } from "primeng/password";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";
import { DynamicDialog } from 'primeng/dynamicdialog';
import { CheckboxModule } from "primeng/checkbox";
import { StepsModule } from "primeng/steps";
import { RippleModule } from "primeng/ripple";
import { PanelModule } from 'primeng/panel';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from "primeng/inputnumber";
import { TextareaModule } from 'primeng/textarea';
import { ProgressBarModule } from "primeng/progressbar";
import { FileUploadModule } from 'primeng/fileupload';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ListboxModule } from 'primeng/listbox';

@NgModule({
  exports: [
    InputTextModule,
    DropdownModule,
    CalendarModule,
    SelectButtonModule,
    InputSwitchModule,
    PasswordModule,
    ButtonModule,
    TooltipModule,
    DynamicDialog,
    CheckboxModule,
    StepsModule,
    RippleModule,
    PanelModule,
    PaginatorModule,
    TableModule,
    InputNumberModule,
    TextareaModule,
    ProgressBarModule,
    FileUploadModule,
    OverlayPanelModule,
    ListboxModule
  ]
})
export class PrimeModule {
}
