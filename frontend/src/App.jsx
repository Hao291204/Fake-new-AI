import { useState, useRef, useEffect } from 'react'
import './App.css'

const SAMPLE_ARTICLES = [
  {
    label: 'Try a suspicious headline',
    text: 'SHOCKING: Government has been secretly adding mind-control chemicals to tap water for decades. Whistleblower from the CDC reveals the deep state has been suppressing this information. Scientists who tried to expose the truth have mysteriously disappeared. Share this before it gets deleted!',
  },
  {
    label: 'Try a credible article',
    text: 'The Federal Reserve held interest rates steady on Wednesday, as policymakers said they needed more data before cutting borrowing costs. The decision was unanimous among voting members of the Federal Open Market Committee.',
  },
]

function AnimatedCounter({ value, duration = 900 }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    let start = 0
    const step = value / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= value) { setDisplay(value); clearInterval(timer) }
      else setDisplay(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [value, duration])
  return <>{display}</>
}

export default function App() {
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [charCount, setCharCount] = useState(0)
  const [fillWidth, setFillWidth] = useState(0)
  const textareaRef = useRef(null)

  const handleChange = (e) => {
    setText(e.target.value)
    setCharCount(e.target.value.length)
    if (result) { setResult(null); setFillWidth(0) }
    if (error) setError(null)
  }

  const handleSample = (sample) => {
    setText(sample.text)
    setCharCount(sample.text.length)
    setResult(null)
    setFillWidth(0)
    setError(null)
    textareaRef.current?.focus()
  }

  const handleSubmit = async () => {
    if (!text.trim() || loading) return
    setLoading(true)
    setResult(null)
    setFillWidth(0)
    setError(null)
    try {
      const res = await fetch('/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const data = await res.json()
      setResult(data)
      setTimeout(() => setFillWidth(Math.round(data.confidence * 100)), 100)
    } catch (err) {
      setError(err.message || 'Failed to connect to the analysis service.')
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setText('')
    setCharCount(0)
    setResult(null)
    setFillWidth(0)
    setError(null)
    textareaRef.current?.focus()
  }

  const confidencePct = result ? Math.round(result.confidence * 100) : 0
  const isFake = result?.label === 'FAKE'

  return (
    <div className="newspaper">
      <header className="masthead">
        <div className="masthead-top-rule" />
        <div className="masthead-eyebrow">
          <span>Est. 2024</span>
          <span className="eyebrow-dot">◆</span>
          <span>Powered by Machine Learning</span>
          <span className="eyebrow-dot">◆</span>
          <span>NLP · TF-IDF · Logistic Regression</span>
        </div>
        <div className="masthead-middle-rule" />
        <h1 className="masthead-title">The Veritas</h1>
        <p className="masthead-subtitle"><em>"All the truth that's fit to detect"</em></p>
        <div className="masthead-bottom-rule" />
        <nav className="section-nav">
          <span>§ AI Fact Checker</span>
          <span className="nav-sep">|</span>
          <span>§ NLP Analysis</span>
          <span className="nav-sep">|</span>
          <span>§ Real‑Time Verdict</span>
          <span className="nav-sep">|</span>
          <span>§ Confidence Score</span>
        </nav>
        <div className="masthead-thin-rule" />
      </header>

      <main className="main-grid">
        <section className="col-input">
          <div className="column-header">
            <h2 className="column-label">Submit Article for Analysis</h2>
            <div className="column-rule" />
          </div>
          <p className="column-intro">
            Paste any news article, headline, or passage below. Our trained classifier
            will examine the text and render a verdict on its authenticity.
          </p>
          <div className="samples-row">
            {SAMPLE_ARTICLES.map((s, i) => (
              <button key={i} className="sample-btn" onClick={() => handleSample(s)}>
                <span className="sample-icon">→</span>
                {s.label}
              </button>
            ))}
          </div>
          <div className={`textarea-wrapper ${text ? 'has-content' : ''}`}>
            <textarea
              ref={textareaRef}
              className="article-textarea"
              value={text}
              onChange={handleChange}
              placeholder={"Paste article text here…\n\nBegin with the headline, then the body of the article."}
              rows={14}
            />
            <div className="textarea-footer">
              <span className="char-count">
                <span className={charCount > 0 ? 'char-active' : ''}>{charCount.toLocaleString()}</span> characters
              </span>
              {text && (
                <button className="clear-btn" onClick={handleClear}>Clear ✕</button>
              )}
            </div>
          </div>
          <button
            className={`analyze-btn${loading ? ' is-loading' : ''}${!text.trim() ? ' is-disabled' : ''}`}
            onClick={handleSubmit}
            disabled={!text.trim() || loading}
          >
            <span className="btn-inner">
              {loading ? (
                <><span className="spinner" />Analysing Article…</>
              ) : (
                <>Analyse Article <span className="btn-arrow">→</span></>
              )}
            </span>
            <span className="btn-shimmer" />
          </button>
          {error && (
            <div className="error-box slide-up">
              <span className="error-icon">⚠</span>
              <span><strong>Connection Error:</strong> {error}</span>
            </div>
          )}
        </section>

        <div className="col-divider"><div className="divider-line" /></div>

        <section className="col-result">
          <div className="column-header">
            <h2 className="column-label">Editorial Verdict</h2>
            <div className="column-rule" />
          </div>

          {!result && !loading && (
            <div className="verdict-placeholder">
              <div className="placeholder-icon">
                <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
                  <rect x="8" y="6" width="36" height="40" rx="3" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3"/>
                  <line x1="16" y1="18" x2="36" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="16" y1="25" x2="36" y2="25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="16" y1="32" x2="28" y2="32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="38" cy="38" r="8" fill="currentColor" fillOpacity="0.07" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M35 38h6M38 35v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <p className="placeholder-text">Awaiting Submission</p>
              <p className="placeholder-sub">Submit an article to receive an AI-powered authenticity verdict.</p>
            </div>
          )}

          {loading && (
            <div className="scanning-state">
              <div className="scan-track">
                <div className="scan-beam" />
              </div>
              <div className="scan-dots">
                <span /><span /><span />
              </div>
              <p className="scanning-text">Consulting the archives…</p>
              <p className="scanning-sub">Running NLP analysis</p>
            </div>
          )}

          {result && !loading && (
            <div className="verdict-card slide-up">
              <div className={`verdict-stamp ${isFake ? 'stamp-fake' : 'stamp-real'}`}>
                <div className="stamp-corners">
                  <span /><span /><span /><span />
                </div>
                <span className="stamp-text">{result.label}</span>
              </div>
              <h3 className={`verdict-headline ${isFake ? 'headline-fake' : 'headline-real'}`}>
                {isFake ? 'Misinformation Detected' : 'Credible Reporting'}
              </h3>
              <p className="verdict-subline">
                {isFake
                  ? 'This article matches patterns associated with fabricated content.'
                  : 'This article matches patterns consistent with credible journalism.'}
              </p>
              <div className="verdict-rule" />
              <div className="confidence-section">
                <div className="confidence-header">
                  <span className="confidence-label">Classifier Confidence</span>
                  <span className={`confidence-pct ${isFake ? 'pct-fake' : 'pct-real'}`}>
                    <AnimatedCounter value={confidencePct} />%
                  </span>
                </div>
                <div className="confidence-track">
                  <div
                    className={`confidence-fill ${isFake ? 'fill-fake' : 'fill-real'}`}
                    style={{ width: `${fillWidth}%` }}
                  />
                </div>
                <div className="confidence-ticks">
                  {[0, 25, 50, 75, 100].map(v => (
                    <span key={v}>{v}%</span>
                  ))}
                </div>
                <p className="confidence-note">
                  {confidencePct >= 90
                    ? '● High certainty — strong signal detected in the text.'
                    : confidencePct >= 70
                    ? '● Moderate certainty — consider cross-referencing sources.'
                    : '● Low certainty — manual verification is recommended.'}
                </p>
              </div>
              <div className="verdict-rule" />
              <div className="editorial-note">
                <span className="editorial-label">Editorial Note — </span>
                {isFake
                  ? 'Readers are advised to consult primary sources before sharing. Sensationalist language, unverified claims, and anonymous sourcing are common indicators of misinformation.'
                  : 'Cross-referencing with multiple authoritative sources is always recommended. No automated system can guarantee absolute accuracy.'}
              </div>
              <button className="resubmit-btn" onClick={handleClear}>
                ← Submit Another Article
              </button>
            </div>
          )}

          <div className="result-disclaimer">
            <div className="disclaimer-rule" />
            <p>For educational purposes only. The Veritas AI does not constitute professional fact-checking. Always verify with authoritative sources.</p>
          </div>
        </section>
      </main>

      <footer className="newspaper-footer">
        <div className="footer-rule" />
        <div className="footer-inner">
          <span>The Veritas — AI Edition</span>
          <span className="footer-dot">◆</span>
          <span>Logistic Regression · TF-IDF</span>
          <span className="footer-dot">◆</span>
          <span>Kaggle Fake &amp; Real News Dataset</span>
        </div>
      </footer>
    </div>
  )
}
