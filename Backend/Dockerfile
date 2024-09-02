FROM python:3.12

WORKDIR /app

COPY . .

EXPOSE 9980

RUN pip install -r requirements.txt

CMD [ "python", "server.py" ]