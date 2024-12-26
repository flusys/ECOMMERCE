import { Component, Input, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from "@angular/common";
import {PlatformService} from "flusysng/shared/services";
import {LayoutService} from "flusysng/layout/services";
import { AngularModule, PrimeModule } from 'flusysng/shared/modules';

@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [
    AngularModule,
    PrimeModule
  ],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.scss'
})
export class SettingComponent implements OnInit {
  @Input() minimal = false;

  scales: number[] = [12, 13, 14, 15, 16];

  constructor(
    public layoutService: LayoutService,
    public platformService: PlatformService,
    @Inject(DOCUMENT) private document: Document
  ) {
  }

  ngOnInit(): void {
    if (!this.platformService.isServer) {
      const data = localStorage.getItem('layoutconfig');
      if (data) {
        this.layoutService.config.set(structuredClone(JSON.parse(data)));
      } else {
        this.updatelocalstorage();
      }
    }
  }

  get scale(): number {
    return this.layoutService.config().scale;
  }

  set scale(_val: number) {
    this.layoutService.config.update((config) => (structuredClone({
      ...config,
      scale: _val,
    })));
    this.updatelocalstorage();
  }

  get menuMode(): string {
    return this.layoutService.config().menuMode;
  }

  set menuMode(_val: string) {
    this.layoutService.config.update((config) => (structuredClone({
      ...config,
      menuMode: _val,
    })));
    this.updatelocalstorage();
  }

  get inputStyle(): string {
    return this.layoutService.config().inputStyle;
  }

  set inputStyle(_val: string) {
    this.layoutService.config.update((config) => (structuredClone({
      ...config,
      inputStyle: _val,
    })));
    this.updatelocalstorage();
  }

  set theme(val: string) {
    this.layoutService.config.update((config) => (structuredClone({
      ...config,
      theme: val,
    })));
    this.updatelocalstorage();
  }

  set colorScheme(val: string) {
    this.layoutService.config.update((config) => (structuredClone({
      ...config,
      colorScheme: val,
    })));
    this.updatelocalstorage();
  }

  changeTheme(theme: string, colorScheme: string) {
    this.theme = theme;
    this.colorScheme = colorScheme;
  }

  decrementScale() {
    this.scale--;
  }

  incrementScale() {
    this.scale++;
  }

  updatelocalstorage() {
    this.layoutService.config.update(config=>{
      return {...config,...{colorScheme: 'green',
          theme: 'green-theme',}}
    })
    localStorage.setItem('layoutconfig', JSON.stringify(this.layoutService.config()));
  }
}
