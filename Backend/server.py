from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse
from Utils.utils import *

import json

HOST = 'localhost'
PORT = 9980

class testHttp(BaseHTTPRequestHandler):

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
        self.wfile.write(json.dumps(get_names()).encode())

    def get_data(self):
        # Code to get data
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(json.dumps(read_save()).encode())

def run():
    print(f'Server running on port {PORT}')
    server = HTTPServer((HOST, PORT), testHttp)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.server_close()


if __name__ == '__main__':
    run()
