# División de Tareas 

## 👤 Integrante 1 – Gestión de Usuarios (Registro/Login)

**Rama:** `feature/users`

### Tareas:
- Formulario de registro (nombre, apellido, email, usuario, contraseña)
- Validaciones en el registro (campos requeridos, contraseñas iguales)
- Formulario de login
- Autenticación con contexto (useContext + useState)
- Redirigir a la home tras login exitoso

### Commits:
- `feat: crear formulario de registro`
- `feat: agregar validaciones al registro`
- `feat: crear formulario de login`
- `feat: implementar contexto de autenticación`
- `feat: redirigir usuario tras login`

---

## 👤 Integrante 2 – Catálogo de Productos

**Rama:** `feature/products`

### Tareas:
- Crear componente ProductList
- Mostrar productos ordenados alfabéticamente
- Mostrar categorías en lista aparte
- Crear vista detalle de producto (imagen + descripción)
- Manejo de stock en vista detalle

### Commits:
- `feat: crear componente ProductList`
- `feat: ordenar productos alfabéticamente`
- `feat: mostrar categorías de productos`
- `feat: crear vista detalle de producto`
- `feat: mostrar disponibilidad de stock`

---

## 👤 Integrante 3 – Carrito de Compras

**Rama:** `feature/cart`

### Tareas:
- Crear contexto de carrito con useContext
- Agregar productos al carrito
- Eliminar un ítem del carrito
- Vaciar carrito completo
- Calcular total en checkout y descontar stock

### Commits:
- `feat: crear contexto de carrito`
- `feat: función para agregar productos`
- `feat: función para eliminar productos`
- `feat: vaciar carrito completo`
- `feat: calcular total y descontar stock`

---

## 👤 Integrante 4 – Gestión de Publicaciones (ABM de Productos)

**Rama:** `feature/product-crud`

### Tareas:
- Formulario para alta de producto
- Guardar producto en la API (json-server)
- Editar producto existente
- Eliminar producto
- Manejo de imágenes por URL

### Commits:
- `feat: formulario de alta de producto`
- `feat: guardar producto en la API`
- `feat: editar producto existente`
- `feat: eliminar producto`
- `feat: cargar imagen de producto con URL`

---

## 👤 Integrante 5 – Persistencia y API REST

**Rama:** `feature/api`

### Tareas:
- Configurar db.json en json-server
- Crear endpoints para usuarios, productos y carrito
- Fetch de productos con useEffect
- Filtrado de productos por categoría
- Documentar endpoints en README.md

### Commits:
- `chore: configurar db.json en json-server`
- `feat: crear endpoint de usuarios`
- `feat: crear endpoint de productos`
- `feat: conectar fetch de productos con useEffect`
- `docs: documentar endpoints API en README`

---

## 👤 Integrante 6 – Estilos Generales (UI/UX)

**Rama:** `feature/ui`

### Tareas:
- Estilos base con CSS/Bootstrap/Tailwind
- Maquetar home con Grid/Flexbox
- Navbar con links a catálogo, carrito y login
- Footer con info básica
- Estilizar formularios y botones

### Commits:
- `style: aplicar estilos base con CSS`
- `style: maquetar home con grid y flexbox`
- `style: crear navbar con navegación`
- `style: agregar footer básico`
- `style: estilizar formularios y botones`

---

## 👤 Integrante 7 – Extras (Animaciones, Testing y Deploy)

**Rama:** `feature/extras`

### Tareas:
- Animaciones con Animate.css o Transitions
- Validación visual de formularios (estados error/success)
- Testear renderizado de componentes principales
- Testear flujo de carrito (agregar/eliminar)
- Deploy en Vercel o Netlify

### Commits:
- `style: agregar animaciones a componentes`
- `feat: validación visual en formularios`
- `test: verificar render de componentes`
- `test: testear flujo de carrito`
- `chore: deploy inicial en vercel`



/sc:design --think crearemos un ecommerce sencillo en react usando. Nosotros debemos usar @"TPO_AI_1C2025.docx(1) (2).pdf" como consigna general pero por el momento necesitamos solo tener hecho hasta @prototipo.txt . Sin embargo preparar el resto para escalarlo. POdemos usar otros colores y mejores estilos, es la idea lo que queda. 

/sc:build --persona-frontend crea el proyecto en react con todo esto que vinimos hablando, trabajaremos hasta dejar los requeremientos de @prototipo.txt terminado y funcional

/sc:improve --persona-frontend --think-harder --loop haremos que se parezca nuestro prototipo de @"Figma TPO.png" 

/sc:improve --think-harder -loop  --persona-frontend vamos a hacer que los usuarios puedan crear productos, que   los productos tengan tags para filtrar después, que se puedan ver estos tags, que la barra de filtros funcione correctamente, mejorar un poco más el estilo, la temática de la página es rojo, negro y blanco, pongamosle un modo noche también. El rango de precios no funciona tampoco. Habrá dos tipos de usuario, usuario comun y admin el admin puede gestionar todos los prodcutos, mientras que el usuario solo puede gestionar sus productos. Vamos a hacer que pueda hacer upload de imagen.

/sc:improve hay que cambiar en los filtros, que están las categorías y marcas. Los productos tienen que tener categoría y marca (tambien en marca puede ser ninguno o no especificado) Y tienen que funcionar estos filtros 

/sc:improve --think vamos a hacer una pequeña modificación a los usuarios. Los usuarios solo pueden agregar al carrito, favoritos y navegar por la página y comprar obviamente. Mientras que el admin es el unico que puede  crear eliminar y editar publicaciones. Tambien debe haber un boton de cerrar sesión.