# Video Fix and Flip — guía paso a paso

Reel vertical de 30 s en español: casa deteriorada → renovación → casa terminada → tarjeta final con tu marca.

## Qué ya está hecho
| Archivo | Qué es |
|---|---|
| `fix-and-flip.manifest.json` | El plan completo: 7 tomas, prompts, narración, música, límites de gasto |
| `bible.md` | Guía de la historia: cómo se ve la casa, la cocina, colores y voz |
| `end_card_overlay.png` | Tarjeta final con tu foto, nombre, teléfono y slogan (se pone en los últimos 4 s) |
| `dist/fix-and-flip-reel-google-colab.zip` | Paquete listo para Google Colab |
| `dist/fix-and-flip-reel-google-colab/fix-and-flip-reel.ipynb` | El cuaderno que abres en Colab |

## Plan de tomas
| # | Tiempo | Toma | Narración |
|---|---|---|---|
| 1 | 0–4 s | Casa deteriorada por fuera | ¿Quieres ganar dinero en bienes raíces? Te explico el fix and flip. |
| 2 | 4–8 s | Cocina vieja | Paso uno: compras una casa que necesita trabajo, por debajo del precio del mercado. |
| 3 | 8–13 s | Renovación (solo manos) | Paso dos: la renuevas. Cocina, baños, pintura y pisos. |
| 4 | 13–18 s | La cocina se transforma | Paso tres: la vendes a su nuevo valor. |
| 5 | 18–22 s | Casa terminada al atardecer | La ganancia está en comprar bien y renovar con inteligencia. |
| 6 | 22–26 s | Mano entregando llaves | Yo te ayudo a encontrar la propiedad correcta. |
| 7 | 26–30 s | Tarjeta final con tu marca | Angel Corredera, el realtor de tu familia. Llama al 786-309-0210. |

## Lo que tú tienes que hacer (una sola vez)

### 1. Google Colab de pago
- Entra a colab.research.google.com con tu cuenta de Google.
- Contrata **Colab Pro** (~$10/mes, 100 unidades de cómputo). Este video gasta aprox. **7 unidades** con GPU L4 (~80 min). Son estimados, no garantizados.

### 2. Cuenta de Hugging Face (gratis)
Varios modelos piden aceptar su licencia antes de descargarlos.
1. Crea una cuenta en huggingface.co.
2. Abre estas dos páginas y dale a **"Agree and access repository"**:
   - huggingface.co/Lightricks/LTX-2.5
   - huggingface.co/black-forest-labs/flux-3-image-klein-comfy
3. Ve a Settings → Access Tokens → **New token** (tipo *Read*) y cópialo.
4. En Colab, en el ícono de la llave 🔑 (Secrets) de la izquierda, crea un secreto llamado **HF_TOKEN**, pega el token y activa "Notebook access".

### 3. Correr el cuaderno
1. En Colab: **Archivo → Subir cuaderno** → elige `fix-and-flip-reel.ipynb`.
2. **Entorno de ejecución → Cambiar tipo de entorno → GPU L4** → Guardar.
3. **Entorno de ejecución → Ejecutar todo.** Acepta los permisos que te pida.
4. Espera (aprox. 1 h 20 min). La celda 10 descarga un archivo `...-outputs.zip`.
5. **Ejecuta la celda 11** para apagar la GPU y dejar de gastar.

### 4. Mándame el resultado
Sube aquí el archivo `fix-and-flip-reel-google-colab-outputs.zip`. Yo reviso cada toma, armo el video con la voz, la música, los subtítulos y tu tarjeta final, y te lo entrego listo para publicar.

## Avisos importantes
- **Licencia comercial:** el modelo de video LTX-2.5 usa la *Lightricks LTX-2 Community License*, que no es totalmente libre. Léela en la página de Hugging Face antes de aceptar; tiene condiciones según el tamaño de tu empresa.
- **Contenido ilustrativo:** la casa del video es generada por IA. No la presentes como una propiedad real en venta.
- **Herramienta en etapa temprana:** el autor de estas skills dice que muchas no se han probado de principio a fin. Si una celda falla, mándame una captura del error.
