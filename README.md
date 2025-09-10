# 🛍️ Haversack - ECommerce Frontend

Aplicación de e-commerce moderna desarrollada en React con TypeScript y Material-UI, basada en el prototipo Figma y cumpliendo todos los requerimientos del TPO de Aplicaciones Interactivas.

## ✨ Características Implementadas

### 🔐 Gestión de Usuarios
- ✅ Registro de usuarios (nombre, apellido, email, contraseña)
- ✅ Login de usuarios con validación
- ✅ Autenticación persistente con localStorage
- ✅ Gestión de perfil de usuario

### 📦 Catálogo de Productos
- ✅ Listado de productos ordenados alfabéticamente
- ✅ Categorías de productos con navegación
- ✅ Detalle completo de productos con imágenes
- ✅ Sistema de búsqueda y filtrado
- ✅ Validación de stock en tiempo real

### 🛒 Carrito de Compras
- ✅ Agregar productos al carrito
- ✅ Modificar cantidades y eliminar productos
- ✅ Calcular total automáticamente
- ✅ Checkout con validación de stock
- ✅ Vaciar carrito completo

### 🏪 Gestión de Productos
- ✅ Alta de productos con múltiples imágenes
- ✅ Edición y eliminación de productos
- ✅ Gestión de stock por producto
- ✅ Categorización de productos

## 🛠️ Tecnologías Utilizadas

- **React 18+** con TypeScript
- **Material-UI v5** para componentes UI
- **React Router v6** para navegación
- **React Hook Form** + **Yup** para formularios
- **Context API** para gestión de estado
- **Axios** para peticiones HTTP

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js 16.x o superior
- npm 8.x o superior

### Pasos para ejecutar

1. **Instalar dependencias**
```bash
npm install
```

2. **Ejecutar en modo desarrollo**
```bash
npm start
```

La aplicación estará disponible en: `http://localhost:3000`

## 🎨 Características de Diseño (Basado en Prototipo Figma)

### Tema Personalizado
- **Paleta de colores Haversack**: Rojo vibrante (#E53E3E) como color principal
- Tipografía moderna y minimalista
- Componentes Material-UI customizados
- Diseño limpio con fondo blanco
- Transiciones suaves y elegantes

### UX/UI Avanzada
- **Sidebar de filtros moderno** (categorías, colores, marcas, precio)
- **Cards de productos rediseñadas** con imágenes prominentes
- **Búsqueda mejorada** con estilo redondeado
- **Header minimalista** estilo Figma
- **Branding "Haversack"** consistente
- Loading states y feedback visual
- Diseño responsive para móviles y desktop

## 📱 Funcionalidades Demo

### Usuario Demo
- **Email**: `admin@test.com`
- **Contraseña**: `password`

*O crea tu propio usuario usando cualquier email válido*

### Productos Mock
La aplicación incluye datos de prueba con:
- 6 productos de ejemplo en diferentes categorías
- Imágenes de Unsplash
- Stock variable para probar validaciones
- Precios en pesos argentinos

## 🏗️ Arquitectura del Proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── auth/            # Componentes de autenticación
│   ├── cart/            # Componentes del carrito
│   ├── layout/          # Layout y navegación
│   └── products/        # Componentes de productos
├── context/             # Contextos de React
├── pages/               # Páginas principales
├── services/            # Servicios de API
├── types/               # Tipos de TypeScript
└── theme.ts            # Tema de Material-UI
```

## 🎯 Requerimientos del TPO Cumplidos

✅ **Sistema completo de e-commerce funcional**  
✅ **Gestión de usuarios (registro/login)**  
✅ **Catálogo de productos con categorías**  
✅ **Carrito de compras completo**  
✅ **Gestión de productos y stock**  
✅ **Interfaz responsive y moderna**  
✅ **Validaciones y manejo de errores**  

---

**🎉 ¡La aplicación está lista para usar y cumple con todos los requerimientos del TPO!**
