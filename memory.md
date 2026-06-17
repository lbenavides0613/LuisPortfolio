# memory.md — Aprendizajes técnicos

Decisiones de diseño, patrones descubiertos y cosas no obvias del proyecto.

---

## Traducciones EN/ES

**Patrón:** Para agregar cualquier texto nuevo, se necesitan **tres pasos**:
1. Agregar atributo `data-i18n="clave"` en el HTML
2. Agregar la clave en el objeto `translations.en` en main.js
3. Agregar la clave en el objeto `translations.es` en main.js

Si el texto contiene HTML interno (negritas, links, etc.), usar `data-i18n-html="clave"` en lugar de `data-i18n`.

**Por qué importa:** Olvidar cualquiera de los tres pasos hace que el texto aparezca en blanco o no se traduzca al cambiar idioma. El sitio tiene audiencia bilingüe (objetivo mercado US, raíces latinas).

---

## Galería de fotos

**Cómo funciona:** El modal de galería se dispara desde botones con atributo `data-gallery="NombreEmpresa"`. Las fotos se cargan desde `assets/NombreEmpresa/`. El JS en main.js filtra los elementos por ese atributo para construir la galería dinámica.

**Nomenclatura de carpetas:** Los nombres de las carpetas en `assets/` deben coincidir exactamente con el valor del atributo `data-gallery` en el HTML (sensible a mayúsculas/espacios).

---

## Dark Mode

**Implementación:** Se togglea la clase `.dark` en el `<body>`. El CSS usa selectores `.dark .elemento` para override de colores. La preferencia se guarda en `localStorage` bajo la clave `"darkMode"` con valor `"1"` o `"0"`.

**No usar media query `prefers-color-scheme`:** El toggle manual tiene prioridad y es la única fuente de verdad del tema.

---

## Animaciones con IntersectionObserver

**Patrón general:** Los elementos animados tienen clase `fade-in` en el HTML. El observer los detecta cuando entran al viewport y les agrega la clase `visible`. El CSS hace la transición.

**Stagger de hermanos:** Cuando varios `.fade-in` son hermanos directos, el JS les asigna un `transitionDelay` escalonado de 70ms cada uno. No agregar animaciones CSS manuales a elementos que ya tienen `fade-in`.

---

## Performance

**Sin build step:** El proyecto no usa bundlers ni transpiladores. Cambios en HTML/CSS/JS se ven directo con F5 en el navegador. No hay que correr ningún comando para "compilar".

**Validación de JS:** El comando configurado en `.claude/settings.local.json` es:
```
node --check 'js/main.js'
```
Úsalo para verificar errores de sintaxis sin necesidad de abrir el navegador.

---

## CSS — Clamp y tipografía fluida

Los tamaños de fuente principales usan `clamp()` para ser fluidos entre móvil y desktop sin media queries:
- Hero: `clamp(2.4rem, 5vw, 4rem)`
- Títulos de sección: `clamp(1.75rem, 3.5vw, 2.5rem)`

No reemplazar con valores fijos: rompe la responsividad en pantallas intermedias.
