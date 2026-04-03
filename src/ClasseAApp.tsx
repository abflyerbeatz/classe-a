import { useEffect, useMemo, useState } from "react";
type PredictionSide = "Banker" | "Player" | "Tie";
type BrandTone = "light" | "dark";
type BrandSize = "sm" | "md" | "lg";

type Signal = {
  side: PredictionSide;
  confidence: number;
  label: string;
  summary: string;
  rhythm: string;
  window: string;
  sequence: string[];
};

const signals: Signal[] = [
  {
    side: "Banker",
    confidence: 92.8,
    label: "Sinal assinatura",
    summary: "Leitura premium validada para continuidade curta e entrada limpa.",
    rhythm: "Mesa serena",
    window: "00:18",
    sequence: ["B", "B", "P", "B", "B", "B"],
  },
  {
    side: "Player",
    confidence: 91.6,
    label: "Virada filtrada",
    summary: "Mudanca de forca detectada com baixo ruido e transicao suave.",
    rhythm: "Pressao fria",
    window: "00:22",
    sequence: ["P", "P", "T", "P", "B", "P"],
  },
  {
    side: "Banker",
    confidence: 93.4,
    label: "Ritmo consolidado",
    summary: "Motor Classe'A confirmou repeticao curta com leitura segura.",
    rhythm: "Canal nobre",
    window: "00:14",
    sequence: ["B", "B", "B", "T", "B", "P"],
  },
];

const toneMap: Record<PredictionSide, string> = {
  Banker:
    "from-[#caa46a]/35 via-[#f3e1bf]/10 to-transparent text-[#fff5e8]",
  Player:
    "from-[#8f9daa]/30 via-[#d7e0e7]/10 to-transparent text-[#eef2f5]",
  Tie: "from-[#8c6c48]/30 via-[#d6be9a]/10 to-transparent text-[#faefe1]",
};

const chipMap: Record<string, string> = {
  B: "bg-[#caa46a]/18 text-[#f6dfb7] ring-1 ring-[#f6dfb7]/20",
  P: "bg-[#9baab8]/18 text-[#dfe8ef] ring-1 ring-[#dfe8ef]/20",
  T: "bg-[#9a7b57]/18 text-[#f1dcc0] ring-1 ring-[#f1dcc0]/20",
};

function Field({
  label,
  type = "text",
  placeholder,
}: {
  label: string;
  type?: string;
  placeholder: string;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-stone-300">{label}</span>
      <input
        className="w-full rounded-[1.35rem] border border-[#f5e7d0]/12 bg-[#fff7ed]/4 px-4 py-3 text-sm text-[#fff8ef] outline-none transition placeholder:text-stone-500 focus:border-[#e1bc85]/45 focus:bg-[#fff7ed]/8"
        type={type}
        placeholder={placeholder}
      />
    </label>
  );
}

function BrandLogo({
  tone = "light",
  size = "md",
  className = "",
}: {
  tone?: BrandTone;
  size?: BrandSize;
  className?: string;
}) {
  const palette =
    tone === "dark"
      ? {
          text: "text-[#161311]",
          star: "#161311",
          swoosh: "#161311",
        }
      : {
          text: "text-[#fff4e6]",
          star: "#e0bb82",
          swoosh: "#f6ead7",
        };

  const sizeMap: Record<
    BrandSize,
    {
      wrap: string;
      word: string;
      star: string;
      swoosh: string;
    }
  > = {
    sm: {
      wrap: "pr-5",
      word: "text-[2.4rem] sm:text-[3rem]",
      star: "-right-1 top-1 h-5 w-5 sm:h-6 sm:w-6",
      swoosh: "-mt-2 ml-2 h-7 w-[8.5rem] sm:w-[10.75rem]",
    },
    md: {
      wrap: "pr-7",
      word: "text-[3.1rem] sm:text-[4.25rem]",
      star: "-right-1 top-1 h-6 w-6 sm:h-7 sm:w-7",
      swoosh: "-mt-3 ml-3 h-10 w-[11.5rem] sm:w-[15.75rem]",
    },
    lg: {
      wrap: "pr-8 sm:pr-10",
      word: "text-[4.6rem] sm:text-[6.3rem]",
      star: "-right-2 top-2 h-7 w-7 sm:h-10 sm:w-10",
      swoosh: "-mt-4 ml-4 h-12 w-[15.5rem] sm:w-[22rem]",
    },
  };

  const metrics = sizeMap[size];

  return (
    <div className={`inline-flex flex-col ${className}`}>
      <div className={`relative w-fit ${metrics.wrap}`}>
        <span className={`font-logo leading-none ${metrics.word} ${palette.text}`}>
          Classe&apos;A
        </span>
        <svg
          aria-hidden="true"
          className={`absolute ${metrics.star}`}
          viewBox="0 0 64 64"
        >
          <path
            d="M32 6L38 26L58 32L38 38L32 58L26 38L6 32L26 26L32 6Z"
            fill={palette.star}
          />
        </svg>
      </div>
      <svg
        aria-hidden="true"
        className={metrics.swoosh}
        preserveAspectRatio="none"
        viewBox="0 0 520 70"
      >
        <path
          d="M20 44C132 11 286 2 508 27"
          fill="none"
          opacity="0.92"
          stroke={palette.swoosh}
          strokeLinecap="round"
          strokeWidth="10"
        />
        <path
          d="M22 57C182 31 340 30 500 39"
          fill="none"
          opacity="0.56"
          stroke={palette.swoosh}
          strokeLinecap="round"
          strokeWidth="3.5"
        />
      </svg>
    </div>
  );
}

export default function ClasseAApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [signalIndex, setSignalIndex] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setSignalIndex((current) => (current + 1) % signals.length);
    }, 4800);

    return () => window.clearInterval(interval);
  }, [isAuthenticated]);

  const activeSignal = useMemo(() => signals[signalIndex], [signalIndex]);
  const confidenceWidth = `${activeSignal.confidence}%`;

  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(224,187,130,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,242,221,0.08),transparent_24%)]" />

        <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <section className="rounded-[2rem] border border-[#f5e7d0]/10 bg-[#fff7ed]/6 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.42)] backdrop-blur xl:p-10">
            <div className="mb-10 flex flex-col gap-4">
              <div className="inline-flex w-fit rounded-[1.95rem] bg-[#fff8ef] px-6 py-5 shadow-[0_18px_45px_rgba(255,247,237,0.1)]">
                <BrandLogo size="md" tone="dark" />
              </div>
              <p className="text-sm uppercase tracking-[0.34em] text-[#c9a56f]">
                Identidade premium
              </p>
            </div>

            <div className="space-y-5">
              <span className="inline-flex rounded-full border border-[#d7b27b]/25 bg-[#d7b27b]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-[#f1d7b0]">
                Classe&apos;A signature
              </span>
              <h1 className="max-w-xl font-display text-5xl leading-none text-[#fff7ef] sm:text-6xl">
                A marca do app agora conduz toda a experiencia visual.
              </h1>
              <p className="max-w-xl text-base leading-7 text-stone-300">
                O acesso, o painel e os destaques passam a seguir uma linha mais
                elegante, com leitura limpa e presenca forte da identidade
                Classe&apos;A.
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-[#f5e7d0]/8 bg-[#0f0a08]/40 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
                  Assinatura
                </p>
                <strong className="mt-2 block text-3xl font-semibold text-[#f0d6aa]">
                  Classe&apos;A
                </strong>
              </div>
              <div className="rounded-3xl border border-[#f5e7d0]/8 bg-[#0f0a08]/40 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
                  Ambiente
                </p>
                <strong className="mt-2 block text-3xl font-semibold text-[#ece5db]">
                  Luxo clean
                </strong>
              </div>
              <div className="rounded-3xl border border-[#f5e7d0]/8 bg-[#0f0a08]/40 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
                  Motor
                </p>
                <strong className="mt-2 block text-3xl font-semibold text-[#d5b287]">
                  Auto sync
                </strong>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-[#f5e7d0]/10 bg-[#140f0d]/80 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.48)] backdrop-blur xl:p-8">
            <div className="space-y-5">
              <div>
                <p className="text-sm uppercase tracking-[0.26em] text-stone-500">
                  Acesso Classe&apos;A
                </p>
                <h2 className="mt-2 font-display text-4xl text-[#fff7ef]">
                  Entrar no painel premium
                </h2>
              </div>

              <form
                className="space-y-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  setIsAuthenticated(true);
                }}
              >
                <Field
                  label="Email"
                  placeholder="contato@classea.app"
                  type="email"
                />
                <Field label="Senha" placeholder="********" type="password" />

                <button
                  className="w-full rounded-[1.35rem] bg-gradient-to-r from-[#f8e6c8] via-[#e0bb82] to-[#c89b63] px-4 py-3 font-semibold text-[#181311] transition hover:scale-[1.01]"
                  type="submit"
                >
                  Entrar agora
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col gap-4 rounded-[2rem] border border-[#f5e7d0]/10 bg-[#fff7ed]/6 p-5 shadow-[0_24px_100px_rgba(0,0,0,0.35)] backdrop-blur md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-[1.5rem] bg-[#fff8ef] px-4 py-3 shadow-[0_12px_40px_rgba(255,247,237,0.08)]">
              <BrandLogo size="sm" tone="dark" />
            </div>
            <p className="text-sm text-stone-400">
              Painel premium com identidade Classe&apos;A
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-[#d7b27b]/15 bg-[#d7b27b]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[#f1d7b0]">
              Online agora
            </span>
            <button
              className="rounded-full border border-[#f5e7d0]/10 bg-[#fff7ed]/6 px-4 py-2 text-sm text-[#f8efe0] transition hover:bg-[#fff7ed]/10"
              onClick={() => setIsAuthenticated(false)}
              type="button"
            >
              Sair
            </button>
          </div>
        </header>

        <main className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
          <section className="rounded-[2rem] border border-[#f5e7d0]/10 bg-[#140f0d]/70 p-5 shadow-[0_24px_100px_rgba(0,0,0,0.35)] backdrop-blur">
            <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">
                  Predicao automatica
                </p>
                <h1 className="mt-3 max-w-lg font-display text-5xl leading-none text-[#fff7ef] sm:text-6xl">
                  {activeSignal.side}
                </h1>
                <p className="mt-3 max-w-xl text-base leading-7 text-stone-300">
                  {activeSignal.summary}
                </p>
              </div>

              <div className="rounded-[1.75rem] border border-[#f5e7d0]/10 bg-[#fff7ed]/5 px-5 py-4">
                <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
                  Assertividade visual
                </p>
                <strong className="mt-2 block text-5xl font-semibold text-[#f0d6aa]">
                  {activeSignal.confidence.toFixed(1)}%
                </strong>
              </div>
            </div>

            <div
              className={`rounded-[2rem] border border-[#f5e7d0]/10 bg-gradient-to-br ${toneMap[activeSignal.side]} p-6`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="mb-3 opacity-90">
                    <BrandLogo size="sm" />
                  </div>
                  <p className="text-xs uppercase tracking-[0.28em] text-[#f9f0e4]/72">
                    {activeSignal.label}
                  </p>
                  <h2 className="mt-2 font-display text-4xl text-[#fffaf2]">
                    {activeSignal.rhythm}
                  </h2>
                </div>
                <span className="rounded-full bg-black/18 px-4 py-2 text-sm text-[#fffaf2] ring-1 ring-white/10">
                  Janela {activeSignal.window}
                </span>
              </div>

              <div className="mt-6 h-3 rounded-full bg-black/20">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-[#f8e6c8] via-[#deb982] to-[#b98958]"
                  style={{ width: confidenceWidth }}
                />
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {activeSignal.sequence.map((item, index) => (
                  <span
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-bold ${chipMap[item]}`}
                    key={`${item}-${index}`}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <aside className="grid gap-5">
            <section className="rounded-[2rem] border border-[#f5e7d0]/10 bg-[#fff7ed]/6 p-5 shadow-[0_24px_100px_rgba(0,0,0,0.35)] backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">
                Painel rapido
              </p>
              <div className="mt-4 grid gap-3">
                <div className="rounded-[1.5rem] border border-[#f5e7d0]/10 bg-[#0f0a08]/50 p-4">
                  <span className="text-sm text-stone-400">Modo</span>
                  <strong className="mt-1 block text-2xl text-[#fff7ef]">
                    Automatico
                  </strong>
                </div>
                <div className="rounded-[1.5rem] border border-[#f5e7d0]/10 bg-[#0f0a08]/50 p-4">
                  <span className="text-sm text-stone-400">Mesa ativa</span>
                  <strong className="mt-1 block text-2xl text-[#fff7ef]">
                    Premium 04
                  </strong>
                </div>
                <div className="rounded-[1.5rem] border border-[#f5e7d0]/10 bg-[#0f0a08]/50 p-4">
                  <span className="text-sm text-stone-400">Atualizacao</span>
                  <strong className="mt-1 block text-2xl text-[#fff7ef]">4.8s</strong>
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-[#f5e7d0]/10 bg-[#140f0d]/78 p-5 shadow-[0_24px_100px_rgba(0,0,0,0.35)] backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">
                Estado do motor
              </p>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between rounded-2xl bg-[#fff7ed]/5 px-4 py-3">
                  <span className="text-sm text-stone-300">Leitura da mesa</span>
                  <span className="text-sm font-semibold text-[#f1d7b0]">
                    Estavel
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-[#fff7ed]/5 px-4 py-3">
                  <span className="text-sm text-stone-300">Filtro de ruido</span>
                  <span className="text-sm font-semibold text-[#e6e8eb]">
                    Ativo
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-[#fff7ed]/5 px-4 py-3">
                  <span className="text-sm text-stone-300">Sinal liberado</span>
                  <span className="text-sm font-semibold text-[#f1d7b0]">
                    Sim
                  </span>
                </div>
              </div>
            </section>
          </aside>
        </main>
      </div>
    </div>
  );
}
