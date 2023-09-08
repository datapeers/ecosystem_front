import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.scss'],
})
export class RouteComponent {
  minWidth = 1200;

  break = false;

  stages = [
    {
      label: 'ONBOARDING',
      icon: 'brand-asana',
      color: '#4552A7',
      fases: [
        {
          number: 1,
        },
        {
          number: 2,
        },
      ],
    },
    {
      label: 'EARLY',
      icon: 'social',
      color: '#EA4254',
      fases: [
        {
          number: 3,
        },
        {
          number: 4,
        },
      ],
    },
    {
      label: 'GROWTH',
      icon: 'plant',
      color: '#F8A70B',
      fases: [
        {
          number: 5,
        },
        {
          number: 6,
        },
        {
          number: 7,
        },
      ],
    },
    {
      label: 'LATE',
      icon: 'tree',
      color: '#B8C53A',
      fases: [
        {
          number: 8,
        },
        {
          number: 9,
        },
      ],
    },
    {
      label: 'LAUNCH',
      icon: 'plant-2',
      color: '#DB5F39',
      fases: [
        {
          number: 10,
        },
      ],
    },
  ];

  ngOnInit() {
    this.checkScreen();
  }

  checkScreen() {
    this.break = window.innerWidth < 1200;
  }

  gradient(color: string) {
    const colorRgb = this.hexToRgb(color);
    const style = `linear-gradient(${
      this.break ? '270deg' : '180deg'
    }, ${this.withOpacity(color, 0.3)} 0%, #ffffff 100%)`;
    return style;
  }

  hexToRgb(hex: string) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  withOpacity(color: string, opacity: number) {
    const colorRgb = this.hexToRgb(color);
    const style = `rgba(${colorRgb.r},${colorRgb.g},${colorRgb.b}, ${opacity})`;
    return style;
  }

  heightStage(fasesNumber: number) {
    if (this.break) {
      return 'auto';
    }

    return `fasesNumber * 100`;
  }

  widthStage(fasesNumber: number) {
    if (!this.break) {
      return 'auto';
    }

    return `fasesNumber * 10rem`;
  }

  dotedHeightLine(faseOrder: number) {
    if (this.break) {
      return 0.0625;
    }
    return 1.5 + faseOrder * 0.5;
  }

  dotedWidthLine(faseOrder: number) {
    if (!this.break) {
      return '0.0625';
    }

    return 1.5 + faseOrder * 0.3;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.break = window.innerWidth < 1200;
  }
}
