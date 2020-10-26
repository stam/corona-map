import { observable, action, computed } from "mobx";

export interface Measure {
  Response_measure: string;
  date_end: string;
  date_start: string;
}

interface DayResult {
  biweeklyTotalPer100k: number;
  cases: number;
  date: string;
  hospitalOccupancyPer100k?: number;
  deaths: number;
}

interface DateMap<T> {
  [date: string]: T;
}
interface CountryMap<T> {
  [country: string]: T;
}

export class DataStore {
  @observable loading = true;
  @observable visibleDate = new Date("2020-10-25");
  @observable date = new Date("2020-10-25");
  @computed get dateIndex() {
    return this.date.toISOString().split("T")[0];
  }
  _dateTimeoutHandler?: any;

  @observable.ref worldData: DateMap<CountryMap<DayResult>> = {};
  @observable.ref countryData: CountryMap<DateMap<DayResult>> = {};
  @observable.ref geoJson: any;

  @observable dateCount = 0;
  @observable startDate = new Date("2020-01-01");

  @observable
  selectedCountry?: string = "Netherlands";

  constructor() {
    this.bootstrap();
  }

  @computed get selectedCountryData() {
    if (!this.selectedCountry) {
      return {};
    }
    return this.countryData[this.selectedCountry];
  }

  @computed get selectedDateWorldData() {
    return this.worldData[this.dateIndex];
  }

  @action async bootstrap() {
    await this.fetchGeoJson();
    await this.fetchData();

    if (this.selectedCountry) {
      this.selectCountry(this.selectedCountry);
    }
    this.loading = false;
  }

  @action private async fetchData() {
    const res = await fetch(`${process.env.PUBLIC_URL}/countries.json`);
    this.countryData = await res.json();
    const res2 = await fetch(`${process.env.PUBLIC_URL}/world.json`);
    this.worldData = await res2.json();
  }

  @action selectCountry(country: string) {
    this.selectedCountry = country;
    // this.dateCount = val.length;
    // this.startDate = new Date(val[val.length - 1].date);

    const selectedCountryData = this.countryData[country];
    const lastDate = Object.keys(selectedCountryData)[0];

    if (!lastDate) {
      return;
    }

    this.dateCount =
      (new Date(lastDate).getTime() - this.startDate.getTime()) /
      1000 /
      60 /
      60 /
      24;
  }

  @action changeDate(date: Date) {
    this.visibleDate = date;
    this.date = date;
    // this.calculateResultForDate();
    // if (this._dateTimeoutHandler) {
    //   clearTimeout(this._dateTimeoutHandler);
    // }
    // this._dateTimeoutHandler = setTimeout(() => {

    //   this.date = date;
    // }, 100);
  }

  @action async fetchGeoJson() {
    const res = await fetch(`${process.env.PUBLIC_URL}/europe.geojson`);
    this.geoJson = await res.json();
  }
}

export const store = new DataStore();
