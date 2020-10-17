import csv
import json

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

if __name__ == '__main__':
  convert_measures_to_json()
