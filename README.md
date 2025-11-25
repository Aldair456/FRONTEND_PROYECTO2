# Compi Puntos - Debugger Web

Aplicación web desarrollada con React y Vite para depurar código C.

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js instalado (versión 16 o superior)
- npm o yarn

### Instalación

1. Instala las dependencias:
```bash
npm install
```

2. Inicia el servidor de desarrollo:
```bash
npm run dev
```

3. Abre tu navegador en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
compi-puntos/
├── src/
│   ├── components/      # Componentes reutilizables
│   ├── screens/         # Pantallas de la aplicación
│   ├── App.jsx         # Componente principal
│   ├── main.jsx        # Punto de entrada
│   └── index.css       # Estilos globales
├── index.html          # HTML principal
├── vite.config.js      # Configuración de Vite
└── package.json        # Dependencias del proyecto
```

## 🛠️ Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción

## 🎯 Características

- Editor de código C
- Compilación y depuración en tiempo real
- Visualización de registros
- Visualización de la pila (stack)
- Visualización de código fuente con resaltado
- Visualización de código assembly
- Controles de reproducción paso a paso

## 📝 Notas

Esta aplicación se conecta a un API backend para compilar y ejecutar código C. Asegúrate de que el endpoint esté configurado correctamente en `src/screens/DebuggerScreen.jsx`.
