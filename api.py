from flask import Flask, send_file, jsonify, render_template_string
import mysql.connector
from mysql.connector import Error

app = Flask(__name__, static_folder=".", template_folder=".")

# Configuration de la base de données
db_config = {
    "host": "mysql-spectro.alwaysdata.net",
    "user": "spectro",
    "password": "C03012003c",
    "database": "spectro_base",
}

def get_db_connection():
    """Retourne une connexion à la base de données."""
    try:
        conn = mysql.connector.connect(**db_config)
        return conn
    except Error as e:
        print(f"Erreur de connexion : {e}")
        return None

# Route pour la page d'accueil
@app.route('/')
@app.route('/index.html')
def home():
    return send_file("index.html")

# Route pour la page recrutement_clans
@app.route('/recrutement_clans.html')
def recrutement_clans():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT clan_id, description, publication_date FROM recrutement_clans")
    clans = cursor.fetchall()
    cursor.close()
    conn.close()

    with open("recrutement_clans.html", "r", encoding="utf-8") as file:
        template = file.read()

    return render_template_string(template, clans=clans)

# Routes pour les autres pages statiques
@app.route('/clashofclan.html')
def clashofclan():
    return send_file("clashofclan.html")

@app.route('/discord.html')
def discord():
    return send_file("discord.html")

@app.route('/premium.html')
def premium():
    return send_file("premium.html")

# Routes pour CSS et JS
@app.route('/style.css')
def style():
    return send_file("style.css")

@app.route('/script.js')
def script():
    return send_file("script.js")

if __name__ == '__main__':
    app.run(debug=True)
