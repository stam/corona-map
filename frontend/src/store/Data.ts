import { observable, action } from "mobx";
import { map } from "lodash";

import distributionData from "./distribution.json";
import measuresData from "./measures.json";
import europeGeoJson from "./europe.json";

interface Summary {
  count: number | undefined;
}

interface CountrySummary {
  [country: string]: Summary;
}

export class DataStore {
  @observable date = new Date("2020-10-13");

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
      output[key] = {
        count:
          targetDatum?.cum_14day_100k !== undefined
            ? (targetDatum?.cum_14day_100k as number)
            : undefined,
      };
    });

    this.resultForSelectedDate = output;
  }
}

export const store = new DataStore();
