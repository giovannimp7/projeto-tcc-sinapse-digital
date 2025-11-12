import os
import re
import traceback
from flask import Flask, jsonify, request
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv
import psycopg2

# Carrega .env
load_dotenv()
app = Flask(__name__)
CORS(app)

# Lê API key e configura GenAI
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    print("Erro: variável de ambiente GOOGLE_API_KEY não encontrada. Verifique seu .env")
    exit(1)

try:
    genai.configure(api_key=GOOGLE_API_KEY)
    print("API do Gemini configurada com sucesso.")
except Exception:
    print("Erro ao configurar o GenAI SDK:")
    traceback.print_exc()
    exit(1)

# Modelo padrão (use sempre o ID que comece com 'models/')
MODEL_ID = os.getenv("MODEL", "models/gemini-2.5-flash")


def get_db_connection():
    conn = psycopg2.connect(
        dbname=os.environ['DB_NAME'], user=os.environ['DB_USER'],
        password=os.environ['DB_PASSWORD'], host=os.environ['DB_HOST'],
        port=os.environ['DB_PORT']
    )
    return conn


def format_response_into_paragraphs(text: str, sentences_per_paragraph: int = 2) -> str:
    """
    If the model returned a blob of text with no paragraph breaks,
    try to split it into readable paragraphs.

    Strategy:
    - If text already contains double newlines, return as-is.
    - Otherwise split into sentences (roughly) using punctuation (.!?)
      and join groups of `sentences_per_paragraph` sentences with double newlines.
    - This is a heuristic to improve readability for compact responses.
    """
    if not text:
        return text

    # If the text already has meaningful paragraphs, keep it
    if "\n\n" in text or text.count("\n") > 3:
        return text.strip()

    # Normalize whitespace
    text = text.strip().replace("\r\n", "\n").replace("\r", "\n")
    # Protect common abbreviations (basic list) to avoid splitting inside them
    # (This is a small heuristic; can be expanded if needed)
    abbreviations = [
        "Sr.", "Sra.", "Dr.", "Dra.", "Srta.", "etc.", "e.g.", "i.e.", "vs.", "Prof."
    ]
    placeholder_map = {}
    for i, abbr in enumerate(abbreviations):
        key = f"@@ABBR{i}@@"
        placeholder_map[key] = abbr
        text = text.replace(abbr, key)

    # Split into sentences by punctuation followed by space
    parts = re.split(r'(?<=[\.\?\!])\s+', text)
    # Restore abbreviations
    parts = [p.replace(k, v) for p in parts for k, v in placeholder_map.items()] if placeholder_map else parts

    # If splitting produced only one chunk, fallback to naive splitting on commas (less ideal)
    if len(parts) == 1:
        parts = re.split(r',\s+', text)

    # Group sentences into paragraphs
    paras = []
    for i in range(0, len(parts), sentences_per_paragraph):
        para = " ".join(s.strip() for s in parts[i:i + sentences_per_paragraph] if s.strip())
        if para:
            paras.append(para)

    formatted = "\n\n".join(paras).strip()

    # Final cleanup: restore any placeholders that might remain
    for k, v in placeholder_map.items():
        formatted = formatted.replace(k, v)

    return formatted if formatted else text


@app.route('/api/submit', methods=['POST'])
def submit_results():
    data = request.get_json(silent=True) or {}
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

    except Exception:
        print("ERRO AO SALVAR NO BANCO DE DADOS:")
        traceback.print_exc()
        return jsonify({"status": "erro", "message": "Falha ao salvar os resultados."}), 500


@app.route('/api/models', methods=['GET'])
def list_models():
    """Rota de debug para listar modelos disponíveis para a chave atual."""
    try:
        models = genai.list_models()
        model_names = [m.name for m in models]
        return jsonify({"status": "sucesso", "models": model_names})
    except Exception:
        print("Falha ao listar modelos:")
        traceback.print_exc()
        return jsonify({"status": "erro", "message": "Não foi possível listar modelos."}), 500


@app.route('/api/chat', methods=['POST'])
def chat_with_gemini():
    payload = request.get_json(silent=True) or {}
    user_message = payload.get('message')
    if not user_message:
        return jsonify({"status": "erro", "message": "Nenhuma mensagem recebida."}), 400

    print(f"--- Mensagem do Usuário Recebida: '{user_message}' ---")

    # Improved prompt: ask the model explicitly to return well-formatted paragraphs.
    # This helps the model obey a formatting preference, reducing the need for heavy post-processing.
    prompt = f"""
Aja como uma assistente de acolhimento chamada 'Serena'. Sua personalidade é calma, sábia, e direta. Sua missão é oferecer um espaço seguro para reflexão.

INSTRUÇÕES DE FORMATAÇÃO (IMPORTANTE):
- Responda em **parágrafos claros**, separando cada parágrafo com uma linha em branco (duas quebras de linha).
- Cada parágrafo deve conter no máximo 2-3 frases para facilitar a leitura.
- Não forneça listas longas sem quebras; prefira parágrafos curtos.
- Evite usar formatação Markdown complexa — texto simples com quebras de parágrafo é suficiente.
- Se for necessário direcionar para ajuda profissional, inclua claramente o telefone 188 e o site www.cvv.org.br em um parágrafo separado.

REGRAS CRÍTICAS:
1. NÃO DÊ DIAGNÓSTICOS: Jamais diga que o usuário "tem" qualquer transtorno.
2. NÃO PRESCREVA TRATAMENTOS: Não sugira medicamentos.
3. FOCO EM ACOLHIMENTO REFLEXIVO: Valide sentimentos e ofereça perspectivas que incentivem introspecção.
4. INCENTIVE A AJUDA PROFISSIONAL: Ao final, incentive buscar um profissional qualificado quando apropriado.
5. SEGURANÇA PRIMEIRO: Se houver risco de vida, direcione para o CVV (188, www.cvv.org.br).
6. SEJA DIRETA: Se a mensagem for confusa, responda apenas: "Não compreendi sua mensagem. Poderia reformular?"

Contexto: O usuário enviou a seguinte mensagem:
\"\"\"{user_message}\"\"\"

Sua resposta (como Serena):
"""

    try:
        print("--- Enviando para o Gemini... ---")
        model = genai.GenerativeModel(MODEL_ID)
        response = model.generate_content(prompt)

        # O SDK pode devolver diferentes estruturas dependendo da versão.
        ai_response = getattr(response, "text", None)
        if ai_response is None:
            # tenta caminhos alternativos
            try:
                ai_response = response.output[0].content[0].text
            except Exception:
                ai_response = str(response)

        # Trim and basic cleanup
        ai_response = ai_response.strip() if isinstance(ai_response, str) else str(ai_response)

        # Formatação adicional (heurística)
        formatted = format_response_into_paragraphs(ai_response, sentences_per_paragraph=2)

        print(f"--- Resposta (formatada) da IA: '''\\n{formatted}\\n''' ---")
        return jsonify({"status": "sucesso", "resposta_ia": formatted})

    except Exception:
        print("ERRO AO COMUNICAR COM A IA:")
        traceback.print_exc()
        return jsonify({"status": "erro", "message": "Não foi possível processar a sua mensagem com a IA."}), 500


if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    host = os.getenv('HOST', '0.0.0.0')
    print(f"Starting app on {host}:{port} — MODEL_ID={MODEL_ID}")
    app.run(host=host, port=port, debug=True)
