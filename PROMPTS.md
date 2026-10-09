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
