# React Vite TypeScript + Tailwind CSS v4 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Inicializar y configurar el proyecto React en `megaingga` utilizando Vite, TypeScript, Tailwind CSS v4, Lucide Icons y utilidades de clases modulares.

**Architecture:** El repositorio se inicializa con la plantilla oficial `react-ts` de Vite sobre el directorio actual sin romper el historial git. Luego se integra Tailwind CSS v4 a nivel de bundler con `@tailwindcss/vite` y se provee la utilidad central `cn()` junto con componentes e iconos de bienvenida.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS v4 (`@tailwindcss/vite`), `clsx`, `tailwind-merge`, `lucide-react`.

**Spec:** `docs/superpowers/specs/2026-10-13-react-vite-setup-design.md`

## Global Constraints

- Platform: Windows PowerShell (`pwsh`)
- Node / npm environment
- Preservar historial Git y archivos existentes en `docs/` y `README.md`
- Cero dependencias rotas; `npm run build` debe completar sin advertencias ni fallos de tipos

---

### Task 1: Scaffolding de Vite React TypeScript

**Files:**
- Create/Overwrite: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `index.html`, `src/*`, `.gitignore`
- Conserves: `README.md`, `docs/*`

**Interfaces:**
- Produces: Estructura base compilable con `npm run dev` y `npm run build`

- [ ] **Step 1: Consultar flags de creación no-interactiva**
Ejecutar:
```bash
npx -y create-vite@latest --help
```

- [ ] **Step 2: Inicializar la plantilla react-ts en el directorio actual**
Ejecutar en modo no interactivo asegurando que no sobreescriba `README.md` ni `docs/`:
```bash
npx -y create-vite@latest . --template react-ts
```

- [ ] **Step 3: Instalar dependencias base**
Ejecutar:
```bash
npm install
```

- [ ] **Step 4: Verificar compilación base**
Ejecutar:
```bash
npm run build
```
Resultado esperado: Código de salida 0 y generación de `dist/`.

- [ ] **Step 5: Commit del andamiaje base**
```bash
git add .
git commit -m "chore: scaffold React TypeScript project with Vite"
```

---

### Task 2: Configuración de Tailwind CSS v4, Lucide y Utilidades

**Files:**
- Modify: `package.json`
- Modify: `vite.config.ts`
- Modify: `src/index.css`
- Create: `src/lib/utils.ts`

**Interfaces:**
- Produces: `cn(...inputs: ClassValue[]): string` en `src/lib/utils.ts`
- Produces: Integración de `@tailwindcss/vite` en `vite.config.ts`

- [ ] **Step 1: Instalar dependencias de Tailwind v4, utilidades e iconos**
Ejecutar:
```bash
npm install @tailwindcss/vite@latest tailwindcss@latest clsx tailwind-merge lucide-react
```

- [ ] **Step 2: Configurar el plugin de Tailwind en `vite.config.ts`**
Asegurar que `vite.config.ts` incluya `@tailwindcss/vite`:
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
```

- [ ] **Step 3: Configurar `@import "tailwindcss";` en `src/index.css`**
Reemplazar el contenido de `src/index.css`:
```css
@import "tailwindcss";
```

- [ ] **Step 4: Crear la función utilitaria `src/lib/utils.ts`**
Crear `src/lib/utils.ts` con:
```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 5: Verificar que la compilación funciona con Tailwind v4**
Ejecutar:
```bash
npm run build
```
Resultado esperado: Compilación sin errores.

- [ ] **Step 6: Commit de configuración Tailwind y utilidades**
```bash
git add vite.config.ts src/index.css src/lib/utils.ts package.json package-lock.json
git commit -m "feat: configure Tailwind CSS v4, Lucide and class utilities"
```

---

### Task 3: Pantalla de Bienvenida y Verificación de Integración

**Files:**
- Modify: `src/App.tsx`
- Modify: `README.md`

**Interfaces:**
- Consumes: `cn` de `src/lib/utils.ts`, iconos de `lucide-react`, clases de Tailwind v4

- [ ] **Step 1: Crear componente moderno de bienvenida en `src/App.tsx`**
Implementar una vista moderna con tarjeta interactiva, contador de estado, iconos Lucide y clases utilitarias de Tailwind v4.

- [ ] **Step 2: Actualizar `README.md` con instrucciones de uso**
Detallar en `README.md` los comandos del proyecto (`npm run dev`, `npm run build`, stack técnico).

- [ ] **Step 3: Ejecutar build de verificación final**
Ejecutar:
```bash
npm run build
```
Resultado esperado: 0 errores de TypeScript y bundle generado en `dist/`.

- [ ] **Step 4: Commit de la pantalla de bienvenida y documentación**
```bash
git add src/App.tsx README.md
git commit -m "feat: add modern starter UI and project documentation"
```
