import csv
import json
import xlrd

# measure_countries = ['Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czechia', 'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Iceland', 'Ireland', 'Italy', 'Latvia', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Malta', 'Netherlands', 'Norway', 'Poland', 'Portugal', 'Romania', 'Slovakia', 'Slovenia', 'Spain', 'Sweden', 'United Kingdom']
# result_countries = ['Albania', 'Andorra', 'Armenia', 'Austria', 'Azerbaijan', 'Belarus', 'Belgium', 'Bosnia_and_Herzegovina', 'Bulgaria', 'Croatia', 'Cyprus', 'Czechia', 'Denmark', 'Estonia', 'Faroe_Islands', 'Finland', 'France', 'Georgia', 'Germany', 'Gibraltar', 'Greece', 'Guernsey', 'Holy_See', 'Hungary', 'Iceland', 'Ireland', 'Isle_of_Man', 'Italy', 'Jersey', 'Kosovo', 'Latvia', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Malta', 'Moldova', 'Monaco', 'Montenegro', 'Netherlands', 'North_Macedonia', 'Norway', 'Poland', 'Portugal', 'Romania', 'Russia', 'San_Marino', 'Serbia', 'Slovakia', 'Slovenia', 'Spain', 'Sweden', 'Switzerland', 'Ukraine', 'United_Kingdom']

def convert_measures_to_json(file_path='data_response_graphs_0.csv', output_file_path='measures.json'):
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


def parse_corona_results(file_path='COVID-19-geographic-disbtribution-worldwide-2020-10-13.xlsx'):
  output = []
  data = None

  with xlrd.open_workbook(file_path) as wb:
    sheet = wb.sheet_by_index(0)

    header = sheet.row_values(0, 1)
    for row_index in range(1, sheet.nrows):
      row = sheet.row_values(row_index, 1)
      datum = {a : b for a, b in zip(header, row)}

      if datum['continentExp'] == 'Europe':
        country = datum['countriesAndTerritories'].replace('_', ' ')
        if country not in output:
          output.append(country)

  return output

  # print(output)
  # result_countries = output

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
  result_countries = parse_corona_results()
  list_diff(measures, result_countries)