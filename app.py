import requests
from flask import Flask, request, redirect, render_template, session


app = Flask(__name__) 

@app.route('/')
def index():
    signed_in= False
    return render_template('index.html', )
    

if __name__ == "__main__":
    app.run(debug=True)
