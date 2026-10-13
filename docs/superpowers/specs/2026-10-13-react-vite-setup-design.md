# Especificación de Diseño: Inicialización de Proyecto React con Vite, TypeScript y Tailwind CSS v4

**Fecha:** 2026-10-13  
**Estado:** Aprobado  
**Objetivo:** Configurar e inicializar la base del repositorio `megaingga` como una aplicación web moderna basada en React, TypeScript, Vite y Tailwind CSS v4.

---

## 1. Stack Tecnológico

| Componente | Elección | Justificación |
|---|---|---|
| **Bundler / Runtime** | Vite | Tiempos de inicio ultrarrápidos, recarga en caliente instantánea (HMR) y ecosistema estándar. |
| **Framework UI** | React 19 / 18 | Estándar de la industria para aplicaciones SPA modulares y basadas en componentes. |
| **Lenguaje** | TypeScript | Tipado estático fuerte para evitar errores en tiempo de ejecución y mejorar la experiencia de desarrollo. |
| **Motor de Estilos** | Tailwind CSS v4 | Integración nativa vía `@tailwindcss/vite`, sin necesidad de `postcss.config.js` ni `tailwind.config.js` manuales. |
| **Utilidades de UI** | `clsx` + `tailwind-merge` | Función `cn()` para concatenación y resolución de conflictos de clases CSS. |
| **Iconografía** | `lucide-react` | Iconos vectoriales limpios, accesibles y con soporte para tree-shaking. |

---

## 2. Arquitectura y Estructura del Proyecto

```text
megaingga/
├── .git/
├── .gitignore
├── docs/
│   └── superpowers/
│       └── specs/
│           └── 2026-10-13-react-vite-setup-design.md
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── components/
│   ├── lib/
│   │   └── utils.ts
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── vite-env.d.ts
└── README.md
```

---

## 3. Configuración y Dependencias

### Dependencias de Producción (`dependencies`)
- `react`, `react-dom`
- `lucide-react`
- `clsx`, `tailwind-merge`

### Dependencias de Desarrollo (`devDependencies`)
- `vite`
- `@vitejs/plugin-react`
- `@tailwindcss/vite`, `tailwindcss`
- `typescript`, `@types/react`, `@types/react-dom`
- `eslint` y plugins de linting de Vite/React

---

## 4. Archivos Clave

### `vite.config.ts`
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

### `src/index.css`
```css
@import "tailwindcss";
```

### `src/lib/utils.ts`
```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### `src/App.tsx`
Una pantalla de bienvenida elegante y minimalista que valide que:
1. React está montado y funcionando.
2. Tailwind CSS v4 está compilando estilos correctamente.
3. Lucide Icons renderiza adecuadamente.
4. Interactividad básica (contador o estado simple reactivo).

---

## 5. Scripts de NPM
- `dev`: Inicia el entorno local de desarrollo con Vite.
- `build`: Ejecuta la verificación de tipos TypeScript (`tsc -b`) y compila para producción.
- `preview`: Permite previsualizar la compilación de producción.
- `lint`: Ejecuta el análisis estático de código.

---

## 6. Criterios de Aceptación
- [ ] La estructura de directorios y dependencias está instalada sin advertencias críticas de paquetes.
- [ ] `npm run build` completa con código de salida 0 sin errores de tipos TypeScript ni bundle.
- [ ] Tailwind CSS v4 aplica clases utilitarias exitosamente.
- [ ] La utilidad `cn()` en `src/lib/utils.ts` está disponible y tipada.
- [ ] El repositorio queda versionado con un commit limpio en Git.
