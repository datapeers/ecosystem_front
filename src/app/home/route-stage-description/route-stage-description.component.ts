import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppState } from '@appStore/app.reducer';
import { User } from '@auth/models/user';
import { Phase } from '@home/phases/model/phase.model';
import { Stage } from '@home/phases/model/stage.model';
import { PhasesService } from '@home/phases/phases.service';
import { ActivateBtnReturn } from '@home/store/home.actions';
import { Store } from '@ngrx/store';
import { Startup } from '@shared/models/entities/startup';
import { ToastService } from '@shared/services/toast.service';
import { getNameBase } from '@shared/utils/phases.utils';
import { first, firstValueFrom, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-route-stage-description',
  templateUrl: './route-stage-description.component.html',
  styleUrls: ['./route-stage-description.component.scss'],
})
export class RouteStageDescriptionComponent implements OnInit, OnDestroy {
  profileDoc;
  startup: Startup;
  onDestroy$: Subject<void> = new Subject();
  currentBatch: Phase | any;
  phasesBases: Phase[] = [];
  phasesUser: Phase[] = [];
  stages: Stage[] | any[] = [];
  listBasesDone = [];
  stages$: Subscription;
  paramSub$: Subscription;
  stage: Stage | any;
  prevStage: Stage | any;
  nextStage: Stage | any;
  loading = true;
  user: User;
  constructor(
    private router: Router,
    private toast: ToastService,
    private store: Store<AppState>,
    private phasesService: PhasesService,
    private route: ActivatedRoute
  ) {
    this.store.dispatch(new ActivateBtnReturn());
    firstValueFrom(
      this.store
        .select((store) => store.auth.user)
        .pipe(first((i) => i !== null))
    ).then((u) => (this.user = u));
  }

  ngOnInit(): void {
    this.loadComponent();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
    this.stages$?.unsubscribe();
    this.paramSub$?.unsubscribe();
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

    this.phasesService
      .watchStages()
      .then((stages$) => {
        this.stages$ = stages$.subscribe(async (stageList) => {
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
          this.watchContentSelector();
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

  watchContentSelector() {
    this.paramSub$ = this.route.queryParamMap.subscribe((params) => {
      const stageId = params.get('stageId');
      this.setStage(stageId);
    });
  }

  setStage(id?: string) {
    this.loading = true;
    let indexStage = id ? this.stages.findIndex((i) => i._id === id) : 0;
    if (indexStage === -1) indexStage = 0;
    this.stage = this.stages[indexStage];
    this.prevStage = indexStage === 0 ? undefined : this.stages[indexStage - 1];
    this.nextStage =
      indexStage + 1 >= this.stages.length
        ? undefined
        : this.stages[indexStage + 1];
    this.loading = false;
  }

  changesStage(stage: Stage) {
    console.log('pasa?');
    this.router.navigate(['home/route/stage'], {
      queryParams: { stageId: stage._id },
    });
  }

  gradient(color: string) {
    const colorRgb = this.hexToRgb(color);
    const style = `linear-gradient(180deg, ${this.withOpacity(
      color,
      0.3
    )} 0%, #ffffff 100%)`;
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
}
