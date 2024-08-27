from Saves.what import data

def read_save():
    transformed_data = []
    for date, records in data.items():
        record = {"date": date}
        record.update(sorted(records.items()))
        transformed_data.append(record)

    return transformed_data

def get_names():
    names = set()

    for records in data.values():
        for name in records:
            names.add(name)
    return list(names)

def add_amount(name: str, amount: int, date: str):
    if data[date]:
        data[date].update({name:amount})
    else:
        data[date] = { name:amount}
