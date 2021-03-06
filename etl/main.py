import csv
import json
import sys
import xlrd
import urllib.request
from datetime import datetime

# measure_countries = ['Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czechia', 'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Iceland', 'Ireland', 'Italy', 'Latvia', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Malta', 'Netherlands', 'Norway', 'Poland', 'Portugal', 'Romania', 'Slovakia', 'Slovenia', 'Spain', 'Sweden', 'United Kingdom']
# result_countries = ['Albania', 'Andorra', 'Armenia', 'Austria', 'Azerbaijan', 'Belarus', 'Belgium', 'Bosnia and Herzegovina', 'Bulgaria', 'Croatia', 'Cyprus', 'Czechia', 'Denmark', 'Estonia', 'Faroe Islands', 'Finland', 'France', 'Georgia', 'Germany', 'Gibraltar', 'Greece', 'Guernsey', 'Holy See', 'Hungary', 'Iceland', 'Ireland', 'Isle of Man', 'Italy', 'Jersey', 'Kosovo', 'Latvia', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Malta', 'Moldova', 'Monaco', 'Montenegro', 'Netherlands', 'North Macedonia', 'Norway', 'Poland', 'Portugal', 'Romania', 'Russia', 'San Marino', 'Serbia', 'Slovakia', 'Slovenia', 'Spain', 'Sweden', 'Switzerland', 'Ukraine', 'United Kingdom']
measure_countries = []


def convert_measures_to_json(file_path='data_response_graphs_0.csv', output_file_path='../frontend/src/store/measures.json'):
  output = {}
  measures = None
  with open(file_path, 'r') as file:
    reader = csv.DictReader(file)
    measures = list(reader)

  for measure in measures:
    country = measure['Country']

    if country not in output:
      output[country] = []

    output[country].append(measure)

  with open(output_file_path, 'w') as output_file:
    json.dump(output, output_file)

  # print(output.keys())
  # measure_countries = list(output.keys())
  return output


def clean_value(val):
  if val == '':
    return None
  else:
    return int(val)


class DataStore():
  # indexed by date -> country
  date_summary = {}
  # indexed by country -> date
  country_summary = {}

  date_summary_path = '../frontend/public/world.json'
  country_summary_path = '../frontend/public/countries.json'

  meta = {}

  country_whitelist = []

  def _set(self, target_dict, keys, val):
    '''
    a = {}
    store.set(a, ['b', 'c', 'd'], 'henk)
    => a = {'b': {'c': {'d': 'henk'}}}
    '''
    last_key = keys[-1]
    d = target_dict

    for key in keys[:-1]:
      if key not in d:
        d[key] = {}
      d = d[key]

    d[last_key] = val

  def _set_array(self, target_array, val):
    if val not in target_array:
      target_array.append(val)

  def parse_case_row(self, case_row):
    date = case_row['date']
    country = case_row['country']

    if case_row['continent'] != 'Europe':
      return

    summary = {
        'biweeklyTotalPer100k': clean_value(case_row['biweeklyTotalPer100k']),
        'cases': case_row['cases'],
        'deaths': case_row['deaths'],
        'date': date,
    }

    countryPopulation100k = round(case_row['countryPopulation'] / 100000)

    self._set_array(self.country_whitelist, country)
    self._set(self.date_summary, [date, country], summary)
    self._set(self.country_summary, [country, date], summary)
    self._set(self.meta, [country, 'populationIn100k'], countryPopulation100k)

  def parse_hospital_row(self, row):
    if row['type'] != 'Daily hospital occupancy':
      return

    date = row['date']
    country = row['country']

    # We don't want total daily hospital occupancy, we want it normalized for the population
    population = self.meta[country]['populationIn100k']
    occupancy_per_100k = round(row['value'] / population, 2)

    self._set(self.date_summary, [date, country,
                                  'hospitalOccupancyPer100k'], occupancy_per_100k)
    self._set(self.country_summary, [country, date,
                                     'hospitalOccupancyPer100k'], occupancy_per_100k)

  def parse_nl_hospital_row(self, row):
    date = datetime.strptime(row['Datum'], '%d-%m-%Y').strftime('%Y-%m-%d')
    country = 'Netherlands'

    value = int(row['Kliniek_Bedden']) + int(row['IC_Bedden_COVID'])
    population = self.meta[country]['populationIn100k']
    occupancy_per_100k = round(value / population, 2)

    self._set(self.date_summary, [date, country,
                                  'hospitalOccupancyPer100k'], occupancy_per_100k)
    self._set(self.country_summary, [country, date,
                                     'hospitalOccupancyPer100k'], occupancy_per_100k)

  def write_to_file(self):
    with open(self.date_summary_path, 'w') as output_file:
      json.dump(self.date_summary, output_file)

    with open(self.country_summary_path, 'w') as output_file:
      json.dump(self.country_summary, output_file)

    return


store = DataStore()


class GeoJsonParser():
  file_path = 'input/europe.geojson'
  output_path = '../frontend/public/europe.geojson'

  def compile(self, whitelist=[]):
    output = {
        'type': 'FeatureCollection',
        'features': [],
    }
    with open(self.file_path, 'r') as file:
      data = json.load(file)

      for feature in data['features']:
        if feature['properties']['NAME'] in whitelist:
          output['features'].append(feature)

    with open(self.output_path, 'w') as output_file:
      json.dump(output, output_file)


geoJsonParser = GeoJsonParser()


class DistributionParser():
  file_path = 'input/distribution.xlsx'
  url = 'https://www.ecdc.europa.eu/sites/default/files/documents/COVID-19-geographic-disbtribution-worldwide-2020-10-30.xlsx'

  # 1.0 to 01
  # 30.0 to 30
  def float_to_date(self, date):
    return str(int(date)).zfill(2)

  def parse_row(self, input_row):
    output = {}

    if 'year' not in input_row:
      print(input_row)

    year = self.float_to_date(input_row['year'])
    month = self.float_to_date(input_row['month'])
    day = self.float_to_date(input_row['day'])

    date = f'{year}-{month}-{day}'
    output['date'] = date

    output['biweeklyTotalPer100k'] = input_row['Cumulative_number_for_14_days_of_COVID-19_cases_per_100000']
    output['country'] = input_row['countriesAndTerritories'].replace('_', ' ')
    output['cases'] = input_row['cases']
    output['deaths'] = input_row['deaths']
    output['countryPopulation'] = input_row['popData2019']
    output['continent'] = input_row['continentExp']

    return output

  def parse(self, sync=False):
    if sync:
      urllib.request.urlretrieve(self.url, self.file_path)

    with xlrd.open_workbook(self.file_path) as wb:
      sheet = wb.sheet_by_index(0)

      header = sheet.row_values(0, 1)
      for row_index in range(1, sheet.nrows):
        row = sheet.row_values(row_index, 1)
        row_dict = {a: b for a, b in zip(header, row)}

        parsed_row = self.parse_row(row_dict)

        store.parse_case_row(parsed_row)


distributionParser = DistributionParser()


class HospitalParser():
  file_path = 'input/hospital_data.csv'
  nl_file_path = 'input/hospital_nl_data.csv'

  nl_url = 'https://lcps.nu/wp-content/uploads/covid-19.csv'
  url = 'https://opendata.ecdc.europa.eu/covid19/hospitalicuadmissionrates/csv/data.csv'

  def _parse_row(self, input_row):
    output = {}

    val = input_row['value'] or '0'
    output['country'] = input_row['\ufeffcountry']  # idk
    output['date'] = input_row['date']

    output['value'] = float(val) if '.' in val else int(val)
    output['type'] = input_row['indicator']

    return output

  def parse(self, sync=False):
    self.parse_dutch(sync=sync)

    if sync:
      urllib.request.urlretrieve(self.url, self.file_path)

    with open(self.file_path, 'r') as file:
      reader = csv.DictReader(file)
      rows = list(reader)

    for row in rows:
      normalized_row = self._parse_row(row)
      store.parse_hospital_row(normalized_row)

  def parse_dutch(self, sync=False):
    if sync:
      urllib.request.urlretrieve(self.nl_url, self.nl_file_path)

    with open(self.nl_file_path, 'r') as file:
      reader = csv.DictReader(file)
      rows = list(reader)

    for row in rows:
      store.parse_nl_hospital_row(row)


hospitalParser = HospitalParser()


if __name__ == '__main__':
  sync = '--sync' in sys.argv
  distributionParser.parse(sync=sync)
  hospitalParser.parse(sync=sync)
  geoJsonParser.compile(whitelist=store.country_whitelist)
  store.write_to_file()

  # measures = convert_measures_to_json()
  # countries_with_measures = list(measures.keys())
  # results = parse_cases()
  # hospital = parse_hospital_data()
  # list_diff(countries_with_measures, result_countries)
