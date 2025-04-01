from flask import Flask, send_file, send_from_directory, render_template_string, jsonify
import mysql.connector
from mysql.connector import Error
from flask import abort, Flask, send_from_directory

app = Flask(__name__, static_folder=".", template_folder=".")

# Route pour ads.txt
@app.route('/ads.txt')
def ads_txt():
    return send_from_directory('.', 'ads.txt')


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

# ===== ROUTES POUR LES PAGES =====
@app.route('/')
@app.route('/index.html')
def home():
    """Page d'accueil."""
    return send_file("index.html")

@app.route('/recrutement_clans.html')
def recrutement_clans():
    """Page de recrutement avec données de la base."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT clan_id, clan_name, description, publication_date, clan_url_blason, serveur_id, membre_clan FROM recrutement_clans")
        clans = cursor.fetchall()
        cursor.close()
        conn.close()

        # Lire le template HTML
        with open("recrutement_clans.html", "r", encoding="utf-8") as file:
            template = file.read()

        return render_template_string(template, clans=clans)
    except Exception as e:
        return f"Erreur lors de la récupération des données : {str(e)}"

@app.route('/clashofclan.html')
def clashofclan():
    """Page Clash of Clans."""
    return send_file("clashofclan.html")

@app.route('/discord.html')
def discord():
    """Page Discord."""
    return send_file("discord.html")

@app.route('/premium.html')
def premium():
    """Page Premium."""
    return send_file("premium.html")

# ===== ROUTES POUR LES FICHIERS STATIQUES =====
@app.route('/style.css')
def style():
    """Fichier CSS."""
    return send_file("style.css")

@app.route('/script.js')
def script():
    """Fichier JavaScript."""
    return send_file("script.js")

# ===== ROUTES POUR LES IMAGES =====
@app.route('/<path:filename>')
def static_files(filename):
    """Servir les images statiques et autres fichiers."""
    try:
        return send_from_directory('.', filename)
    except Exception as e:
        print(f"Erreur lors de l'accès au fichier : {filename}, {str(e)}")
        abort(404)  # Retourne une erreur 404 si le fichier est introuvable


# ===== ROUTE API =====
@app.route('/api/clans')
def get_clans():
    """Récupération des données des clans via l'API."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT clan_id, clan_name, description, publication_date, clan_url_blason, serveur_id, membre_clan FROM recrutement_clans")
        clans = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify({"status": "success", "data": clans})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

if __name__ == '__main__':
    app.run(debug=True)
