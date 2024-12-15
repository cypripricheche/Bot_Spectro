from flask import Flask, send_file, jsonify, render_template_string
import mysql.connector
from mysql.connector import Error

app = Flask(__name__, static_folder=".", template_folder=".")  # Force Flask à chercher les fichiers ici

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

# Route API pour récupérer les données
@app.route('/api/clans')
def get_clans():
    """Récupère les données des clans depuis la base de données."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT clan_id, description, publication_date FROM recrutement_clans")
        clans = cursor.fetchall()
        return {"status": "success", "data": clans}
    except Exception as e:
        print(f"Erreur : {e}")
        return {"status": "error", "message": str(e)}
    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()

# Route principale pour afficher le HTML directement
@app.route('/')
def home():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT clan_id, description, publication_date FROM recrutement_clans")
    clans = cursor.fetchall()
    cursor.close()
    conn.close()

    # Lecture directe du fichier HTML pour éviter render_template()
    with open("recrutement_clans.html", "r", encoding="utf-8") as file:
        template = file.read()

    # Retourner le HTML avec les données intégrées via render_template_string
    return render_template_string(template, clans=clans)

# Routes pour CSS et JS
@app.route('/style.css')
def style():
    return send_file("style.css")

@app.route('/script.js')
def script():
    return send_file("script.js")

if __name__ == '__main__':
    app.run(debug=True)
