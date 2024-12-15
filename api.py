from flask import Flask, send_file, jsonify
import mysql.connector
from mysql.connector import Error

app = Flask(__name__)

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

# Route pour servir le fichier HTML directement
@app.route('/recrutement_clans')
def display_page():
    """Affiche directement le fichier HTML sans render_template."""
    return send_file("recrutement_clans.html")

if __name__ == '__main__':
    app.run(debug=True)
