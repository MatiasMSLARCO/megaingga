# megaingga

Aplicación web moderna construida con **React**, **TypeScript**, **Vite** y **Tailwind CSS v4**.

---

## 🚀 Tecnologías

- **[React 19](https://react.dev/)**: Biblioteca UI declarativa basada en componentes.
- **[Vite 8](https://vite.dev/)**: Bundler de última generación ultrarrápido con HMR.
- **[TypeScript](https://www.typescriptlang.org/)**: Tipado estático con alias `@/*` configurado.
- **[Tailwind CSS v4](https://tailwindcss.com/)**: Motor de estilos de alto rendimiento integrado vía `@tailwindcss/vite`.
- **[Lucide React](https://lucide.dev/)**: Set de iconos modernos y consistentes.
- **`clsx` & `tailwind-merge`**: Helper utilitario `cn()` para gestión condicional y libre de conflictos en clases de Tailwind.
- **[Oxlint](https://oxc.rs/)**: Linter ultrarrápido basado en Rust.

---

## 🛠️ Comenzando

### Prerrequisitos
- [Node.js](https://nodejs.org/) (versión 20+ recomendada)
- `npm` (o `pnpm` / `yarn`)

### Instalación
Clona el repositorio e instala las dependencias:

```bash
git clone https://github.com/MatiasMSLARCO/megaingga.git
cd megaingga
npm install
```

### Comandos Disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo local con recarga rápida (HMR). |
| `npm run build` | Valida tipos TypeScript y compila el bundle de producción en `dist/`. |
| `npm run preview` | Previsualiza localmente el build de producción generado. |
| `npm run lint` | Ejecuta el análisis estático de código con Oxlint. |

---

## 📁 Estructura del Proyecto

```text
megaingga/
├── public/                 # Recursos públicos estáticos
├── src/
│   ├── assets/             # Logos e imágenes
│   ├── components/         # Componentes React reutilizables
│   ├── lib/
│   │   └── utils.ts        # Función utilitaria cn()
│   ├── App.tsx             # Componente principal
│   ├── main.tsx            # Punto de entrada de la aplicación
│   ├── index.css           # Punto de entrada de Tailwind v4 (@import "tailwindcss";)
│   └── vite-env.d.ts       # Definiciones de tipo para Vite
├── index.html              # Plantilla HTML raíz
├── vite.config.ts          # Configuración de Vite con plugins y alias
├── tsconfig.json           # Configuración base de TypeScript
├── tsconfig.app.json       # Configuración TS del frontend y paths (@/*)
└── package.json            # Scripts y dependencias del proyecto
```

---

## 🎨 Utilidad de Estilos `cn()`

Para aplicar clases condicionales o resolver conflictos de Tailwind, utiliza el helper `cn` ubicado en `@/lib/utils`:

```tsx
import { cn } from '@/lib/utils'

<button className={cn(
  "px-4 py-2 rounded-lg font-medium transition-colors",
  isActive ? "bg-purple-600 text-white" : "bg-slate-800 text-slate-300"
)}>
  Botón
</button>
```

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT.
