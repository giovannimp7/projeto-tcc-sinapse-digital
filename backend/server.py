import os
from flask import Flask, jsonify, request
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv
import psycopg2

load_dotenv()
app = Flask(__name__)
CORS(app)

try:
    genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
    print("API do Gemini configurada com sucesso.")
except (AttributeError, KeyError) as e:
    print("Erro: A chave de API do Google não foi encontrada. Verifique seu arquivo .env")
    exit()

def get_db_connection():
    conn = psycopg2.connect(
        dbname=os.environ['DB_NAME'], user=os.environ['DB_USER'],
        password=os.environ['DB_PASSWORD'], host=os.environ['DB_HOST'],
        port=os.environ['DB_PORT']
    )
    return conn


@app.route('/api/submit', methods=['POST'])
def submit_results():
    data = request.get_json()
    print("--- Dados Completos Recebidos do Front-End ---")
    print(data)
    
    try:
        scores = data.get('scores', {})
        levels = data.get('levels', {})
        
        score_depressao = scores.get('depressao')
        score_ansiedade = scores.get('ansiedade')
        level_depressao = levels.get('depression')
        level_ansiedade = levels.get('anxiety')

        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute(
            """INSERT INTO results 
               (depression_score, anxiety_score, depression_level, anxiety_level) 
               VALUES (%s, %s, %s, %s)""",
            (score_depressao, score_ansiedade, level_depressao, level_ansiedade)
        )

        conn.commit()
        cur.close()
        conn.close()
        
        print("--- Dados salvos no banco de dados com sucesso! ---")
        return jsonify({"status": "sucesso", "message": "Scores e níveis recebidos e salvos!"})

    except Exception as e:
        print(f"ERRO AO SALVAR NO BANCO DE DADOS: {e}")
        return jsonify({"status": "erro", "message": "Falha ao salvar os resultados."}), 500


@app.route('/api/chat', methods=['POST'])
def chat_with_gemini():
    user_message = request.get_json().get('message')
    if not user_message:
        return jsonify({"status": "erro", "message": "Nenhuma mensagem recebida."}), 400

    print(f"\n--- Mensagem do Usuário Recebida: '{user_message}' ---")
    prompt = f"""
    Aja como uma assistente de acolhimento chamada 'Serena'. Sua personalidade é calma, sábia, e direta. Sua missão é oferecer um espaço seguro para reflexão.
    **REGRAS CRÍTICAS:**
    1.  **NÃO DÊ DIAGNÓSTICOS:** Jamais diga que o usuário "tem" qualquer transtorno.
    2.  **NÃO PRESCREVA TRATAMENTOS:** Não sugira medicamentos.
    3.  **FOCO EM ACOLHIMENTO REFLEXIVO:** Valide os sentimentos do usuário (ex: "É compreensível que se sinta assim.") e ofereça perspectivas que incentivem a introspecção.
    4.  **INCENTIVE A AJUDA PROFISSIONAL:** Sua principal diretriz é sempre, ao final da conversa ou quando apropriado, incentivar gentilmente o usuário a procurar um profissional qualificado (psicólogo, terapeuta) para uma jornada de autoconhecimento mais profunda.
    5.  **SEGURANÇA PRIMEIRO:** Se a conversa indicar qualquer risco de vida, sua única resposta DEVE SER direcionar para o CVV (Centro de Valorização da Vida) no Brasil, informando o telefone 188 e o site www.cvv.org.br, e reforçar a busca por ajuda profissional imediata.
    6.  **SEJA DIRETA:** Se a mensagem do usuário for confusa, vaga ou sem sentido (ex: "bla bla bla"), responda apenas: "Não compreendi sua mensagem. Poderia reformular?" Não tente interpretar ou acolher mensagens sem sentido.
    **Contexto:** O usuário enviou a seguinte mensagem: "{user_message}"
    **Sua Resposta (como Serena):**
    """
    try:
        print("--- Enviando para o Gemini... ---")
        model = genai.GenerativeModel('gemini-1.5-flash-latest')
        response = model.generate_content(prompt)
        ai_response = response.text
        print(f"--- Resposta da IA: '{ai_response}' ---")
        return jsonify({"status": "sucesso", "resposta_ia": ai_response})
    except Exception as e:
        print(f"ERRO AO COMUNICAR COM A IA: {e}")
        return jsonify({"status": "erro", "message": "Não foi possível processar a sua mensagem com a IA."}), 500


if __name__ == '__main__':
    app.run(debug=True)