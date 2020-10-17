import csv
import json
import xlrd

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

  print(output.keys())

def parse_corona_results(file_path='COVID-19-geographic-disbtribution-worldwide-2020-10-13.xlsx'):
  output = []
  data = None

  with xlrd.open_workbook(file_path) as wb:
    sheet = wb.sheet_by_index(0)

    header = sheet.row_values(0, 1)
    # for row_index in range(1, sheet.nrows):
    row = sheet.row_values(1, 1)
    datum = {a : b for a, b in zip(header, row)}




    # for rownum in range(sheet.nrows):
    #     wr.writerow(sheet.row_values(rownum))

  # with open(file_path, 'r') as file:
  #   reader = csv.DictReader(file, dialect='excel')
  #   data = list(reader)

  # for datum in data:
  #   print(datum)
  #   if datum['continent'] == 'Europe':
  #     country = datum['countriesAndTerritories']
  #     if country not in output:
  #       output.append(country)

    print(output)


if __name__ == '__main__':
  # convert_measures_to_json()
  parse_corona_results()
