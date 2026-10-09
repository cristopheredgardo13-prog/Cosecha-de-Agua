# PROMPTS.md · Cosecha de Agua

Registro de los prompts usados para dirigir al agente, en el orden en que se enviaron.
Cada entrada tiene: el prompt tal como se envió (con los corchetes ya completados)
y una línea que dice qué hizo el agente.

---

## Prompt P1 — ARRANQUE · las reglas (Bloque 1)

Crea la lógica. Es el único prompt largo: todo lo demás son cuatro líneas.
Creá el archivo src/logica.ts con las reglas de COSECHA DE AGUA,
según la ficha de abajo.
REGLAS TÉCNICAS, obligatorias
- TypeScript. Exportá los tipos y el objeto CONFIG con todos los números
  juntos arriba, cada uno con un comentario que diga su unidad.
- Este archivo NO puede tocar la pantalla: nada de document, window, alert ni
  console.log. Solo datos y funciones sobre el estado.
- Cada función que cambia el estado devuelve true si la acción fue válida y
  false si no se pudo hacer.
- Si hace falta azar, usá un generador con semilla y exportalo, para que la
  misma semilla dé siempre el mismo resultado.
- Código y comentarios en español.
REGLAS DE TRABAJO
- Hacé exactamente lo que dice la ficha. Nada más.
- Si algo es ambiguo o imposible, paralo y preguntame antes de inventar.
- Al terminar, listame qué dejaste fuera y qué decidiste vos donde la ficha
  no decía nada.
FICHA:

> FICHA DEL PROYECTO
> Encargo 28 · Cosecha de agua · Práctica Semana 2 · INDEL
>
> NOMBRE DEL PROYECTO — Que se entienda sin explicación.
> Cosecha de Agua
>
> EN UNA FRASE — Qué es, como se lo contarías a tu familia.
> Un juego donde atrapo gotas de lluvia con una pila y decido cuándo gastar el agua para mantener vivo mi huerto durante la época seca.
>
> PARA QUIÉN ES — Una persona concreta, con nombre y situación.
> Para Camila, de 15 años, que espera el bus y quiere un juego corto en su celular que no necesite aprender reglas.
>
> QUÉ LOGRA — En un juego: cuál es el objetivo.
> Juntar suficiente agua de lluvia y gastarla en el momento correcto para que el huerto sobreviva 7 días.
>
> LOS TRES VERBOS — Las tres acciones del usuario.
> 1. MOVER la pila a izquierda o derecha.
> 2. JUNTAR las gotas que caen dentro de la pila.
> 3. REGAR el huerto gastando el agua guardada.
>
> TERMINA BIEN SI… — Cómo se gana.
> Llego al día 7 y el huerto todavía tiene vida (más de 0).
>
> TERMINA MAL SI… — Cómo se pierde.
> La vida del huerto llega a 0 antes del día 7. Aparece el aviso «Tu huerto se secó» y un botón para intentar de nuevo.
>
> QUÉ SE VE EN PANTALLA — Lo que siempre debe estar visible.
> El agua guardada en la pila (por ejemplo 4/10), la vida del huerto, el día actual (por ejemplo 3/7) y las gotas cayendo.
>
> CONTROLES — Las dos formas son obligatorias.
> Con el teclado: flechas izquierda y derecha para mover la pila; barra espaciadora para regar.
> Con el dedo: arrastrar el dedo sobre el área de juego para mover la pila; un botón grande «REGAR» (de 44 píxeles o más) para gastar agua.
>
> COLORES Y QUÉ SIGNIFICAN — Tres o cuatro. Sin imágenes ni librerías de fuera.
> Azul: el agua (gotas y pila).
> Verde: huerto sano.
> Rojo: peligro (poca vida o poca agua).
> Amarillo: el día y el botón de regar.
>
> CRITERIO DE ACEPTACIÓN — Un uso completo en primera persona.
> Abro el juego en mi celular y veo el día 1 con el huerto en 5 de vida. Muevo la pila con el dedo y atrapo gotas; el contador de la pila sube. Cuando toco REGAR, la pila gasta 3 de agua y el huerto se mantiene. Si dejo pasar un día sin regar, el huerto pierde 1 de vida. Repito esto durante 7 días y, si el huerto sigue con vida, aparece «¡Tu huerto sobrevivió!». Si la vida llega a 0, aparece «Tu huerto se secó» y puedo volver a empezar.
>
> LO QUE NO VA — Lo que dejo fuera a propósito.
> Sin sonido, sin imágenes externas, sin guardar partida, sin niveles extra, sin modo de dos jugadores.
>
> ESTUDIANTE
> Esta ficha no se firma: confío en que está bien pensada.
> Valencia · 3.er año · Desarrollo de Software «A» · Viernes 09 de octubre de 2026

**Qué hizo el agente:** leyó la guía y la ficha, registró el prompt acá y, antes de
escribir código, paró como manda P1 para preguntar tres ambigüedades de la ficha
(agua inicial de la pila, cómo avanza el día y si regar recupera vida). Con las
tres respuestas (0 de 10 · reloj en main.ts · regar evita la pérdida del día)
creó `src/logica.ts` con CONFIG, tipos, azar con semilla y las funciones de los
tres verbos; `npx tsc --noEmit` quedó en silencio. No tocó pantalla ni creó más archivos.

---

## Prompt P2 — PRUEBAS · que la máquina revise (Bloque 2)

Mínimo cinco pruebas. La número 5 es la que encuentra los errores de diseño.
Escribí pruebas con Vitest para src/logica.ts, en test/logica.test.ts.
Como mínimo cinco, y tienen que cubrir:
1. Que el estado inicial se arme bien.
2. Cada acción del usuario: qué hace cuando es válida y qué devuelve cuando no.
3. Que no se pueda hacer una acción prohibida por las reglas.
4. La condición de «termina bien» y la de «termina mal» de mi ficha.
5. UNA PRUEBA QUE RECORRA UN USO COMPLETO de principio a fin y compruebe que
SE PUEDE LLEGAR AL FINAL BUENO.
Los nombres de las pruebas en español y en forma de frase.
No modifiques src/logica.ts. Al terminar corré npm test y pegame el resultado.

**Qué hizo el agente:** creó `test/logica.test.ts` con pruebas en español que
cubren las cinco áreas (estado inicial, las tres acciones válidas e inválidas,
acción prohibida, termina bien / termina mal y un recorrido completo de 7 días
que llega al final bueno), sin tocar `src/logica.ts`, y corrió `npm test`
(16 pruebas en verde, exit 0).

---

## Prompt P3 — PANTALLA · que se vea (Bloque 3)

La pantalla no decide nada: solo muestra lo que dice la lógica.
Creá src/main.ts y src/estilo.css para mostrar COSECHA DE AGUA
en pantalla.
REGLAS
- main.ts NO decide nada: llama a las funciones de logica.ts y dibuja el
  resultado. Si tenés que escribir una regla acá, está en el lugar equivocado:
  decímelo en lugar de hacerlo.
- Tres estados visibles: el inicio, el uso normal y el final.
- Contraste alto y texto nunca menor a 16 píxeles.
- Los colores según mi ficha. Sin imágenes ni librerías externas.
- Importá el CSS desde main.ts con: import './estilo.css'
Ajustá index.html para que tenga un div con id="app" y cargue src/main.ts
como módulo. Al terminar confirmame que no hay errores en la consola.

**Qué hizo el agente:** creó `src/estilo.css` y reescribió `src/main.ts` con los
tres estados visibles (inicio, uso normal, final), llamando siempre a las
funciones de `logica.ts` (mover/atrapar/regar/pasar día) sin escribir reglas
propias; agregó a `CONFIG` los números que la pantalla necesita (velocidad y
intervalo de gotas, semilla) para no dejar números sueltos, corrió `npm test`
(16 en verde) y `npx tsc --noEmit` (silencio). `index.html` ya tenía
`<div id="app">` y el módulo, no hizo falta tocarlo.

---

## Prompt P4 — MÓVIL · que funcione con el dedo (Bloque 3)

Hacé que esto funcione bien en un celular:
1. Todo lo que se toca tiene que medir al menos 44 píxeles de alto y de ancho.
2. Nada se sale de la pantalla a lo ancho: cero desplazamiento horizontal.
3. El texto nunca baja de 16 píxeles.
4. Funciona con el dedo (toque) y también con teclado, las dos cosas.
5. Agregá la etiqueta viewport en index.html si falta.
No cambies las reglas ni la dificultad. Decime qué ajustaste.

**Qué hizo el agente:** el viewport ya estaba configurado y los botones existentes
aceptaban toque. Agregó arrastre táctil en la zona del juego usando `moverPila`,
conservó el teclado y los botones, y reforzó el ajuste móvil para evitar
desplazamiento horizontal. Los botones tienen un tamaño mínimo de 48 × 48 px.
La herramienta informó que `npm test` y `npm run build` pasaron; al verificar
la copia del ZIP en otro entorno, esas órdenes dieron `EPERM` al resolver rutas,
por lo que esa comprobación no se pudo repetir aquí. Falta probarlo en un teléfono real.

---

## Prompt P5 — REVISIÓN · los seis problemas típicos (Bloque 4)

Revisá todo el proyecto buscando estos seis problemas, y decime cuáles tiene
y en qué línea está cada uno:
1. Lógica metida dentro de main.ts.
2. Números sueltos fuera del objeto CONFIG.
3. Un final bueno al que no se pueda llegar: hacé el cálculo con los números reales.
4. Estado que no se reinicia bien al empezar de nuevo.
5. Variables o funciones que quedaron sin uso.
6. Alguna regla de mi ficha que las pruebas no cubran.
Solo el informe, numerado. TODAVÍA NO ARREGLES NADA.

**Informe de revisión:**
1. Hay simulación de gotas y reloj en `src/main.ts`, líneas 267–289. Las
   reglas principales se delegan en `logica.ts`, pero el avance físico y el
   momento de colisión se coordinan desde la pantalla.
2. Quedan valores numéricos de límites, posiciones y tiempo en `src/main.ts`,
   por ejemplo en las líneas 40, 96, 180–186 y 280–286. Requieren revisar si
   pertenecen a configuración de juego o a presentación.
3. La lógica de las pruebas permite ganar. En tiempo real hay 20 segundos por
   día y se generan gotas cada 900 ms; hacen falta 3 unidades para regar. La
   cantidad disponible parece suficiente, pero no hay una prueba de partida
   completa que ejecute la caída y captura de gotas.
4. El estado y los temporizadores visuales se reinician en `empezar()`
   (líneas 250–256). El generador aleatorio se conserva entre partidas, por lo
   que volver a empezar no repite exactamente la misma secuencia de gotas.
5. `Gota.id` se asigna en la línea 280, pero no se consulta al dibujar ni al
   actualizar las gotas (`src/main.ts`, líneas 33–36 y 100–107).
6. Las pruebas cubren las reglas de `logica.ts`, pero no la integración de
   caída/atrapada de gotas ni el arrastre táctil. La prueba real en teléfono
   sigue pendiente.

**Qué hizo el agente:** entregó el informe numerado sin modificar código durante
la revisión. Quedó pendiente probar el juego en un teléfono real.

---

## Prompt P6 — README · la documentación (Bloque 4)

Escribí el archivo README.md en español con estas seis partes:
1. Nombre y la frase de mi ficha.
2. Qué hace y cómo se usa, en tres líneas.
3. El enlace para abrirlo.
4. Cómo correrlo en otra máquina: los comandos exactos.
5. Dejá este espacio en blanco con un comentario para que lo llene yo:
   «Qué dirigí yo y qué error encontré probando».
6. Declaración de autoría: qué herramienta usé, que el código lo generó un
   agente de IA bajo mi dirección, y qué partes puedo explicar.
No inventes nada en las partes 5 y 6: dejalas para que las complete yo.

**Qué hizo el agente:** creó este README en español con la descripción de la
ficha, controles, comandos y el enlace al repositorio. Dejó pendiente la URL
del juego publicado y espacios para las capturas reales. Las respuestas
personales de las partes 5 y 6 quedaron marcadas para que el estudiante las
complete con su experiencia y comprensión reales.
