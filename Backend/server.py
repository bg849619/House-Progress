from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse
from Utils.utils import DataHandler

import json

HOST = 'localhost'
PORT = 9980


class testHttp(BaseHTTPRequestHandler):

    handler = DataHandler()

    def do_OPTIONS(self):
        self.send_response(200, "ok")
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header("Access-Control-Allow-Headers", "X-Requested-With")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        path = urlparse(self.path).path

        if path == "/names":
            self.get_names()
        elif path == "/data":
            self.get_data()

    def get_names(self):
        # Code to get names
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(json.dumps(self.handler.get_names()).encode())

    def get_data(self):
        # Code to get data
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(json.dumps(self.handler.read_save()).encode())

    def do_POST(self):
        path = urlparse(self.path).path

        if path:
            self.add_amount()

    def add_amount(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data)

        name = data.get('name')
        date = data.get('date')
        amount = data.get('amount')

        if name and date and amount:
            self.handler.add_amount(name, amount, date)

            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "success"}).encode())

    def do_PUT(self):
        path = urlparse(self.path).path

        if path:
            self.edit_amount()

    def edit_amount(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data)

        name = data.get('name')
        date = data.get('date')
        amount = data.get('amount')

        if name and date and amount:
            if self.handler.edit_amount(name, amount, date) == 1:
                self.send_response(200)
                self.send_header("Content-type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success"}).encode())
            else:
                self.send_response(404)
                self.send_header("Content-type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "failure"}).encode())

def run():
    print(f'Server running on port {PORT}')
    server = HTTPServer((HOST, PORT), testHttp)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('Interupted by user, saving data')
        # testHttp.handler.save_data()
        print('Closing server')
        server.server_close()


if __name__ == '__main__':
    run()
