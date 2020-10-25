import csv
import json
import xlrd

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


class DataStore():
  # indexed by date -> country
  date_summary = {}
  # indexed by country -> date
  country_summary = {}

  date_summary_path = '../frontend/public/world.json'
  country_summary_path = '../frontend/public/countries.json'

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
        'biweeklyTotalPer100k': case_row['biweeklyTotalPer100k'],
        'cases': case_row['cases'],
        'deaths': case_row['deaths']
    }

    self._set_array(self.country_whitelist, country)
    self._set(self.date_summary, [date, country], summary)
    self._set(self.country_summary, [country, date], summary)

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
  file_path = 'COVID-19-geographic-disbtribution-worldwide-2020-10-20.xlsx'

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
    output['continent'] = input_row['continentExp']

    return output

  def parse(self):
    with xlrd.open_workbook(self.file_path) as wb:
      sheet = wb.sheet_by_index(0)

      header = sheet.row_values(0, 1)
      for row_index in range(1, sheet.nrows):
        row = sheet.row_values(row_index, 1)
        row_dict = {a: b for a, b in zip(header, row)}

        parsed_row = self.parse_row(row_dict)

        store.parse_case_row(parsed_row)

        # country = row_dict['countriesAndTerritories'].replace('_', ' ')
        # if country_whitelist is not None:
        #   if country not in country_whitelist:
        #     continue
        # else:
        #   if row_dict['continentExp'] != 'Europe':
        #     continue

        # output[country].append(d)


distributionParser = DistributionParser()


def parse_hospital_data(file_path='hospital_data.csv'):
  hosp = None
  with open(file_path, 'r') as file:
    reader = csv.DictReader(file)
    hosp = list(reader)

  print(hosp[0])

  # for measure in hosp:
  #   country = measure['Country']

  #   if country not in output:
  #     output[country] = []

  #   output[country].append(measure)


def list_diff(list_a, list_b):
  set_a = set(list_a)
  set_b = set(list_b)

  print('only in a')
  print(set_a - set_b)

  print('in both')
  print(set_a.intersection(set_b))

  print('only in b')
  print(set_b - set_a)


if __name__ == '__main__':
  distributionParser.parse()
  geoJsonParser.compile(whitelist=store.country_whitelist)
  store.write_to_file()
  # measures = convert_measures_to_json()
  # countries_with_measures = list(measures.keys())
  # results = parse_cases()
  # hospital = parse_hospital_data()
  # list_diff(countries_with_measures, result_countries)
