import csv

def read_save(path):
    data_dict = {}
    with open(path, 'r') as f:
        reader = csv.DictReader(f)

        for row in reader:
            name = row['Name']

            if name in data_dict:
                data_dict[name].append({"Amount": float(row['Amount']),"Date":  row['Date']})
            else:
                data_dict[name] = [{"Amount": float(row['Amount']),"Date":  row['Date']}]

    return data_dict

def get_names(path):
    names = set()
    with open(path, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            names.add(row['Name'])
    return list(names)