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
    "from-emerald-500/40 via-emerald-300/15 to-transparent text-emerald-50 glow-banker",
  Player:
    "from-blue-500/40 via-blue-300/15 to-transparent text-blue-50 glow-player",
  Tie: "from-amber-500/40 via-amber-300/15 to-transparent text-amber-50 glow-tie",
};

const chipMap: Record<string, string> = {
  B: "bg-emerald-500/20 text-emerald-100 ring-2 ring-emerald-400/40 font-semibold",
  P: "bg-blue-500/20 text-blue-100 ring-2 ring-blue-400/40 font-semibold",
  T: "bg-amber-500/20 text-amber-100 ring-2 ring-amber-400/40 font-semibold",
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
    <label className="space-y-2 block">
      <span className="text-sm font-semibold text-slate-300 uppercase tracking-wider">{label}</span>
      <input
        className="w-full rounded-xl border border-emerald-400/20 bg-slate-950/40 px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-slate-500 focus:border-emerald-400/60 focus:bg-slate-900/60 focus:ring-2 focus:ring-emerald-400/20 hover:border-emerald-400/40"
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.15),transparent_30%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.1),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(252,211,77,0.08),transparent_28%)]" />

        <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="animate-slide-up rounded-3xl glass-effect p-8 xl:p-12">
            <div className="mb-12 flex flex-col gap-4">
              <div className="inline-flex w-fit rounded-2xl bg-gradient-to-br from-emerald-400/20 to-blue-400/10 px-6 py-4 shadow-lg shadow-emerald-500/10">
                <BrandLogo size="md" tone="dark" />
              </div>
              <p className="text-xs uppercase tracking-widest font-bold bg-gradient-to-r from-emerald-400 via-blue-400 to-amber-400 bg-clip-text text-transparent">
                🎰 BACBO PREDICTOR
              </p>
            </div>

            <div className="space-y-6">
              <span className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-emerald-300 animate-pulse-glow">
                ✓ Motor automático
              </span>
              <h1 className="max-w-xl font-display text-5xl leading-tight text-white sm:text-6xl bg-gradient-to-b from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Previsões inteligentes em tempo real
              </h1>
              <p className="max-w-xl text-base leading-7 text-slate-300">
                Análise automática com cores didáticas. Verde = Banker, Azul = Player, Dourado = Empate. Confiança em tempo real com indicadores visuais.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="card-hover rounded-2xl border border-emerald-400/20 bg-emerald-500/8 p-5 group">
                <p className="text-xs uppercase tracking-widest text-emerald-300/70 group-hover:text-emerald-300 transition">
                  Banker
                </p>
                <strong className="mt-3 block text-3xl font-semibold text-emerald-300 group-hover:text-emerald-200 transition">
                  Verde
                </strong>
              </div>
              <div className="card-hover rounded-2xl border border-blue-400/20 bg-blue-500/8 p-5 group">
                <p className="text-xs uppercase tracking-widest text-blue-300/70 group-hover:text-blue-300 transition">
                  Player
                </p>
                <strong className="mt-3 block text-3xl font-semibold text-blue-300 group-hover:text-blue-200 transition">
                  Azul
                </strong>
              </div>
              <div className="card-hover rounded-2xl border border-amber-400/20 bg-amber-500/8 p-5 group">
                <p className="text-xs uppercase tracking-widest text-amber-300/70 group-hover:text-amber-300 transition">
                  Empate
                </p>
                <strong className="mt-3 block text-3xl font-semibold text-amber-300 group-hover:text-amber-200 transition">
                  Dourado
                </strong>
              </div>
            </div>
          </section>

          <section className="animate-slide-up rounded-3xl glass-effect p-8 xl:p-10 [animation-delay:100ms]">
            <div className="space-y-6">
              <div>
                <p className="text-xs uppercase tracking-widest font-bold text-emerald-400">
                  Acesso Classe'A
                </p>
                <h2 className="mt-3 font-display text-4xl text-white">
                  Entrar agora
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
                  placeholder="seu@email.com"
                  type="email"
                />
                <Field label="Senha" placeholder="••••••••" type="password" />

                <button
                  className="w-full mt-6 btn-interactive rounded-xl bg-gradient-to-r from-emerald-500 via-blue-500 to-amber-400 px-4 py-3 font-bold text-slate-950 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/50"
                  type="submit"
                >
                  Acessar Painel 🚀
                </button>
              </form>

              <p className="text-xs text-slate-400 text-center">
                Dados criptografados • API segura • Sem logs
              </p>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 rounded-2xl glass-effect p-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-gradient-to-br from-emerald-400/20 to-blue-400/10 px-4 py-3 shadow-lg">
              <BrandLogo size="sm" tone="dark" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest font-bold text-emerald-400">
                🎰 Painel Ativo
              </p>
              <p className="text-sm text-slate-300 mt-1">
                Bac Bo Predictor Premium
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-emerald-400/30 bg-emerald-500/15 px-4 py-2 text-xs font-bold uppercase tracking-widest text-emerald-300 animate-pulse-glow flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Online
            </span>
            <button
              className="btn-interactive rounded-xl border border-slate-700 bg-slate-950/40 px-5 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-900/60 hover:border-slate-600"
              onClick={() => setIsAuthenticated(false)}
              type="button"
            >
              Sair
            </button>
          </div>
        </header>

        <main className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <section className={`rounded-3xl border-2 ${
            activeSignal.side === "Banker"
              ? "border-emerald-400/40 bg-gradient-to-br from-emerald-500/10 via-slate-900 to-slate-950"
              : activeSignal.side === "Player"
                ? "border-blue-400/40 bg-gradient-to-br from-blue-500/10 via-slate-900 to-slate-950"
                : "border-amber-400/40 bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950"
          } p-8 shadow-2xl backdrop-blur`}>
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  💨 Sinal em Tempo Real
                </p>
                <h1 className={`mt-4 max-w-lg font-display text-6xl sm:text-7xl leading-tight font-bold ${
                  activeSignal.side === "Banker"
                    ? "text-emerald-300"
                    : activeSignal.side === "Player"
                      ? "text-blue-300"
                      : "text-amber-300"
                }`}>
                  {activeSignal.side}
                </h1>
                <p className="mt-4 max-w-lg text-base leading-7 text-slate-300">
                  {activeSignal.summary}
                </p>
              </div>

              <div className={`card-hover rounded-2xl border-2 p-6 text-center min-w-fit ${
                activeSignal.side === "Banker"
                  ? "border-emerald-400/50 bg-emerald-500/20 glow-banker"
                  : activeSignal.side === "Player"
                    ? "border-blue-400/50 bg-blue-500/20 glow-player"
                    : "border-amber-400/50 bg-amber-500/20 glow-tie"
              }`}>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-300">
                  Confiança
                </p>
                <strong className={`mt-3 block text-5xl font-black ${
                  activeSignal.side === "Banker"
                    ? "text-emerald-300"
                    : activeSignal.side === "Player"
                      ? "text-blue-300"
                      : "text-amber-300"
                }`}>
                  {activeSignal.confidence.toFixed(1)}%
                </strong>
              </div>
            </div>

            <div
              className={`rounded-3xl border-2 bg-gradient-to-br ${toneMap[activeSignal.side]} p-8 shadow-xl`}
            >
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div className="flex-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-white/60">
                    {activeSignal.label}
                  </p>
                  <h2 className={`mt-3 font-display text-4xl sm:text-5xl font-bold ${
                    activeSignal.side === "Banker"
                      ? "text-emerald-100"
                      : activeSignal.side === "Player"
                        ? "text-blue-100"
                        : "text-amber-100"
                  }`}>
                    {activeSignal.rhythm}
                  </h2>
                </div>
                <span className={`card-hover rounded-2xl border-2 px-6 py-3 text-sm font-bold whitespace-nowrap ${
                  activeSignal.side === "Banker"
                    ? "border-emerald-400/50 bg-emerald-500/20 text-emerald-200"
                    : activeSignal.side === "Player"
                      ? "border-blue-400/50 bg-blue-500/20 text-blue-200"
                      : "border-amber-400/50 bg-amber-500/20 text-amber-200"
                }`}>
                  ⏱️ {activeSignal.window}
                </span>
              </div>

              <div className="mt-8">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-white/70">Progresso do Sinal</span>
                  <span className="text-xs font-bold text-white/50">{confidenceWidth}</span>
                </div>
                <div className={`h-3 rounded-full bg-black/30 overflow-hidden border border-white/10`}>
                  <div
                    className={`h-3 rounded-full transition-all duration-500 bg-gradient-to-r ${
                      activeSignal.side === "Banker"
                        ? "from-emerald-400 to-emerald-600"
                        : activeSignal.side === "Player"
                          ? "from-blue-400 to-blue-600"
                          : "from-amber-400 to-amber-600"
                    }`}
                    style={{ width: confidenceWidth }}
                  />
                </div>
              </div>

              <div className="mt-8 grid grid-cols-6 gap-3">
                {activeSignal.sequence.map((item, index) => (
                  <span
                    className={`card-hover inline-flex h-14 items-center justify-center rounded-xl text-base font-black transition-transform duration-300 [animation-delay:${index * 50}ms] ${chipMap[item]}`}
                    key={`${item}-${index}`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <aside className="grid gap-6">
            <section className="rounded-2xl glass-effect p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                ⚙️ Painel Rápido
              </p>
              <div className="mt-5 grid gap-3">
                <div className="card-hover rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-4 hover:bg-emerald-500/15">
                  <span className="text-xs font-semibold text-emerald-300/70">Modo</span>
                  <strong className="mt-2 block text-2xl text-emerald-200 font-bold">
                    Automático 🤖
                  </strong>
                </div>
                <div className="card-hover rounded-xl border border-blue-400/20 bg-blue-500/10 p-4 hover:bg-blue-500/15">
                  <span className="text-xs font-semibold text-blue-300/70">Mesa</span>
                  <strong className="mt-2 block text-2xl text-blue-200 font-bold">
                    Premium #4
                  </strong>
                </div>
                <div className="card-hover rounded-xl border border-amber-400/20 bg-amber-500/10 p-4 hover:bg-amber-500/15">
                  <span className="text-xs font-semibold text-amber-300/70">Atualização</span>
                  <strong className="mt-2 block text-2xl text-amber-200 font-bold">
                    4.8s ⚡
                  </strong>
                </div>
              </div>
            </section>

            <section className="rounded-2xl glass-effect p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-blue-400">
                🔧 Status Motor
              </p>
              <div className="mt-5 space-y-3">
                <div className="card-hover flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900/40 px-4 py-3 hover:bg-slate-900/60">
                  <span className="text-sm font-semibold text-slate-300">Leitura da Mesa</span>
                  <span className="inline-flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span className="text-sm font-bold text-emerald-300">
                      Estável
                    </span>
                  </span>
                </div>
                <div className="card-hover flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900/40 px-4 py-3 hover:bg-slate-900/60">
                  <span className="text-sm font-semibold text-slate-300">Filtro Ruído</span>
                  <span className="inline-flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span className="text-sm font-bold text-emerald-300">
                      Ativo
                    </span>
                  </span>
                </div>
                <div className="card-hover flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900/40 px-4 py-3 hover:bg-slate-900/60">
                  <span className="text-sm font-semibold text-slate-300">Sinal Liberado</span>
                  <span className="inline-flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span className="text-sm font-bold text-emerald-300">
                      ✓ Sim
                    </span>
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
