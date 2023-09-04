import {
  style,
  trigger,
  state,
  transition,
  animate,
} from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IMenuOption } from '@shared/models/menu';

@Component({
  selector: 'app-sublevel-menu',
  template: `
    <ul
      *ngIf="collapsed && data.children && data.children.length > 0"
      [@submenu]="
        opened
          ? {
              value: 'visible',
              params: {
                transitionParams: '400ms cubic-bezier(0.86, 0, 0.07, 1)',
                height: '*'
              }
            }
          : {
              value: 'hidden',
              params: {
                transitionParams: '400ms cubic-bezier(0.86, 0, 0.07, 1)',
                height: '0'
              }
            }
      "
      class="sublevel-nav"
    >
      <li *ngFor="let item of data.children" class="sublevel-nav-item">
        <a
          class="sublevel-nav-link"
          (click)="handleClick(item)"
          *ngIf="item.children && item.children.length > 0"
          [ngClass]="getActiveClass(item)"
        >
          <i-tabler class="sublevel-link-icon" [name]="item.icon"></i-tabler>
          <span class="sublevel-link-text" @fadeInOut *ngIf="collapsed">{{
            item.label
          }}</span>
          <i
            *ngIf="item.children && collapsed"
            class="menu-collapse-icon"
            [ngClass]="!item.opened ? 'pi pi-angle-down' : 'pi pi-angle-up'"
          >
          </i>
        </a>
        <a
          class="sublevel-nav-link"
          *ngIf="
            !item.children || (item.children && item.children.length === 0)
          "
          [routerLink]="item.rute"
          [queryParams]="item.queryParamsRute"
          routerLinkActive="active-sublevel"
          [routerLinkActiveOptions]="{ exact: true }"
        >
          <i-tabler class="sublevel-link-icon" [name]="item.icon"></i-tabler>
          <span class="sublevel-link-text" fadeInOut *ngIf="collapsed">{{
            item.label
          }}</span>
        </a>
        <div *ngIf="item.children && item.children.length > 0">
          <app-sublevel-menu
            [data]="item"
            [collapsed]="collapsed"
            [multiple]="multiple"
            [opened]="item.opened"
          ></app-sublevel-menu>
        </div>
      </li>
    </ul>
  `,
  styleUrls: ['./side-nav.component.scss'],
  animations: [
    trigger('submenu', [
      state('hidden', style({ height: '0', overflow: 'hidden' })),
      state('visible', style({ height: '*' })),
      transition('visible <=> hidden', [
        style({ overflow: 'hidden' }),
        animate('{{transitionParams}}'),
      ]),

      transition('void => *', animate(0)),
    ]),
  ],
})
export class SublevelMenuComponent implements OnInit {
  @Input() data: IMenuOption = {
    label: '',
    type: 'single',
    children: [],
  };
  @Input() collapsed = false;
  @Input() animating: boolean | undefined;
  @Input() opened: boolean | undefined;
  @Input() multiple: boolean = false;
  constructor(private router: Router) {}

  ngOnInit(): void {}

  handleClick(item: IMenuOption) {
    if (!this.multiple) {
      if (this.data.children && this.data.children.length > 0) {
        for (const modelItem of this.data.children) {
          if (item !== modelItem && modelItem.opened) {
            modelItem.opened = false;
          }
        }
      }
    }
    item.opened = !item.opened;
  }

  getActiveClass(item: IMenuOption): string {
    return item.opened && this.router.url.includes(item.rute)
      ? 'active-sublevel'
      : '';
  }
}
