# Presentando el desafío final

Si llegamos hasta aquí, significa que estamos preparades para el momento más importante de nuestro recorrido en conjunto. Hoy vamos a presentar nuestro challenge (desafío) final, el **Alura Agente**. Es el desafío práctico que reúne todo lo que aprendimos hasta ahora en un proyecto real.

Imaginemos el siguiente escenario: fuimos contratades por una empresa —puede ser una fintech (tecnología financiera), una consultora o una startup (empresa emergente)— que tiene grandes volúmenes de documentos internos: manuales, informes, políticas y hojas de cálculo. El problema es que las personas pierden horas buscando información dentro de sus archivos. La solución que se requiere es un agente de inteligencia artificial que cualquier persona colaboradora pueda usar para hacer preguntas y recibir respuestas directas en lenguaje natural, sin necesidad de abrir ningún documento. Eso no es ciencia ficción; es lo que los equipos de tecnología ya están construyendo hoy en empresas reales en todo el mundo. Y es exactamente lo que aprenderemos a hacer aquí.

## Explicando las tres etapas del proyecto

El desafío tiene tres partes principales. Expliquemos cada una:

1. **Lectura y procesamiento:** Primero, elegiremos un documento —puede ser un PDF o un CSV— y crearemos código que lea y procese ese archivo. Es decir, nuestra aplicación entenderá el contenido que hay dentro del documento. Ese documento puede tratar sobre políticas internas de la empresa, datos de ventas de productos o documentación sobre las herramientas y tecnologías que la empresa utiliza. También pondremos a disposición un documento de sugerencia, pero podremos utilizar los documentos que queramos y personalizar nuestro agente, porque este proyecto es nuestro.
2. **Construcción del Agente:** En segundo lugar, construiremos un agente de IA que pueda responder preguntas sobre ese documento. Alguien podría escribir, por ejemplo: “¿Cuál fue el producto más vendido en diciembre de 2015?” o “¿Qué lenguajes de programación se usan en el back-end (parte del servidor) de la plataforma de ventas de la empresa?”. El agente encuentra la respuesta en el documento y la devuelve de forma clara. Así de simple.
3. **Deploy (Implementación):** En tercer lugar, y aquí está el gran diferencial, vamos a hacer el deploy de ese agente en la nube de Oracle (OCI). Eso significa que nuestra aplicación saldrá de nuestra computadora y estará accesible públicamente, ejecutándose de verdad en la nube.

*Tres etapas: un proyecto completo, del documento al deploy (implementación).*

## Describiendo tecnologías y entregables

Ahora, hablemos de las tecnologías. No hace falta alarmarnos por la lista. Sugerimos:
* **Python** para escribir el código.
* **LangChain** para montar el agente.
* **PyPDF o Pandas** para leer los documentos.
* Un **modelo de lenguaje** que puede ser Gemma, ChatGPT, Cohere u otro, para hacer que la magia suceda. 
* Para el deploy (implementación), la sugerencia es **OCI Compute**, pero estas son sugerencias, no obligaciones. Si contamos con una herramienta que conocemos mejor y que tenga más sentido para nuestro proyecto, podemos usarla. El proyecto, como dijimos, es de quien lo crea. Lo importante es que la solución que presentemos funcione.

Hablemos entonces de lo que necesitamos entregar. Debemos publicar el código en **GitHub**, con:
* Un repositorio organizado.
* Un historial de commits (confirmaciones).
* Un **README** bien elaborado, con:
  * Una descripción de la arquitectura que montamos.
  * Ejemplos de preguntas y respuestas que el agente puede resolver.
  * Instrucciones para quien quiera ejecutar el proyecto.
* Un enlace o una captura de pantalla de la aplicación corriendo en OCI, para comprobar que el deploy (implementación) realmente funcionó.

## Detallando validación y consejos finales

Para la validación, vamos a revisar si la solución funciona, si el código está organizado y si el README explica bien lo que se hizo y muestra el deploy (implementación) en línea. Sin misterio: si entregamos algo funcionando y bien documentado, estará perfecto.

Antes de concluir, tres consejos rápidos que nos van a salvar:
1. **Comencemos siempre por el agente local.** Hagamos que funcione primero en nuestra máquina. Solo después pensemos en el deploy (implementación). Muchas personas intentan subir a la nube algo que todavía no funciona localmente, y ahí todo se complica.
2. **Usemos Google Colab para prototipar.** Es gratuito, ya viene con Python configurado y nos ahorra tiempo de instalación.
3. **No nos quedemos atrapados intentando hacer una interfaz visualmente atractiva.** El valor del proyecto está en que el agente funcione, no en la apariencia. Enfoquémonos en lo importante.

Eso es todo; mucho éxito. El soporte está disponible si nos trabamos en algún punto. Ahora vamos a construirlo: ¡podemos lograrlo! ¡Hasta luego!

---

## Crea los documentos para tu Challenge

Genera la documentación de tu agente inteligente, aquí compartimos algunas sugerencias que puedes utilizar como base. Además, con ayuda de la IA podrás generarlos rápidamente.

### 1. Tienda Online / E-commerce
* Política de privacidad
* Política de reembolso y devoluciones
* Preguntas frecuentes (FAQ)
* Guía de envíos y entregas
* Términos y condiciones

### 2. SaaS / Plataforma Digital
* Base de conocimiento del producto
* FAQ de soporte
* Política de privacidad
* Planes y precios
* Términos de uso

### 3. Empresa de Logística / Envíos
* Política de envíos
* Procedimiento de rastreo de pedidos
* Política de reembolsos y siniestros
* Preguntas frecuentes
* Proceso de reclamos y atención al cliente

### 4. Clínica de Salud / Consultorio Médico
* Política de privacidad de datos del paciente
* Preguntas frecuentes sobre consultas y turnos
* Política de cancelaciones y reagendamiento
* Guía de convenios y coberturas médicas
* Instrucciones pre y post consulta

### 5. Plataforma Educativa / Escuela Online
* Reglamento del estudiante
* Política de reembolso de matrículas
* Preguntas frecuentes sobre cursos y certificados
* Guía de uso de la plataforma
* Programa de becas y afiliados

### 6. Fintech / Banco Digital
* Política de privacidad y protección de datos
* Términos y condiciones de uso
* Preguntas frecuentes sobre transacciones y límites
* Política de seguridad y prevención de fraudes
* Tarifas y comisiones del servicio

**Recomendación:** Recuerda que este proyecto es tuyo y puedes personalizarlo como quieras. La elección del documento es completamente libre y puedes adaptarla al contexto que más te interese. No te limites a estas opciones. Puedes utilizar cualquier documento en formato PDF o CSV que permita a tu agente responder preguntas relevantes. Lo más importante es que el proyecto resuelva un problema real y demuestre tu capacidad para construir una solución funcional utilizando inteligencia artificial.

Si necesitas ayuda para definir la documentación de tu agente, aquí encontrarás algunas sugerencias y ejemplos que pueden servirte como punto de partida. Puedes utilizarlos tal como están, adaptarlos a tus necesidades o inspirarte en ellos para crear una documentación personalizada para tu proyecto.

---

## Ejemplos de Empresas y Documentación

### Santos Pegasus Soluciones
Empresa de tecnología especializada en el desarrollo de software escalable bajo arquitectura de microservicios y soluciones de Inteligencia Artificial (RAG). Se destaca por sus rigurosos estándares técnicos en ingeniería back-end y front-end, garantizando excelencia operativa y seguridad en infraestructuras de nube (OCI).

**Documentos de Referencia:**
* [Manual de Onboarding para Nuevos Desarrolladores](https://cdn1.gnarususercontent.com.br/documents/6/internal/359dda5d-7daa-4aa1-832e-fb2843fcf70d.pdf)
* [Guía Oficial de Ingeniería Back-end](https://cdn1.gnarususercontent.com.br/documents/6/internal/4a531743-36de-4b0b-b532-b5447b2c1ba7.pdf)
* [Guía Oficial de Ingeniería Front-end](https://cdn1.gnarususercontent.com.br/documents/6/internal/a4266faf-77bf-4932-99b3-72e452051be2.pdf)
* [Protocolo de Respuesta a Incidentes y Post-Mortems](https://cdn1.gnarususercontent.com.br/documents/6/internal/1b414aa2-c5ca-40d4-8e9c-8d9e4dcdc955.pdf)
* [Arquitectura de Microservicios y Mapa de Dominios](https://cdn1.gnarususercontent.com.br/documents/6/internal/ddb400f4-475a-4ddc-9ef3-a0cbb2789447.pdf)

### BimBam Buy
E-commerce multiplataforma enfocado en la experiencia de compra digital ágil y segura. Se destaca por un modelo de negocio orientado al cliente, con políticas robustas de reembolso, un programa de afiliados dinámico y una infraestructura logística optimizada para garantizar entregas rápidas y soporte constante al usuario final.

**Documentos de Referencia:**
* Política de Reembolsos y Devoluciones de BimBam Buy.pdf
* Programa de Afiliados de BimBam Buy.pdf
* Guía de Tiempos y Costos de Envío de BimBam Buy.pdf
* Preguntas Frecuentes sobre Métodos de Pago de BimBam Buy.pdf
* Manual de Garantía de Productos de BimBam Buy.pdf

### Mercado Central 24h
Supermercado moderno de operación continua (24/7) que integra la experiencia de tienda física con servicios de delivery y app propia. Su enfoque principal es la eficiencia operativa en la gestión de stock y una fuerte política de atención al cliente, impulsada por su programa de fidelidad "Cliente VIP Central".

**Documentos de Referencia:**
* inventario_de_supermercado_latam.xlsx
* Política de Atención al Cliente y Devoluciones — Mercado Central 24h (México).pdf
* Preguntas Frecuentes (FAQ) — Mercado Central 24h (México).pdf
* Reglamento Interno y Procedimientos Operativos — Mercado Central 24h (México).pdf
* Manual de Proveedores y Política de Compras — Mercado Central 24h (México).pdf

---
*Discutir en el Foro*
