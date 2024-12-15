from        flask               import Flask, render_template, send_from_directory, jsonify
import      mysql.connector
from        mysql.connector     import Error

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
        return jsonify({"status": "success", "data": clans})
    except Exception as e:
        print(f"Erreur : {e}")
        return jsonify({"status": "error", "message": str(e)})
    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()

# Route principale pour servir la page HTML
@app.route('/')
def home():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT clan_id, description, publication_date FROM recrutement_clans")
    clans = cursor.fetchall()
    cursor.close()
    conn.close()
    return render_template('recrutement_clans.html', clans=clans)


# Routes pour les fichiers statiques (CSS et JS)
@app.route('/style.css')
def serve_css():
    return send_from_directory('.', 'style.css')

@app.route('/script.js')
def serve_js():
    return send_from_directory('.', 'script.js')

if __name__ == '__main__':
    app.run(debug=True)
