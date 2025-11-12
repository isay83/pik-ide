// src/components/ProductTour/ProductTour.tsx
import { useCallback } from 'react';
import Joyride, { STATUS } from 'react-joyride';
import type { CallBackProps, Step } from 'react-joyride';

interface ProductTourProps {
  run: boolean;
  onTourEnd: () => void;
  onStepAction?: (stepIndex: number, action: string) => void;
}

interface ProductTourProps {
  run: boolean;
  onTourEnd: () => void;
}

const steps: Step[] = [
  {
    target: 'body',
    content: (
      <div>
        <h2 className="text-xl font-bold mb-2">¡Bienvenido a PIK Visual! 🎉</h2>
        <p>Te voy a enseñar paso a paso cómo crear tu primer programa. Haremos un "¡Hola Mundo!" que se repita 5 veces.</p>
        <p className="mt-2 text-sm text-gray-600">Duración aproximada: 5 minutos</p>
      </div>
    ),
    placement: 'center',
  },
  {
    target: 'h1',
    content: (
      <div>
        <h3 className="text-lg font-bold mb-2">PIK Visual</h3>
        <p>Esta es una herramienta educativa que te permite aprender programación de forma visual usando bloques, similar a Scratch.</p>
      </div>
    ),
    placement: 'bottom',
  },
  {
    target: '[data-tour="blocks-button"]',
    content: (
      <div>
        <h3 className="text-lg font-bold mb-2">Paso 1: Abrir la Paleta 🎨</h3>
        <p><strong>👆 Haz clic en "☰ Bloques"</strong> para abrir la paleta con todos los bloques disponibles.</p>
        <p className="mt-2 text-sm text-gray-600">Esto te mostrará las categorías de bloques que puedes usar.</p>
      </div>
    ),
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '[data-tour="blocks-editor"]',
    content: (
      <div>
        <h3 className="text-lg font-bold mb-2">Paso 2: Buscar el bloque "repetir" 🔄</h3>
        <p>En la paleta que acabas de abrir, busca la categoría <strong>"🧠 Control de flujo"</strong> y encuentra el bloque <strong>"🧱 repetir"</strong>.</p>
        <p className="mt-2"><strong>👆 Arrastra</strong> el bloque "repetir" al área de trabajo (el espacio grande gris).</p>
        <p className="mt-2 text-sm text-gray-600">Este bloque nos permitirá repetir acciones varias veces.</p>
      </div>
    ),
    placement: 'right',
    disableBeacon: true,
  },
  {
    target: '[data-tour="blocks-editor"]',
    content: (
      <div>
        <h3 className="text-lg font-bold mb-2">Paso 3: Agregar el número 5 🔢</h3>
        <p>Ahora necesitas decirle al bloque "repetir" cuántas veces debe repetirse. Ve a la categoría <strong>"🔢 Valores"</strong> y arrastra un bloque <strong>"🧱 numero"</strong>.</p>
        <p className="mt-2"><strong>👆 Conecta</strong> el bloque número en el espacio que dice "veces" del bloque repetir.</p>
        <p className="mt-2"><strong>✏️ Cambia</strong> el valor del número a <strong>5</strong> haciendo clic en él.</p>
      </div>
    ),
    placement: 'right',
    disableBeacon: true,
  },
  {
    target: '[data-tour="blocks-editor"]',
    content: (
      <div>
        <h3 className="text-lg font-bold mb-2">Paso 4: Agregar bloque "mostrar" �️</h3>
        <p>Ahora vamos a decirle qué queremos mostrar. Ve a la categoría <strong>"⚙️ Acciones"</strong> y arrastra un bloque <strong>"🧱 mostrar"</strong>.</p>
        <p className="mt-2"><strong>👆 Conecta</strong> el bloque "mostrar" DENTRO del bloque "repetir" (en el área que aparece después de "veces:").</p>
        <p className="mt-2 text-sm text-gray-600">Esto hará que la acción "mostrar" se repita 5 veces.</p>
      </div>
    ),
    placement: 'right',
    disableBeacon: true,
  },
  {
    target: '[data-tour="blocks-editor"]',
    content: (
      <div>
        <h3 className="text-lg font-bold mb-2">Paso 5: Agregar el texto "¡Hola Mundo!" 📝</h3>
        <p>Por último, necesitamos decirle qué texto mostrar. Ve a la categoría <strong>"🔢 Valores"</strong> y arrastra un bloque <strong>"🧱 texto"</strong>.</p>
        <p className="mt-2"><strong>👆 Conecta</strong> el bloque "texto" al bloque "mostrar".</p>
        <p className="mt-2"><strong>✏️ Cambia</strong> el texto a <strong>"¡Hola Mundo!"</strong> haciendo clic en él.</p>
      </div>
    ),
    placement: 'right',
    disableBeacon: true,
  },
  {
    target: '[data-tour="code-view"]',
    content: (
      <div>
        <h3 className="text-lg font-bold mb-2">¡Mira tu código! 👀</h3>
        <p>¡Excelente! Fíjate cómo tus bloques se han convertido automáticamente en código PIK.</p>
        <p className="mt-2">Deberías ver algo como:</p>
        <pre className="bg-gray-100 p-2 rounded text-sm mt-2">
{`repetir 5 veces:
  mostrar "¡Hola Mundo!"`}
        </pre>
      </div>
    ),
    placement: 'left',
  },
  {
    target: '[data-tour="run-button"]',
    content: (
      <div>
        <h3 className="text-lg font-bold mb-2">Paso 6: ¡Ejecutar el programa! ▶️</h3>
        <p><strong>👆 Haz clic en "Ejecutar"</strong> para ver tu programa en acción.</p>
        <p className="mt-2 text-sm text-gray-600">¡Este es el momento más emocionante!</p>
      </div>
    ),
    placement: 'left',
    disableBeacon: true,
  },
  {
    target: '[data-tour="console"]',
    content: (
      <div>
        <h3 className="text-lg font-bold mb-2">¡Felicidades! 🎉</h3>
        <p>¡Has creado tu primer programa! Deberías ver "¡Hola Mundo!" apareciendo 5 veces en la consola.</p>
        <p className="mt-2">Ya sabes los conceptos básicos:</p>
        <ul className="mt-2 text-sm list-disc list-inside">
          <li>📦 Usar bloques de la paleta</li>
          <li>🔗 Conectar bloques entre sí</li>
          <li>▶️ Ejecutar tu programa</li>
          <li>👀 Ver los resultados</li>
        </ul>
        <p className="mt-2 text-sm font-medium">¡Ahora puedes experimentar con otros bloques!</p>
      </div>
    ),
    placement: 'left',
  },
];

export default function ProductTour({ run, onTourEnd }: ProductTourProps) {
  const handleJoyrideCallback = useCallback(
    (data: CallBackProps) => {
      const { status } = data;

      // Si el tour termina o se omite
      if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
        onTourEnd();
      }
    },
    [onTourEnd]
  );

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showSkipButton
      showProgress
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#3b82f6',
          width: 400,
          zIndex: 1000,
        },
        tooltip: {
          borderRadius: 12,
          padding: 20,
        },
        tooltipContent: {
          padding: '0 8px',
        },
        buttonNext: {
          backgroundColor: '#3b82f6',
          borderRadius: 8,
          padding: '8px 16px',
        },
        buttonBack: {
          color: '#6b7280',
          marginRight: 8,
        },
        buttonSkip: {
          color: '#9ca3af',
        },
      }}
      locale={{
        back: '⬅️ Anterior',
        close: '❌ Cerrar',
        last: '🎉 ¡Finalizar!',
        next: '➡️ Siguiente',
        skip: '⏭️ Saltar tour',
      }}
    />
  );
}