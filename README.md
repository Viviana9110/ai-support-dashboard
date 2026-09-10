AI Support Dashboard

Plataforma SaaS Full Stack para gestionar operaciones de soporte al cliente e incorporar asistencia contextual basada en Inteligencia Artificial.

AI Support Dashboard es un proyecto de portfolio enfocado en construir una plataforma moderna de soporte al cliente que combina gestión de tickets, clientes y conversaciones, base de conocimiento, analítica, control de acceso basado en roles y un asistente de IA integrado mediante la API de OpenAI.

El proyecto demuestra desarrollo de aplicaciones web Full Stack de extremo a extremo utilizando Next.js, React, TypeScript, PostgreSQL, Prisma y OpenAI, incluyendo autenticación, autorización, validación, rate limiting, persistencia de datos y pruebas automatizadas.

🎯 Qué demuestra este proyecto

Desarrollo Full Stack con Next.js App Router y TypeScript.
Desarrollo de APIs mediante Next.js Route Handlers.
Modelado y persistencia de datos con PostgreSQL + Prisma ORM.
Autenticación mediante sesiones JWT firmadas almacenadas en cookies HttpOnly.
Autorización basada en roles ADMIN y AGENT.
Gestión de clientes y tickets.
Gestión de conversaciones e historial de mensajes.
Gestión de artículos de una base de conocimiento.
Dashboard de analítica y visualización de datos.
Conversaciones con IA contextual utilizando OpenAI Responses API.
Validación de entradas mediante Zod.
Rate limiting específico para funcionalidades de IA.
Persistencia transaccional de conversaciones y mensajes generados por IA.
Pruebas automatizadas con Vitest.
Flujo de despliegue preparado para Vercel y migraciones de Prisma.

✨ Funcionalidades principales

🔐 Autenticación y autorización
Inicio y cierre de sesión.
Hash de contraseñas mediante bcryptjs.
Sesiones JWT firmadas utilizando jwt.
Cookies HttpOnly para almacenamiento de sesión.
Expiración de sesión de siete días.
Autorización basada en roles ADMIN y AGENT.
Protección de rutas de API.

🎫 Gestión de tickets
Creación y gestión de tickets de soporte.
Estados: OPEN, PENDING, CLOSED.
Prioridades: LOW, MEDIUM, HIGH.
Relación entre clientes y agentes.
Asignación de tickets y datos de propiedad.

👥 Gestión de clientes
Registro de clientes con información de empresa.
Estado activo/inactivo.
Relación entre clientes y tickets.
Información contextual del cliente disponible para el asistente de IA.

💬 Conversaciones
Gestión de conversaciones de soporte.
Historial persistente de mensajes.
Estado leído/no leído.
Metadatos de conversación.

📚 Base de conocimiento
Gestión de artículos con categorías y estados.
Estados de borrador, publicado y archivado.
Autoría y metadatos de publicación.
Los artículos publicados pueden utilizarse como contexto para las conversaciones con IA.

🤖 Asistente de IA contextual
El asistente de IA está diseñado para trabajar con información real de la aplicación en lugar de tratar cada solicitud como una conversación aislada.
Para una conversación de IA autenticada, el backend:
Valida la sesión del usuario.
Aplica un rate limit específico para IA.
Valida el payload mediante Zod.
Obtiene la conversación actual y su historial de mensajes.
Recupera información del cliente y sus tickets recientes.
Recupera artículos publicados de la base de conocimiento.
Construye el contexto que recibirá el modelo.
Envía la información preparada a OpenAI Responses API.
Persiste el mensaje del usuario y la respuesta de la IA mediante una transacción de base de datos.
Este flujo mantiene una separación clara entre la capa de datos, la construcción del contexto de IA y la interacción con el modelo.

🔐 Seguridad y confiabilidad
La seguridad forma parte de la arquitectura de la aplicación y no es un elemento añadido al final.
Hash de contraseñas con bcryptjs.
Sesiones firmadas con jwt.
Cookies HttpOnly para las sesiones.
Verificaciones de autenticación en servidor.
Autorización basada en roles.
Verificaciones de propiedad al acceder a conversaciones de IA.
Validación de solicitudes mediante Zod.
Rate limiting para IA con respuestas HTTP 429 y encabezado Retry-After.
Soft delete para entidades relevantes.
Índices de base de datos para relaciones y estados consultados frecuentemente.
Persistencia transaccional de mensajes de IA.
Secretos gestionados mediante variables de entorno.

🛠️ Stack tecnológico

Frontend
Next.js 15
React 19
TypeScript
Tailwind CSS
shadcn/ui / primitivas Radix UI
TanStack Query
Zustand
React Hook Form
Recharts
Framer Motion
Backend
Next.js Route Handlers
TypeScript
Diseño de APIs REST
Validación con Zod
Axios cuando se requiere funcionalidad de cliente HTTP
Base de datos
PostgreSQL
Prisma ORM
Prisma PostgreSQL adapter

Inteligencia Artificial
OpenAI API
OpenAI Responses API
Construcción de contexto a partir de clientes, tickets, conversaciones y base de conocimiento
Rate limiting para solicitudes de IA

Testing y calidad
Vitest
ESLint
Prettier
Husky

Despliegue
Vercel

Migraciones de Prisma durante los builds de producción

🏗️ Arquitectura

┌─────────────────────────────────────────────┐
│                Interfaz Next.js             │
│ React + TypeScript + Tailwind + shadcn/ui  │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│             Next.js Route Handlers          │
│ Auth · Tickets · Customers · Chat · etc.   │
└───────────────┬─────────────────┬───────────┘
                │                 │
                ▼                 ▼
       ┌────────────────┐   ┌────────────────┐
       │    Prisma      │   │   OpenAI API   │
       │   PostgreSQL   │   │ Responses API  │
       └───────┬────────┘   └───────┬────────┘
               │                    │
               └──────────┬─────────┘
                          ▼
                 Flujo de soporte
                   con IA contextual

📁 Estructura del proyecto

ai-support-dashboard/
├── prisma/
│   ├── migrations/          # Migraciones de base de datos
│   ├── schema.prisma        # Modelo de datos
│   ├── seed.ts               # Datos de demostración
│   └── create-admin.ts       # Utilidad para crear administradores
├── public/                   # Recursos estáticos
├── src/
│   ├── app/                  # Rutas, páginas y APIs de Next.js
│   ├── components/           # Componentes UI reutilizables
│   ├── constants/            # Constantes de la aplicación
│   ├── hooks/                # Hooks personalizados
│   ├── lib/                  # Auth, base de datos, IA, validación y utilidades
│   ├── providers/            # Providers de la aplicación
│   ├── services/             # Servicios de la aplicación
│   ├── store/                # Gestión de estado del cliente
│   ├── test/                 # Helpers de testing
│   └── types/                # Tipos TypeScript compartidos
├── .husky/                   # Git hooks
├── package.json
├── prisma.config.ts
├── vitest.config.mts
└── README.md

⚙️ Instalación

Requisitos previos

Node.js

npm

PostgreSQL

API key de OpenAI para utilizar las funcionalidades de IA

1. Clonar el repositorio

git clone https://github.com/Viviana9110/ai-support-dashboard.git
cd ai-support-dashboard

2. Instalar dependencias

npm install

3. Configurar variables de entorno

Crear un archivo .env en la raíz del proyecto:

DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"
AUTH_SECRET="your-long-random-secret"
OPENAI_API_KEY="your-openai-api-key"
SEED_ADMIN_PASSWORD="your-demo-password"

La aplicación utiliza DATABASE_URL, AUTH_SECRET y OPENAI_API_KEY. El script de seed requiere SEED_ADMIN_PASSWORD para crear la base de datos de demostración.

Nunca subas secretos reales ni API keys al repositorio.

4. Aplicar migraciones

npx prisma migrate dev

5. Cargar datos de demostración

npx prisma db seed

El seed crea usuarios, clientes, tickets, conversaciones y artículos de la base de conocimiento de demostración.

6. Iniciar el servidor de desarrollo

npm run dev

Abrir:

http://localhost:3000

📜 Scripts disponibles

Comando

Propósito

npm run dev

Inicia el servidor de desarrollo de Next.js con Turbopack

npm run build

Construye la aplicación

npm run start

Inicia el servidor en producción

npm run lint

Ejecuta ESLint

npm run test

Ejecuta la suite de pruebas con Vitest

npm run test:watch

Ejecuta Vitest en modo watch

npm run create-admin

Crea un usuario administrador mediante la utilidad del proyecto

🗄️ Modelo de datos

El esquema de Prisma incluye las principales entidades necesarias para el flujo de soporte:

User

Customer

Ticket

Conversation

Message

KnowledgeArticle

Session

AuthToken

AuditLog

Notification

AiConversation

AiMessage

El modelo utiliza relaciones, enums, índices y campos de soft delete para soportar las reglas de negocio y los patrones de consulta de la aplicación.

💡 Aspectos técnicos destacados

IA contextual

La capa de IA no envía únicamente el mensaje del usuario al modelo. Construye un contexto utilizando información de la aplicación como el perfil del cliente, tickets recientes, artículos publicados de la base de conocimiento e historial de la conversación con IA.

Gestión segura de sesiones

La autenticación utiliza tokens JWT firmados almacenados en una cookie HttpOnly. Los helpers del servidor protegen las rutas de API y pueden aplicar requisitos específicos de roles.

Control del consumo de IA

Los endpoints de IA utilizan rate limiting por usuario para evitar un consumo descontrolado. Cuando se alcanza el límite, la API responde con 429 Too Many Requests y el encabezado Retry-After.

Persistencia transaccional de IA

Después de generar una respuesta, la aplicación persiste el mensaje del usuario, el mensaje del asistente y la actualización de la conversación dentro de una transacción de base de datos.

🚀 Despliegue

La aplicación está preparada para desplegarse en Vercel. El build de producción puede aplicar las migraciones pendientes de Prisma antes de construir la aplicación Next.js.

Para un despliegue en producción, es necesario configurar las variables de entorno requeridas en la plataforma de hosting y garantizar que la base de datos PostgreSQL sea accesible por la aplicación desplegada.

🎯 Por qué construí este proyecto

Construí este proyecto para explorar la arquitectura de un producto SaaS moderno que combina procesos de negocio con capacidades de Inteligencia Artificial.

El objetivo no era simplemente integrar una API de IA, sino diseñar la aplicación que la rodea: autenticación, autorización, persistencia de datos, información contextual, validación, rate limiting, transacciones de base de datos y una estructura frontend/backend mantenible.

👩‍💻 Sobre la desarrolladora

Viviana Londoño Naranjo

Full Stack Developer enfocada en React, Next.js, TypeScript, Node.js, PostgreSQL, aplicaciones SaaS y productos potenciados por Inteligencia Artificial.

GitHub: https://github.com/Viviana9110

Proyecto: https://github.com/Viviana9110/ai-support-dashboard

Demo: https://ai-support-dashboard-five.vercel.app/
