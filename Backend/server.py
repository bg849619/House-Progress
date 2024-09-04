from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
from Utils.utils import DataHandler
import time
from threading import Thread, Event

import json

HOST = '0.0.0.0'
PORT = 9980


class testHttp(BaseHTTPRequestHandler):

    handler = DataHandler()

    def do_OPTIONS(self):
        self.send_response(200, 'ok')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'X-Requested-With')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        path = urlparse(self.path).path

        if path == '/names':
            self.get_names()
        elif path == '/data':
            self.get_data()

    def get_names(self):
        # Code to get names
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(self.handler.get_names()).encode())

    def get_data(self):
        # Code to get data
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
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
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'status': 'success'}).encode())

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
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'status': 'success'}).encode())
            else:
                self.send_response(404)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'status': 'failure'}).encode())

    def do_DELETE(self):
        query_components = parse_qs(urlparse(self.path).query)
        
        # Extract the 'name' parameter
        name = query_components.get('name', [None])[0]

        if name:
            self.delete_name(name)

    def delete_name(self, name: str):
        self.handler.delete_name(name)

        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps({'status': 'success'}).encode())

def run():
    stop_event = Event() 
    server = HTTPServer((HOST, PORT), testHttp)

    def save_periodically(minutes: int = 30):
        while not stop_event.is_set():
            # Wait for either stop_event to be set or for the timeout
            stop_event.wait(timeout=minutes*60)
            if not stop_event.is_set():  # Only save if stop_event hasn't been set during the wait
                print('Saving data...')
                testHttp.handler.save_data('Saves/data.pkl')
                print('Data saved.')

    save_thread = Thread(target=save_periodically, args=(10,))
    save_thread.start()

    print(f'Server running on port {PORT}')

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('Interupted by user, saving data')
        testHttp.handler.save_data('Saves/data.pkl')
        print('Closing server')
    finally:
        stop_event.set()
        save_thread.join()
        server.server_close()

if __name__ == '__main__':
    run()
