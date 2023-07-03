import {AfterViewInit, ChangeDetectionStrategy, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid
} from "ng-apexcharts";

import {
  TUI_IS_CYPRESS, TuiContextWithImplicit,
  TuiDay,
  TuiDayLike,
  TuiDayRange,
  TuiMonth,
  tuiPure,
  TuiStringHandler, tuiSum,
} from '@taiga-ui/cdk';
import {TUI_MONTHS, tuiFormatNumber} from '@taiga-ui/core';
import {
  BehaviorSubject,
  catchError,
  defaultIfEmpty, filter,
  forkJoin,
  Observable,
  of, shareReplay,
  Subscription,
  switchMap,
  take, tap
} from 'rxjs';
import {map} from 'rxjs/operators';
import {FormControl, FormGroup} from "@angular/forms";
import {StatisticsService} from "../../services/statistics.service";
import {StatisticsType} from "../../models/statisticsType";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};
interface ChartData {
  type: string;
  number: number;
}

interface HintData {
  type: string;
  number: number;
}

interface PieChartData {
  chartData: ChartData[];
  hintData: HintData[];
}

@Component({
  selector: 'app-statistics-page',
  templateUrl: './statistics-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,

  styleUrls: ['./statistics-page.component.scss']
})
export class StatisticsPageComponent implements OnInit, AfterViewInit {
  currentPage = 1;
  pageSize = 10;
  obsArray: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  users$: Observable<any> = this.obsArray.asObservable();
  selectedRange = new TuiDayRange(
    TuiDay.currentLocal().append({day: -7}),
    TuiDay.currentLocal(),
  );
  selectedRange2 = new TuiDayRange(
    TuiDay.currentLocal().append({day: -7}),
    TuiDay.currentLocal(),
  );
  maxDate: Date = new Date();

  allUsersNb: number;
  newUsersNb: number;
  rangeDate = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  rangeDate2 = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  readonly maxLength: TuiDayLike = {month: 12};
  val: number[] = []
  private chartData$: Observable<PieChartData>;

  ngAfterViewInit() {
    console.log("ce[")
  }

  statisticsCategoryNb$: Observable<any>;
  statisticsCategoryLabel$: Observable<any>;

  statisticsTypeNb$: Observable<any>;
  statisticsTypeLabel$: Observable<any>;

  toggle(any: string) {

    this.selectedButton = any;
    this.currentPage = 1;
    this.obsArray.next([])
    this.getUsers(any)
  }

  getStatisticsByType(){
    const statistics$ = this.statisticsService.getStatisticsByType().pipe(
      filter(statistics => !!statistics),
      shareReplay(1)
    );

    this.statisticsTypeNb$ = statistics$.pipe(
      map(statistics => statistics.map(statistic => statistic.number)),
      map(numbers => numbers.length > 0 ? numbers : [0]) // Adăugăm valoarea 0 în cazul în care nu există alte valori
    );    this.statisticsTypeLabel$ = statistics$.pipe(map(statistics => statistics.map(statistic => statistic.type)));
  }
  getStatisticsByCategory(){
    const statistics$ = this.statisticsService.getStatisticsByCategory().pipe(
      filter(statistics => !!statistics),
      shareReplay(1)
    );

    this.statisticsCategoryNb$ = statistics$.pipe(
      map(statistics => statistics.map(statistic => statistic.number)),
      map(numbers => numbers.length > 0 ? numbers : [0]) // Adăugăm valoarea 0 în cazul în care nu există alte valori
    );

    this.statisticsCategoryLabel$ = statistics$.pipe(
      map(statistics => statistics.map(statistic => statistic.type)),
    );
  }


  ngOnInit() {
    this.statisticsService.getAllUsersNb().subscribe((data) => this.allUsersNb = data)
    this.statisticsService.getNewsUsersNb().subscribe(data => this.newUsersNb = data)
    this.getStatisticsByType();
   this. getStatisticsByCategory();
   this.getMostAppreciatedImage()
    let today = new Date();
    let lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);
    this.rangeDate = new FormGroup({
      start: new FormControl(lastWeek),
      end: new FormControl(today)
    });
    this.rangeDate2 = new FormGroup({
      start: new FormControl(lastWeek),
      end: new FormControl(today)
    });
    this.getUsers('allUsers');

    let startTuiDay: TuiDay;
    let endTuiDay
    this.rangeDate.get('start')!.valueChanges.subscribe(start => {

      console.log(this.val)
      startTuiDay = TuiDay.fromLocalNativeDate(start);


    });

    this.rangeDate.get('end')!.valueChanges.subscribe(end => {
      if (end == null)
        return
      endTuiDay = TuiDay.fromLocalNativeDate(end);
      if (this.rangeDate.valid) {
        this.selectedRange = new TuiDayRange(startTuiDay, endTuiDay);
        console.log("cen")
      }

    });

    this.rangeDate2.get('start')!.valueChanges.subscribe(start => {

      console.log(this.val)
      startTuiDay = TuiDay.fromLocalNativeDate(start);


    });

    this.rangeDate2.get('end')!.valueChanges.subscribe(end => {
      if (end == null)
        return
      endTuiDay = TuiDay.fromLocalNativeDate(end);
      if (this.rangeDate.valid) {
        this.selectedRange2 = new TuiDayRange(startTuiDay, endTuiDay);
      }

    });
  }


  selectedButton: string = 'allUsers';
  readonly xStringify$: Observable<TuiStringHandler<TuiDay>> = this.months$.pipe(
    map(
      months =>
        ({month, day}) =>
          `${months[month]}, ${day}`,
    ),
  );

  constructor(
    private statisticsService: StatisticsService,
    @Inject(TUI_MONTHS) private readonly months$: Observable<readonly string[]>,
    @Inject(TUI_IS_CYPRESS) readonly isCypress: boolean,
  ) {
  }


  @tuiPure
  computeLabels$({from, to}: TuiDayRange): Observable<readonly string[]> {
    return this.months$.pipe(
      map(months =>
        Array.from(
          {length: TuiMonth.lengthBetween(from, to) + 1},
          (_, i) => months[from.append({month: i}).month],
        ),
      ),
    );

  }


  convertToTuiDay(date: Date): TuiDay {
    return TuiDay.fromLocalNativeDate(date);
  }

  readonly yStringify: TuiStringHandler<number> = y =>
    `${(y / 10).toLocaleString('en-US', {maximumFractionDigits: 0})}  Users`;

  readonly yStringifyImages: TuiStringHandler<number> = y =>
    `${(y / 10).toLocaleString('en-US', {maximumFractionDigits: 0})}  Images`;


  @tuiPure

  public computeValue({from, to}: TuiDayRange): Observable<ReadonlyArray<[TuiDay, number]>> {

    let today = new Date(from.year, from.month, from.day);
    let nextWeek = new Date(to.year, to.month, to.day);
    console.log("ce ccat")
    return this.statisticsService.getStatistics(today, nextWeek).pipe(
      map((values: number[]) => {
        const result: ReadonlyArray<[TuiDay, number]> = values.map((value, i) => [
          from.append({day: i}),
          value * 10,
        ]);
        return result;
      }),
    );
  }
  @tuiPure

  public computeValue2({from, to}: TuiDayRange): Observable<ReadonlyArray<[TuiDay, number]>> {

    let today1 = new Date(from.year, from.month, from.day);
    let nextWeek = new Date(to.year, to.month, to.day);
    return this.statisticsService.getStatistics2(today1, nextWeek).pipe(
      map((values: number[]) => {
        const result: ReadonlyArray<[TuiDay, number]> = values.map((value, i) => [
          from.append({day: i}),
          value * 10,
        ]);
        return result;
      }),
    );
  }


  onScroll() {
    this.currentPage += 1;
    this.obsArray.next([]);

    forkJoin([
      this.users$.pipe(take(1)),
      this.selectedButton === 'allUsers'
        ? this.statisticsService.getAllUser(this.currentPage, this.pageSize)
        : this.statisticsService.getNewlyUser(this.currentPage, this.pageSize)
    ]).pipe(
      switchMap((images1: Array<Array<any>>) => {
        const newArr = [...images1[0], ...images1[1]];
        return of(newArr);
      })
    ).subscribe(images => {
      this.obsArray.next(images);
    });
  }

  getUsers(type: string) {
    this.obsArray.next([]);

    switch (type) {
      case'allUsers':
        this.statisticsService.getAllUser(this.currentPage, this.pageSize).subscribe(images => {
          this.obsArray.next(images);
        })
        break;
      case 'newUsers':
        this.statisticsService.getNewlyUser(this.currentPage, this.pageSize).subscribe(images => {
          this.obsArray.next(images);
        })
        break;
      case 'allImages':
        this.statisticsService.getAllImages(this.currentPage, this.pageSize).subscribe(images => {
          this.obsArray.next(images);
        })
        break;
      case 'newImages':
        this.statisticsService.getNewlyUploadedImages(this.currentPage, this.pageSize).subscribe(images => {
          this.obsArray.next(images);
        })
        break;
    }

  }

  formatDate(date: Date): string {
    const dateCorrect = new Date(date);
    const day = dateCorrect.getDate();
    const month = dateCorrect.toLocaleString('en-US', {month: 'long'});
    const year = dateCorrect.getFullYear();
    return `${day} ${month} ${year}`;
  }

  isUserType() {
    return this.selectedButton.includes('User')
  }



  private readonly labels = ['Food', 'Cafe', 'Open Source', 'Taxi', 'other'];
  readonly value = [13769, 12367, 10172, 3018, 2592];
  readonly total = tuiSum(...this.value);

  index = NaN;
index1=NaN;

  getSum(numbers: readonly number[] | null, index: number): number | null {
    if (!numbers) {
      return null;
    }
    if ( Number.isNaN(index)) {
      return numbers.reduce((a, b) => a + b, 0);
    }
    return numbers[index];
  }

   getLabel(labels:string[],index:number): string {
    return Number.isNaN(index) ? 'Total' : labels[index];
  }


  readonly value2 = [
    [1000, 8000, 4000, 3000, 4000,1000, 8000, 4000, 3000, 4000,1000, 8000, 4000, 3000, 4000],
  ];

  readonly labelsX = ['Jan 2021', 'Feb', 'Mar','Mar','ce','Jan 2021', 'Feb', 'Mar','Mar','ce','Jan 2021', 'Feb', 'Mar','Mar','ce'];
  readonly labelsY = ['0', '5','10','15','20','25'];



  readonly hint = ({$implicit}: TuiContextWithImplicit<number>): string =>
    `Valorarea este ${$implicit}`

  statisticsImageNb$:Observable<any>
  statisticsImageName$:Observable<any>
  getMostAppreciatedImage(){
    const statistics$ = this.statisticsService.getMostAppreciatedImages().pipe(
      filter(statistics => !!statistics),
      shareReplay(1)
    );

    this.statisticsImageNb$ = statistics$.pipe(
      map(statistics => [statistics.map(statistic => statistic.likes.length)]),
      map(numbers => numbers.length > 0 ? numbers : [[0]])
    );

    this.statisticsImageName$ = statistics$.pipe(map(statistics => statistics.map(statistic => statistic.title)));
  }


  goToUserProfile(userId:number) {
    window.location.href='user-profile/'+userId;
  }

  goToImagePage(imageName:any) {
    const clickedElement = event.target as HTMLElement;

 console.log(clickedElement)
  }
}
