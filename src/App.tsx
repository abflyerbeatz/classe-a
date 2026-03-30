import { useEffect, useMemo, useState } from "react";

type AuthMode = "login" | "register";
type PredictionSide = "Banker" | "Player" | "Tie";

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
    label: "Entrada premium",
    summary: "Fluxo verde e leitura limpa para continuidade curta.",
    rhythm: "Mesa serena",
    window: "00:18",
    sequence: ["B", "B", "P", "B", "B", "B"],
  },
  {
    side: "Player",
    confidence: 91.6,
    label: "Virada suave",
    summary: "Mudanca de forca identificada com baixa interferencia.",
    rhythm: "Pressao azul",
    window: "00:22",
    sequence: ["P", "P", "T", "P", "B", "P"],
  },
  {
    side: "Banker",
    confidence: 93.4,
    label: "Ritmo consolidado",
    summary: "Motor automatico validou janela de repeticao curta.",
    rhythm: "Canal forte",
    window: "00:14",
    sequence: ["B", "B", "B", "T", "B", "P"],
  },
];

const toneMap: Record<PredictionSide, string> = {
  Banker:
    "from-emerald-300/28 via-emerald-200/10 to-transparent text-emerald-100",
  Player: "from-sky-300/28 via-sky-200/10 to-transparent text-sky-100",
  Tie: "from-amber-300/28 via-amber-200/10 to-transparent text-amber-100",
};

const chipMap: Record<string, string> = {
  B: "bg-emerald-400/18 text-emerald-200 ring-1 ring-emerald-200/20",
  P: "bg-sky-400/18 text-sky-200 ring-1 ring-sky-200/20",
  T: "bg-amber-300/18 text-amber-100 ring-1 ring-amber-100/20",
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
      <span className="text-sm font-medium text-slate-300">{label}</span>
      <input
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-300/40 focus:bg-white/8"
        type={type}
        placeholder={placeholder}
      />
    </label>
  );
}

export default function App() {
  const [authMode, setAuthMode] = useState<AuthMode>("login");
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
    const isLogin = authMode === "login";

    return (
      <div className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(52,211,153,0.18),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(125,211,252,0.16),transparent_22%)]" />

        <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_30px_100px_rgba(2,12,27,0.45)] backdrop-blur xl:p-10">
            <div className="mb-10 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-300/18 text-lg font-bold text-emerald-200">
                C
              </div>
              <div>
                <p className="font-display text-xl tracking-wide text-white">
                  CLASSE A
                </p>
                <p className="text-sm text-slate-400">Bac Bo Predictor</p>
              </div>
            </div>

            <div className="space-y-5">
              <span className="inline-flex rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-emerald-200">
                Fluxo automatico
              </span>
              <h1 className="max-w-xl font-display text-5xl leading-none text-white sm:text-6xl">
                Predicao automatica com visual limpo e decisao rapida.
              </h1>
              <p className="max-w-xl text-base leading-7 text-slate-300">
                Login discreto, painel profissional e sinais em destaque. O foco
                aqui e mostrar a melhor janela sem poluir a tela com excesso de
                informacao.
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/8 bg-slate-950/40 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  Indicador
                </p>
                <strong className="mt-2 block text-3xl font-semibold text-emerald-200">
                  92%+
                </strong>
              </div>
              <div className="rounded-3xl border border-white/8 bg-slate-950/40 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  Tela
                </p>
                <strong className="mt-2 block text-3xl font-semibold text-sky-200">
                  Clean
                </strong>
              </div>
              <div className="rounded-3xl border border-white/8 bg-slate-950/40 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  Motor
                </p>
                <strong className="mt-2 block text-3xl font-semibold text-amber-100">
                  Auto sync
                </strong>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-[0_30px_100px_rgba(2,12,27,0.5)] backdrop-blur xl:p-8">
            <div className="mb-6 flex rounded-full bg-white/5 p-1 text-sm">
              <button
                className={`flex-1 rounded-full px-4 py-2 transition ${
                  isLogin ? "bg-white text-slate-900" : "text-slate-300"
                }`}
                onClick={() => setAuthMode("login")}
                type="button"
              >
                Login
              </button>
              <button
                className={`flex-1 rounded-full px-4 py-2 transition ${
                  !isLogin ? "bg-white text-slate-900" : "text-slate-300"
                }`}
                onClick={() => setAuthMode("register")}
                type="button"
              >
                Cadastro
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <p className="text-sm uppercase tracking-[0.26em] text-slate-400">
                  {isLogin ? "Acesso rapido" : "Criar acesso"}
                </p>
                <h2 className="mt-2 font-display text-4xl text-white">
                  {isLogin ? "Entrar no painel" : "Abrir sua conta"}
                </h2>
              </div>

              <form
                className="space-y-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  setIsAuthenticated(true);
                }}
              >
                {!isLogin && (
                  <Field label="Nome" placeholder="Seu nome premium" />
                )}
                <Field
                  label="Email"
                  placeholder="seuemail@classea.com"
                  type="email"
                />
                <Field label="Senha" placeholder="********" type="password" />

                <button
                  className="w-full rounded-2xl bg-gradient-to-r from-emerald-300 via-teal-300 to-sky-300 px-4 py-3 font-semibold text-slate-950 transition hover:scale-[1.01]"
                  type="submit"
                >
                  {isLogin ? "Entrar agora" : "Criar e acessar"}
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
        <header className="mb-6 flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-[0_24px_100px_rgba(0,0,0,0.35)] backdrop-blur md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-300/18 text-lg font-bold text-emerald-200">
              C
            </div>
            <div>
              <p className="font-display text-2xl text-white">CLASSE A</p>
              <p className="text-sm text-slate-400">
                Painel automatico para Bac Bo
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-emerald-300/15 bg-emerald-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-200">
              Online agora
            </span>
            <button
              className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
              onClick={() => setIsAuthenticated(false)}
              type="button"
            >
              Sair
            </button>
          </div>
        </header>

        <main className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
          <section className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-5 shadow-[0_24px_100px_rgba(0,0,0,0.35)] backdrop-blur">
            <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                  Predicao automatica
                </p>
                <h1 className="mt-3 max-w-lg font-display text-5xl leading-none text-white sm:text-6xl">
                  {activeSignal.side}
                </h1>
                <p className="mt-3 max-w-xl text-base leading-7 text-slate-300">
                  {activeSignal.summary}
                </p>
              </div>

              <div className="rounded-[1.75rem] border border-white/10 bg-white/5 px-5 py-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  Assertividade visual
                </p>
                <strong className="mt-2 block text-5xl font-semibold text-emerald-200">
                  {activeSignal.confidence.toFixed(1)}%
                </strong>
              </div>
            </div>

            <div
              className={`rounded-[2rem] border border-white/10 bg-gradient-to-br ${toneMap[activeSignal.side]} p-6`}
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-200/70">
                    {activeSignal.label}
                  </p>
                  <h2 className="mt-2 font-display text-4xl text-white">
                    {activeSignal.rhythm}
                  </h2>
                </div>
                <span className="rounded-full bg-black/20 px-4 py-2 text-sm text-white/90 ring-1 ring-white/10">
                  Janela {activeSignal.window}
                </span>
              </div>

              <div className="mt-6 h-3 rounded-full bg-black/20">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-emerald-300 to-sky-300"
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
            <section className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-[0_24px_100px_rgba(0,0,0,0.35)] backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                Painel rapido
              </p>
              <div className="mt-4 grid gap-3">
                <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/50 p-4">
                  <span className="text-sm text-slate-400">Modo</span>
                  <strong className="mt-1 block text-2xl text-white">
                    Automatico
                  </strong>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/50 p-4">
                  <span className="text-sm text-slate-400">Mesa ativa</span>
                  <strong className="mt-1 block text-2xl text-white">
                    Premium 04
                  </strong>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/50 p-4">
                  <span className="text-sm text-slate-400">Atualizacao</span>
                  <strong className="mt-1 block text-2xl text-white">4.8s</strong>
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-5 shadow-[0_24px_100px_rgba(0,0,0,0.35)] backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                Estado do motor
              </p>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                  <span className="text-sm text-slate-300">Leitura da mesa</span>
                  <span className="text-sm font-semibold text-emerald-200">
                    Estavel
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                  <span className="text-sm text-slate-300">Filtro de ruido</span>
                  <span className="text-sm font-semibold text-sky-200">
                    Ativo
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                  <span className="text-sm text-slate-300">Sinal liberado</span>
                  <span className="text-sm font-semibold text-amber-100">
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
