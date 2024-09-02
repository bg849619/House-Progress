import pickle
import os

class DataHandler:
    def __init__(self, filepath="Saves/data.pkl"):
        self.filepath = filepath
        self.data = self.load_data()

    def load_data(self):
        if os.path.exists(self.filepath):
            with open(self.filepath, "rb") as f:
                return pickle.load(f)
        else:
            return {}

    def save_data(self):
        with open(self.filepath, "wb") as f:
            pickle.dump(self.data, f, pickle.HIGHEST_PROTOCOL)

    def read_save(self):
        transformed_data = []
        for date, records in self.data.items():
            record = {"date": date}
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