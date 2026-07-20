"""
Fase 2 (parte 2): El agente que responde preguntas sobre los documentos.
"""
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_classic.chains import create_retrieval_chain
from langchain_classic.chains.combine_documents import create_stuff_documents_chain

load_dotenv()

MODELO_LLM = "gemini-3.1-flash-lite"

SYSTEM_PROMPT = (
    "Eres el asistente virtual de soporte de BimBam Buy, un e-commerce. "
    "Respondé la pregunta del cliente basándote ÚNICAMENTE en el siguiente contexto recuperado "
    "de nuestros documentos internos (políticas de reembolsos, envíos, pagos, garantía y afiliados).\n\n"
    "Reglas:\n"
    "- Si la respuesta no está en el contexto, decí explícitamente que no tenés esa información "
    "y sugerí contactar a soporte. No inventes datos.\n"
    "- Sé conciso y claro, en un tono amable y profesional.\n"
    "- Si la pregunta abarca más de un tema (por ejemplo, envío y pago), respondé ambas partes.\n"
    "- No menciones que estás usando un 'contexto' o 'documentos'; respondé como si supieras la información.\n\n"
    "Contexto:\n{context}"
)


def construir_agente(vectorstore):
    """Arma la cadena RAG: retriever + prompt + LLM."""
    llm = ChatGoogleGenerativeAI(model=MODELO_LLM, temperature=0, max_tokens=1000)
    retriever = vectorstore.as_retriever(search_kwargs={"k": 4})

    prompt = ChatPromptTemplate.from_messages([
        ("system", SYSTEM_PROMPT),
        ("human", "{input}"),
    ])

    question_answer_chain = create_stuff_documents_chain(llm, prompt)
    return create_retrieval_chain(retriever, question_answer_chain)


def preguntar(agente, pregunta: str):
    """Consulta al agente y muestra la respuesta junto con los documentos fuente."""
    print("🔄 Buscando en la base de datos vectorial y generando respuesta con Gemini...")
    resultado = agente.invoke({"input": pregunta})

    print("\n🤖 RESPUESTA DE GEMINI:")
    print(resultado["answer"])
    print("-----------------")
    """
    print("\n📄 DOCUMENTOS DE ORIGEN (CONTEXTO RECUPERADO):")
    for i, doc in enumerate(resultado["context"], 1):
        print(f"\n--- Documento {i} ---")
        print(f"Contenido: {doc.page_content}")
        print(f"Metadatos: {doc.metadata}")
    """
    return resultado["answer"]



if __name__ == "__main__":
    from vectorstore import cargar_vectorstore

    vectorstore = cargar_vectorstore()
    agente = construir_agente(vectorstore)

    print("Agente listo. Escribí tu pregunta (o 'salir' para terminar).\n")
    while True:
        pregunta = input("Vos: ")
        if pregunta.lower() in ("salir", "exit", "quit"):
            break
        preguntar(agente, pregunta)
