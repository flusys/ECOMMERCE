import { NgModule } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from "primeng/dropdown";
import { CalendarModule } from "primeng/calendar";
import { SelectButtonModule } from "primeng/selectbutton";
import { InputSwitchModule } from "primeng/inputswitch";
import { PasswordModule } from "primeng/password";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";
import { CheckboxModule } from "primeng/checkbox";
import { StepsModule } from "primeng/steps";
import { RippleModule } from "primeng/ripple";
import { PanelModule } from 'primeng/panel';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from "primeng/inputnumber";
import { Textarea } from "primeng/inputtextarea";
import { ProgressBarModule } from "primeng/progressbar";
import { FileUploadModule } from 'primeng/fileupload';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SidebarModule } from 'primeng/sidebar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ListboxModule } from 'primeng/listbox';
import {ToggleButtonModule} from "primeng/togglebutton";
import { OrganizationChartModule } from 'primeng/organizationchart';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
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
    CheckboxModule,
    StepsModule,
    RippleModule,
    PanelModule,
    PaginatorModule,
    TableModule,
    InputNumberModule,
    Textarea,
    ProgressBarModule,
    FileUploadModule,
    OverlayPanelModule,
    SidebarModule,
    RadioButtonModule,
    ListboxModule,
    ToggleButtonModule,
    OrganizationChartModule,
    IconFieldModule,
    InputIconModule,
  ]
})
export class PrimeModule {
}
