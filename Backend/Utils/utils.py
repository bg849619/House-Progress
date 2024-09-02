import pickle
import os
from datetime import datetime


class DataHandler:
    def __init__(self, filepath='Saves/data.pkl'):
        self.data = self.load_data(filepath)

    def load_data(self, filepath):
        if os.path.exists(filepath):
            with open(filepath, 'rb') as f:
                return pickle.load(f)
        else:
            return {}

    def save_data(self, filepath):
        self.data = { #sorts data based on date
            date: self.data[date]
            for date in sorted(self.data, key=lambda x: datetime.strptime(x, "%m/%d/%Y"))
        }
        
        with open(filepath, 'wb') as f:
            pickle.dump(self.data, f, pickle.HIGHEST_PROTOCOL)

    def read_save(self):
        transformed_data = []
        for date, records in self.data.items():
            record = {'date': date}
            record.update(sorted(records.items()))
            transformed_data.append(record)
        return transformed_data

    def get_names(self):
        names = set()
        for records in self.data.values():
            for name in records:
                names.add(name)
        return list(sorted(names))

    def add_amount(self, name: str, amount: int, date: str):
        if date in self.data:
            self.data[date].update({name: amount})
        else:
            self.data[date] = {name: amount}

        self.data = { #sorts data based on date
            date: self.data[date]
            for date in sorted(self.data, key=lambda x: datetime.strptime(x, "%m/%d/%Y"))
        }

    def edit_amount(self, name: str, amount: int, date: str):
        if date in self.data and name in self.data[date]:
            self.data[date][name] = amount
            return 1
        else:
            return -1

    def delete_name(self, name: str):
        next_backup = self.find_next_backup('Saves/backup.pkl')
        self.save_data(next_backup)  # Makes backup before deleting
        for entry in self.data.values():
            if name in entry:
                del entry[name]

    def find_next_backup(self, filepath):
        current_filepath = filepath
        index = 1
        while os.path.exists(current_filepath):
            path, extension = filepath.split('.')
            current_filepath = f'{path}{index}.{extension}'
            index += 1

        return current_filepath
