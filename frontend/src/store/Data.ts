import { observable, action } from "mobx";
import distributionData from "./distribution.json";
import measuresData from "./measures.json";

export class DataStore {
  @observable date = new Date("2020-10-13");

  @observable measures = [];
  @observable distribution = [];
  @observable error?: string;
  @observable selectedCountry?: string = "Netherlands";

  constructor() {
    if (this.selectedCountry) {
      this.selectCountry(this.selectedCountry);
    }
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
}
