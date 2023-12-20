import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from '@appStore/app.reducer';
import { Phase } from '@home/phases/model/phase.model';
import { Stage } from '@home/phases/model/stage.model';
import { PhaseContentService } from '@home/phases/phase-content/phase-content.service';
import { PhasesService } from '@home/phases/phases.service';
import { NoBtnReturn } from '@home/store/home.actions';
import { Store } from '@ngrx/store';
import { Startup } from '@shared/models/entities/startup';
import { lastContent } from '@shared/models/lastContent';
import { ToastService } from '@shared/services/toast.service';
import { getNameBase } from '@shared/utils/phases.utils';
import { firstValueFrom, first, Subscription, takeUntil, Subject } from 'rxjs';
import { ShepherdService } from 'angular-shepherd';
import { routeOnboarding } from '@shared/onboarding/onboarding.config';

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.scss'],
})
export class RouteComponent implements OnInit, OnDestroy {
  minWidth = 1200;

  break = false;
  stages$: Subscription;
  stages = [];
  profileDoc;
  startup: Startup;
  phasesBases: Phase[];
  phasesUser: Phase[];
  currentBatch: Phase | any;
  listBasesDone = [];
  lastContent: lastContent;
  onDestroy$: Subject<void> = new Subject();
  completed = 0;
  completedString = '0%';
  constructor(
    private router: Router,
    private toast: ToastService,
    private store: Store<AppState>,
    private phasesService: PhasesService,
    private contentService: PhaseContentService,
    private readonly shepherdService: ShepherdService
  ) {
    this.store.dispatch(new NoBtnReturn());
  }

  ngOnInit() {
    this.checkScreen();
    this.loadComponent();
  }

  ngOnDestroy(): void {
    this.stages$?.unsubscribe();
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  ngAfterViewInit() {
    this.shepherdService.defaultStepOptions = {
      scrollTo: true,
      cancelIcon: {
        enabled: true,
      },
    };
    this.shepherdService.modal = true;
    this.shepherdService.confirmCancel = false;
    this.shepherdService.addSteps(routeOnboarding);
  }

  launchTour() {
    this.shepherdService.start();
  }

  async loadComponent() {
    this.profileDoc = await firstValueFrom(
      this.store
        .select((store) => store.auth.profileDoc)
        .pipe(first((i) => i !== null))
    );
    this.startup = this.profileDoc.startups[0];
    const userPhases = await this.phasesService.getPhasesList(
      this.profileDoc['startups'][0].phases.map((i) => i._id),
      true
    );
    this.currentBatch = await firstValueFrom(
      this.store
        .select((store) => store.home.currentBatch)
        .pipe(first((i) => i !== null))
    );
    this.phasesBases = userPhases.filter((i) => i.basePhase);
    this.phasesUser = userPhases.filter((i) => !i.basePhase);

    this.listBasesDone = [];
    for (const iterator of this.phasesUser) {
      if (this.listBasesDone.includes(iterator.childrenOf)) continue;
      this.listBasesDone.push(iterator.childrenOf);
    }
    this.completed =
      (this.listBasesDone.length / this.phasesBases.length) * 100;
    this.completedString = this.completed.toString() + '%';
    this.lastContentSub();
    this.phasesService
      .watchStages()
      .then((stages$) => {
        this.stages$ = stages$.subscribe((stageList) => {
          this.stages = [];
          let numbPhase = 1;
          for (const stage of stageList) {
            if (stage.isDeleted) continue;
            const phasesStage = this.phasesBases
              .filter((i) => i.stage === stage._id)
              .map((i) => ({
                ...i,
                number: numbPhase++,
                done: this.listBasesDone.includes(i._id),
                currentBatch: this.currentBatch.childrenOf === i._id,
                nameLabel: getNameBase(i),
              }));
            const phasesDone = phasesStage.filter((fase) =>
              this.listBasesDone.includes(fase._id)
            );
            this.stages.push({
              ...stage,
              fases: phasesStage,
              hasPhasesDone: phasesDone.length !== 0,
              hasAllPhasesDone: phasesDone.length === phasesStage.length,
            });
          }
        });
      })
      .catch((err) => {
        this.toast.alert({
          summary: 'Error al cargar etapas',
          detail: err,
          life: 12000,
        });
        this.stages = [];
      });
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

  goContent() {
    this.router.navigate(['/home/contents']);
  }

  lastContentSub() {
    this.store
      .select((store) => store.home.lastContent)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(async (i) => {
        this.lastContent = i;
      });
  }

  goToDescription(stage: Stage) {
    this.router.navigate([`/home/route/stage`], {
      queryParams: { stageId: stage._id },
    });
  }
}
