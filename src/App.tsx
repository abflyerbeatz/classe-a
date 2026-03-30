import { useState } from "react";

type Outcome = "B" | "P" | "T";

const outcomeMap: Record<Outcome, { label: string; tone: string }> = {
  B: { label: "Banker", tone: "banker" },
  P: { label: "Player", tone: "player" },
  T: { label: "Tie", tone: "tie" },
};

const starterHistory: Outcome[] = ["B", "P", "B", "B", "T", "B", "P", "B"];

function getOutcomeLabel(outcome: Outcome) {
  return outcomeMap[outcome].label;
}

function getLongestRecentStreak(history: Outcome[]) {
  const filtered = history.filter((item) => item !== "T");

  if (filtered.length === 0) {
    return { side: "Aguardar", size: 0 };
  }

  const lastSide = filtered[filtered.length - 1];
  let size = 0;

  for (let index = filtered.length - 1; index >= 0; index -= 1) {
    if (filtered[index] === lastSide) {
      size += 1;
      continue;
    }

    break;
  }

  return { side: getOutcomeLabel(lastSide), size };
}

function analyzeHistory(history: Outcome[]) {
  const recent = history.slice(-12);
  const reversed = [...recent].reverse();
  let bankerScore = 0;
  let playerScore = 0;
  let tieScore = 0;

  reversed.forEach((item, index) => {
    const weight = Math.max(0.6, 2 - index * 0.14);

    if (item === "B") bankerScore += weight;
    if (item === "P") playerScore += weight;
    if (item === "T") tieScore += weight * 0.8;
  });

  const counts = {
    banker: recent.filter((item) => item === "B").length,
    player: recent.filter((item) => item === "P").length,
    tie: recent.filter((item) => item === "T").length,
  };
  const tiePressure = Math.round(tieScore * 10) / 10;

  const streak = getLongestRecentStreak(recent);
  const difference = Math.abs(bankerScore - playerScore);
  const dominantSide = bankerScore >= playerScore ? "Banker" : "Player";

  const nonTieHistory = recent.filter((item) => item !== "T");
  let switches = 0;

  for (let index = 1; index < nonTieHistory.length; index += 1) {
    if (nonTieHistory[index] !== nonTieHistory[index - 1]) {
      switches += 1;
    }
  }

  const alternationRate =
    nonTieHistory.length > 1 ? switches / (nonTieHistory.length - 1) : 0;

  let recommendation = dominantSide;
  let note = "Fluxo em definicao. Entrada curta e confirmada.";
  let confidence = Math.round(
    54 + difference * 8 + streak.size * 4 - counts.tie * 3 - alternationRate * 12,
  );

  if (recent.length < 5) {
    recommendation = "Aguardar";
    note = "Poucos dados. Espere mais rodadas para validar a leitura.";
    confidence = 48;
  } else if (difference < 1.2 || alternationRate > 0.72) {
    recommendation = "Aguardar";
    note = "Mesa instavel. Melhor esperar uma janela mais limpa.";
    confidence = Math.min(confidence, 58);
  } else if (tiePressure >= 2.3) {
    note = "Mesa com pressao de empate. Reduza exposicao e procure confirmacao.";
    confidence -= 6;
  } else if (streak.size >= 3) {
    note = `Sequencia recente favorece ${streak.side}. Entrada so com continuidade da mesa.`;
    confidence += 4;
  } else {
    note = `Leitura favorece ${dominantSide}. Buscar entrada disciplinada na proxima rodada.`;
  }

  confidence = Math.max(45, Math.min(confidence, 87));

  const riskLevel =
    confidence >= 74 ? "Controlado" : confidence >= 64 ? "Moderado" : "Elevado";

  return {
    counts,
    streak,
    dominantSide,
    alternationRate: Math.round(alternationRate * 100),
    confidence,
    recommendation,
    note,
    riskLevel,
    tiePressure,
  };
}

export default function App() {
  const [history, setHistory] = useState<Outcome[]>(starterHistory);
  const [sessionName, setSessionName] = useState("Mesa 04");
  const analysis = analyzeHistory(history);

  function addOutcome(outcome: Outcome) {
    setHistory((current) => [...current.slice(-15), outcome]);
  }

  function removeLastOutcome() {
    setHistory((current) => current.slice(0, -1));
  }

  function resetHistory() {
    setHistory([]);
  }

  function loadExample() {
    setHistory(starterHistory);
  }

  const recommendationTone =
    analysis.recommendation === "Banker"
      ? "banker"
      : analysis.recommendation === "Player"
        ? "player"
        : "neutral";

  return (
    <div className="app-frame">
      <header className="hero-card">
        <div>
          <p className="eyebrow">CLASSE A</p>
          <h1>Leitura simples de Bac Bo para encontrar boas janelas de entrada.</h1>
          <p className="hero-text">
            Um app React direto ao ponto: voce alimenta o historico da mesa e o
            painel resume tendencia, nivel de risco e a melhor acao do momento.
          </p>
        </div>

        <div className="hero-summary">
          <span className="session-chip">Sessao atual</span>
          <input
            aria-label="Nome da mesa"
            className="session-input"
            value={sessionName}
            onChange={(event) => setSessionName(event.target.value)}
          />
          <div className="summary-inline">
            <div>
              <small>Rodadas lidas</small>
              <strong>{history.length}</strong>
            </div>
            <div>
              <small>Confianca</small>
              <strong>{analysis.confidence}%</strong>
            </div>
          </div>
        </div>
      </header>

      <main className="dashboard-grid">
        <section className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Historico da mesa</p>
              <h2>{sessionName}</h2>
            </div>
            <span className="muted-copy">Ultimas 16 leituras</span>
          </div>

          <div className="history-row">
            {history.length > 0 ? (
              history.map((item, index) => (
                <div
                  className={`history-pill ${outcomeMap[item].tone}`}
                  key={`${item}-${index}`}
                >
                  {item}
                </div>
              ))
            ) : (
              <div className="empty-state">
                Sem historico ainda. Adicione resultados para iniciar a leitura.
              </div>
            )}
          </div>

          <div className="action-pad">
            <button
              className="pad-button banker"
              onClick={() => addOutcome("B")}
              type="button"
            >
              + Banker
            </button>
            <button
              className="pad-button player"
              onClick={() => addOutcome("P")}
              type="button"
            >
              + Player
            </button>
            <button
              className="pad-button tie"
              onClick={() => addOutcome("T")}
              type="button"
            >
              + Tie
            </button>
          </div>

          <div className="secondary-actions">
            <button
              className="ghost-button"
              onClick={removeLastOutcome}
              type="button"
            >
              Remover ultima
            </button>
            <button className="ghost-button" onClick={loadExample} type="button">
              Carregar exemplo
            </button>
            <button className="ghost-button" onClick={resetHistory} type="button">
              Limpar tudo
            </button>
          </div>
        </section>

        <section className="panel recommendation-panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Recomendacao CLASSE A</p>
              <h2>Melhor leitura atual</h2>
            </div>
          </div>

          <div className={`recommendation-card ${recommendationTone}`}>
            <span className="status-label">Acao sugerida</span>
            <strong>{analysis.recommendation}</strong>
            <p>{analysis.note}</p>
          </div>

          <div className="metric-grid">
            <article className="metric-card">
              <span>Dominancia</span>
              <strong>{analysis.dominantSide}</strong>
            </article>
            <article className="metric-card">
              <span>Streak</span>
              <strong>
                {analysis.streak.size > 0
                  ? `${analysis.streak.side} x${analysis.streak.size}`
                  : "Sem leitura"}
              </strong>
            </article>
            <article className="metric-card">
              <span>Alternancia</span>
              <strong>{analysis.alternationRate}%</strong>
            </article>
            <article className="metric-card">
              <span>Risco</span>
              <strong>{analysis.riskLevel}</strong>
            </article>
            <article className="metric-card">
              <span>Pressao Tie</span>
              <strong>{analysis.tiePressure}</strong>
            </article>
          </div>
        </section>

        <section className="panel stats-panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Mapa de resultados</p>
              <h2>Distribuicao recente</h2>
            </div>
          </div>

          <div className="distribution-grid">
            <article className="distribution-card banker">
              <span>Banker</span>
              <strong>{analysis.counts.banker}</strong>
            </article>
            <article className="distribution-card player">
              <span>Player</span>
              <strong>{analysis.counts.player}</strong>
            </article>
            <article className="distribution-card tie">
              <span>Tie</span>
              <strong>{analysis.counts.tie}</strong>
            </article>
          </div>

          <div className="insight-box">
            <h3>Leitura rapida</h3>
            <p>
              O algoritmo observa peso recencial, streak, alternancia e presenca
              de empate para decidir entre seguir o lado dominante ou esperar.
            </p>
          </div>
        </section>

        <section className="panel guide-panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Como usar</p>
              <h2>Fluxo simples</h2>
            </div>
          </div>

          <div className="guide-list">
            <article>
              <span>01</span>
              <p>Registre as ultimas rodadas da mesa usando Banker, Player ou Tie.</p>
            </article>
            <article>
              <span>02</span>
              <p>Leia a recomendacao e so entre quando a confianca estiver limpa.</p>
            </article>
            <article>
              <span>03</span>
              <p>Se a mesa alternar demais, o app sugere aguardar em vez de forcar entrada.</p>
            </article>
          </div>

          <div className="warning-box">
            O CLASSE A ajuda na leitura da mesa, mas nao garante resultado.
            Use sempre com controle de banca e disciplina.
          </div>
        </section>
      </main>
    </div>
  );
}
