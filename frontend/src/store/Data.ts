import { observable, action } from "mobx";
import { map } from "lodash";

import distributionData from "./distribution.json";
import measuresData from "./measures.json";
import europeGeoJson from "./europe.json";

export interface Summary {
  count: number | undefined;
  newCases: number | undefined;
  newDeaths: number | undefined;
  population: number | undefined;
}

interface CountrySummary {
  [country: string]: Summary;
}

function normalizeWeirdInput(weirdInput: undefined | string | number) {
  if (weirdInput === undefined) {
    return undefined;
  }
  if (typeof weirdInput === "string") {
    return undefined;
  }
  return Math.round(weirdInput);
}

export class DataStore {
  @observable visibleDate = new Date("2020-10-13");
  @observable date = new Date("2020-10-13");
  _dateTimeoutHandler?: any;

  @observable dateCount = 0;
  @observable startDate = new Date();

  @observable measures = [];
  @observable distribution = [];

  @observable.ref geoJson: any;
  @observable error?: string;

  @observable resultForSelectedDate: CountrySummary = {};
  @observable
  selectedCountry?: string = "Netherlands";

  constructor() {
    this.parseGeoJson(europeGeoJson);
    if (this.selectedCountry) {
      this.selectCountry(this.selectedCountry);
    }
    this.calculateResultForDate();
  }

  @action selectCountry(country: string) {
    this.selectedCountry = country;

    // @ts-ignore
    const d = distributionData[country];
    if (!d) {
      this.error = "No distribution data";
      return;
    }
    // @ts-ignore
    const m = measuresData[country];
    if (!m) {
      this.error = "No countermeasure data";
      return;
    }
    this.error = undefined;
  }

  @action changeDate(date: Date) {
    // current date
    this.visibleDate = date;
    this.date = date;
    this.calculateResultForDate();
    // if (this._dateTimeoutHandler) {
    //   clearTimeout(this._dateTimeoutHandler);
    // }
    // this._dateTimeoutHandler = setTimeout(() => {

    //   this.date = date;
    // }, 100);
  }

  // Should be done in etl
  @action parseGeoJson(json: any) {
    const countries = Object.keys(measuresData);
    const output: any = { type: "FeatureCollection", features: [] };

    json.features.forEach((f: any) => {
      if (!countries.includes(f.properties.NAME)) {
        return;
      }
      output.features.push(f);
    });

    this.geoJson = output;
  }

  @action calculateResultForDate() {
    const output: CountrySummary = {};
    const currentDateStr = this.date.toISOString().split("T")[0];
    map(distributionData, (val, key) => {
      const targetDatum = val.find(
        (v) => v.date === currentDateStr || v.date < currentDateStr // sorted by date desc, so get next in line if not found for current date
      );
      this.dateCount = val.length;
      this.startDate = new Date(val[val.length - 1].date);
      output[key] = {
        count: normalizeWeirdInput(targetDatum?.cum_14day_100k),
        newCases: normalizeWeirdInput(targetDatum?.cases),
        newDeaths: normalizeWeirdInput(targetDatum?.deaths),
        population: normalizeWeirdInput(targetDatum?.popData2019),
      };
    });

    this.resultForSelectedDate = output;
  }
}

export const store = new DataStore();
