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

def parse_datum(datum):
  output = datum

  if 'year' not in datum:
    print(datum)

  year = int(datum['year'])
  month = int(datum['month'])
  day = int(datum['day'])

  date = f'{year}-{month}-{day}'
  del output['year']
  del output['month']
  del output['day']
  output['date'] = date

  output['cum_14day_100k'] = datum['Cumulative_number_for_14_days_of_COVID-19_cases_per_100000']
  del output['Cumulative_number_for_14_days_of_COVID-19_cases_per_100000']

  return output

def parse_corona_results(file_path='COVID-19-geographic-disbtribution-worldwide-2020-10-13.xlsx', output_file_path='../frontend/src/store/distribution.json', country_whitelist=None):
  output = {}
  data = None

  with xlrd.open_workbook(file_path) as wb:
    sheet = wb.sheet_by_index(0)

    header = sheet.row_values(0, 1)
    for row_index in range(1, sheet.nrows):
      row = sheet.row_values(row_index, 1)
      datum = {a : b for a, b in zip(header, row)}

      country = datum['countriesAndTerritories'].replace('_', ' ')
      if country_whitelist is not None:
        if country not in country_whitelist:
          continue

      if country not in output:
        output[country] = []

      d = parse_datum(datum)

      output[country].append(d)

  with open(output_file_path, 'w') as output_file:
    json.dump(output, output_file)

  return output

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
  measures = convert_measures_to_json()
  countries_with_measures = list(measures.keys())
  results = parse_corona_results(country_whitelist=countries_with_measures)
  # list_diff(countries_with_measures, result_countries)
