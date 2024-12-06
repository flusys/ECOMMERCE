import { Component, computed, ElementRef, ViewChild } from '@angular/core';
import { RouterLink } from "@angular/router";
import { ProfileComponent } from "../shared-component/profile/profile.component";
import { SettingComponent } from "../shared-component/setting/setting.component";
import { AngularModule } from '@shared/modules/angular.module';
import { PrimeModule } from '@shared/modules/prime.module';
import { SessionService } from '@core/layout/services/session.service';
import { environment } from 'src/environments/environment';
import {LayoutService} from "flusysng/layout/services";
import {EditModeElementChangerDirective} from "flusysng/shared/directives";
import {FormControl} from "@angular/forms";
import {debounceTime, of, switchMap} from "rxjs";

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [
    AngularModule,
    RouterLink,
    PrimeModule,
    //Component
    ProfileComponent,
    SettingComponent,
    EditModeElementChangerDirective
  ],
  templateUrl: './app-top-bar.component.html',
  styleUrl: './app-top-bar.component.scss'
})
export class AppTopBarComponent {
  @ViewChild('menuButton') menuButton!: ElementRef;
  @ViewChild('topBarMenuButton') topbarMenuButton!: ElementRef;
  @ViewChild('topBarSearchButton') topBarSearchButton!: ElementRef;
  @ViewChild('topBarMenu') menu!: ElementRef;
  @ViewChild('topBarSearch') search!: ElementRef;

  searchSuggestionDataList:Array<string>=[];
  searchControl: FormControl = new FormControl('');

  getLogoWidth = computed<number>(() => {
    return 245 + ((14 - parseInt(this.layoutService.config().scale.toFixed())) * 3);
  })

  constructor(public layoutService: LayoutService,
    private sessionService: SessionService
  ) {
  }

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(500),
        switchMap((searchTerm: string) => {
          this.searchSuggestionDataList.push(searchTerm);
          return of(this.searchSuggestionDataList)
        })
      )
      .subscribe(data => {
        console.warn(data)
        this.searchSuggestionDataList = data;
      });
  }

  gotoBusinessManager() {
    this.sessionService.getCurrentSession().subscribe(res => {
      if (res.success) {
        window.open(environment.appBmDomainSessionUrl + "/" + res.result)
      }
    })
  }

  get dropdownOption(){
    return [
      {label:'All',value:0},
      {label:'Service Provider',value:1},
      {label:'Life Partner',value:2},
      {label:'Blood Donor',value:3},
      {label:'Organ Donor',value:4},
      {label:'Person',value:5},
      {label:'Agent',value:6},
      {label:'Product',value:7},
      {label:'Digital Product',value:8},
      {label:'Business Manager',value:9},
      {label:'Advance Search',value:10}
    ]
  }

}
