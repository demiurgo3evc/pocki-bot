# Pocki WhatsApp Bot

Bot de WhatsApp desarrollado con **NestJS** que utiliza **WhatsApp Cloud API** para recibir mensajes mediante **webhooks** y responder automáticamente usando servicios de IA como **OpenAI** o **Groq**.

---

# Arquitectura

```
Usuario (WhatsApp)
        │
        ▼
WhatsApp Cloud API (Meta)
        │
        ▼
Webhook (/webhook)
        │
        ▼
NestJS Controller
        │
        ▼
Services (messages / openai)
        │
        ▼
Respuesta enviada al usuario
```

---

# Requisitos

Antes de ejecutar el proyecto debes tener instalado:

* Node.js 18 o superior
* npm
* ngrok
* cuenta en **Meta Developers**
* acceso a **WhatsApp Cloud API**
* PostgreSQL

---

# 1. Clonar el proyecto

```bash
git clone <URL_DEL_REPOSITORIO>
cd pocki-bot
```

---

# 2. Instalar dependencias

```bash
npm install
```

---

# 3. Crear archivo `.env`

Este proyecto requiere un archivo `.env` en la raíz del proyecto.

Ejemplo:

```
WHATSAPP_TOKEN=
WHATSAPP_VERIFY_TOKEN=
WHATSAPP_PHONE_ID=

# OpenAI
OPENAI_API_KEY=

# Groq
GROQ_API_KEY=

# Base de datos
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=
```

---

## Descripción de variables

| Variable              | Descripción                            |
| --------------------- | --------------------------------------- |
| WHATSAPP_TOKEN        | Token generado en Meta Developers       |
| WHATSAPP_VERIFY_TOKEN | Token usado para validar el webhook     |
| WHATSAPP_PHONE_ID     | Phone Number ID del número de WhatsApp |
| OPENAI_API_KEY        | API Key de OpenAI                       |
| GROQ_API_KEY          | API Key del servicio Groq               |
| DB_HOST               | Host de la base de datos                |
| DB_PORT               | Puerto de la base de datos              |
| DB_USER               | Usuario de la base de datos             |
| DB_PASSWORD           | Contraseña de la base de datos         |
| DB_NAME               | Nombre de la base de datos              |

---

# 4. Ejecutar el proyecto

```bash
npm run start:dev
```

El servidor se ejecutará en:

```
http://localhost:3000
```

---

# 5. Exponer el servidor con ngrok

WhatsApp necesita acceder a tu servidor mediante **HTTPS**.

Ejecuta:

```bash
ngrok http 3000
```

Obtendrás una URL como:

```
https://xxxxx.ngrok-free.app
```

---

# 6. Configurar Webhook en Meta

Ir a:

```
Meta Developers → WhatsApp → Configuration → Webhooks
```

Configurar:

**Callback URL**

```
https://xxxxx.ngrok-free.app/webhook
```

**Verify Token**

```
pocki_secret
```

Luego suscribir el evento:

```
messages
```

---

# 7. Probar el bot

1. Abre WhatsApp
2. Envía un mensaje al número de prueba configurado en Meta
3. El webhook recibirá el mensaje
4. El bot responderá automáticamente

---

# Endpoint del Webhook

Meta enviará eventos a:

```
POST /webhook
```

Verificación del webhook:

```
GET /webhook
```

---

# Estructura del proyecto

```
src
│
├── messages
│   ├── message.entity.ts
│   ├── messages.module.ts
│   └── messages.service.ts
│
├── openai
│   ├── openai.module.ts
│   └── openai.service.ts
│
├── whatsapp
│   ├── whatsapp.controller.ts
│   ├── whatsapp.module.ts
│   └── whatsapp.service.ts
│
├── app.module.ts
└── main.ts
```

---

# Descripción de módulos

### whatsapp

Módulo encargado de la integración con **WhatsApp Cloud API**.

* recibe mensajes desde el webhook
* envía respuestas al usuario

### messages

Módulo encargado de manejar la lógica de mensajes y su persistencia.

### openai

Módulo encargado de la integración con **OpenAI / Groq** para generar respuestas inteligentes.

---

# Flujo del bot

1. El usuario envía un mensaje por WhatsApp.
2. WhatsApp Cloud API envía el evento al webhook.
3. NestJS recibe el evento en `/webhook`.
4. El servicio procesa el mensaje.
5. Se consulta IA si es necesario.
6. Se genera una respuesta.
7. El bot responde al usuario.

---

# Scripts disponibles

```bash
npm run start
npm run start:dev
npm run start:prod
npm run build
npm run test
```

---

# Tecnologías usadas

* NestJS
* TypeScript
* Axios
* WhatsApp Cloud API
* OpenAI
* Groq
* PostgreSQL
* ngrok

---

# Licencia

MIT
`<p align="center">`
  `<a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />``</a>`

</p>
