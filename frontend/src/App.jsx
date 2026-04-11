import { useState, useRef } from 'react'
import './App.css'

const SAMPLE_ARTICLES = [
  {
    label: 'Try a suspicious headline',
    text: 'BREAKING: Scientists discover that drinking bleach cures all diseases, government hiding the truth for decades. Anonymous insider reveals Big Pharma conspiracy to suppress miracle treatment discovered in 1987.',
  },
  {
    label: 'Try a real article',
    text: 'The Federal Reserve held interest rates steady on Wednesday, as policymakers said they needed more data before cutting borrowing costs. The decision was unanimous among voting members of the Federal Open Market Committee.',
  },
]

export default function App() {
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [charCount, setCharCount] = useState(0)
  const textareaRef = useRef(null)

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  const handleChange = (e) => {
    setText(e.target.value)
    setCharCount(e.target.value.length)
    if (result) setResult(null)
    if (error) setError(null)
  }

  const handleSample = (sample) => {
    setText(sample.text)
    setCharCount(sample.text.length)
    setResult(null)
    setError(null)
    textareaRef.current?.focus()
  }

  const handleSubmit = async () => {
    if (!text.trim() || loading) return
    setLoading(true)
    setResult(null)
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
    setError(null)
    textareaRef.current?.focus()
  }

  const confidencePct = result ? Math.round(result.confidence * 100) : 0
  const isFake = result?.label === 'FAKE'

  return (
    <div className="newspaper">

      {/* ── Masthead ── */}
      <header className="masthead">
        <div className="masthead-top-rule" />
        <div className="masthead-eyebrow">
          <span>Est. 2024</span>
          <span className="eyebrow-dot">◆</span>
          <span>{today}</span>
          <span className="eyebrow-dot">◆</span>
          <span>Powered by Machine Learning</span>
        </div>
        <div className="masthead-middle-rule" />
        <h1 className="masthead-title">The Veritas</h1>
        <p className="masthead-subtitle">
          <em>"All the truth that's fit to detect"</em>
        </p>
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

      {/* ── Main Content ── */}
      <main className="main-grid">

        {/* ── Left Column: Input ── */}
        <section className="col-input">
          <div className="column-header">
            <h2 className="column-label">Submit Article for Analysis</h2>
            <div className="column-rule" />
          </div>

          <p className="column-intro">
            Paste any news article, headline, or passage below. Our trained
            classifier will examine the text and render a verdict on its
            authenticity.
          </p>

          <div className="samples-row">
            {SAMPLE_ARTICLES.map((s, i) => (
              <button key={i} className="sample-btn" onClick={() => handleSample(s)}>
                {s.label} →
              </button>
            ))}
          </div>

          <div className="textarea-wrapper">
            <textarea
              ref={textareaRef}
              className="article-textarea"
              value={text}
              onChange={handleChange}
              placeholder="Paste article text here…&#10;&#10;Begin with the headline, then the body of the article."
              rows={14}
            />
            <div className="textarea-footer">
              <span className="char-count">{charCount.toLocaleString()} characters</span>
              {text && (
                <button className="clear-btn" onClick={handleClear}>
                  Clear ✕
                </button>
              )}
            </div>
          </div>

          <button
            className={`analyze-btn ${loading ? 'loading' : ''}`}
            onClick={handleSubmit}
            disabled={!text.trim() || loading}
          >
            {loading ? (
              <span className="btn-loading">
                <span className="loading-dot" />
                <span className="loading-dot" />
                <span className="loading-dot" />
                Analysing…
              </span>
            ) : (
              'Analyse Article →'
            )}
          </button>

          {error && (
            <div className="error-box fade-in">
              <strong>⚠ Dispatch Error:</strong> {error}
            </div>
          )}
        </section>

        {/* ── Divider ── */}
        <div className="col-divider" />

        {/* ── Right Column: Result ── */}
        <section className="col-result">
          <div className="column-header">
            <h2 className="column-label">Editorial Verdict</h2>
            <div className="column-rule" />
          </div>

          {!result && !loading && (
            <div className="verdict-placeholder">
              <div className="placeholder-ornament">✦</div>
              <p className="placeholder-text">
                The editorial board awaits<br />your submission.
              </p>
              <p className="placeholder-sub">
                Results will appear here once the analysis is complete.
              </p>
            </div>
          )}

          {loading && (
            <div className="scanning-state">
              <div className="scan-bar" />
              <p className="scanning-text">Consulting the archives…</p>
            </div>
          )}

          {result && !loading && (
            <div className="verdict-card fade-in">
              {/* Stamp */}
              <div className={`verdict-stamp ${isFake ? 'stamp-fake' : 'stamp-real'}`}>
                <span className="stamp-text">{result.label}</span>
              </div>

              {/* Headline verdict */}
              <h3 className={`verdict-headline ${isFake ? 'headline-fake' : 'headline-real'}`}>
                {isFake
                  ? 'Classified: Misinformation Detected'
                  : 'Classified: Credible Reporting'}
              </h3>

              <div className="verdict-rule" />

              {/* Confidence bar */}
              <div className="confidence-section">
                <div className="confidence-header">
                  <span className="confidence-label">Confidence Score</span>
                  <span className={`confidence-pct ${isFake ? 'pct-fake' : 'pct-real'}`}>
                    {confidencePct}%
                  </span>
                </div>
                <div className="confidence-track">
                  <div
                    className={`confidence-fill ${isFake ? 'fill-fake' : 'fill-real'}`}
                    style={{ width: `${confidencePct}%` }}
                  />
                </div>
                <p className="confidence-note">
                  {confidencePct >= 90
                    ? 'The classifier holds this verdict with high certainty.'
                    : confidencePct >= 70
                    ? 'The classifier is moderately confident in this verdict.'
                    : 'The classifier is uncertain — consider additional fact-checking.'}
                </p>
              </div>

              <div className="verdict-rule" />

              {/* Editorial note */}
              <div className="editorial-note">
                <span className="editorial-label">Editorial Note —</span>{' '}
                {isFake
                  ? 'This article exhibits patterns commonly associated with misleading or fabricated content. Readers are advised to consult primary sources before sharing.'
                  : 'This article exhibits patterns consistent with credible journalism. As always, cross-referencing with multiple reputable sources is recommended.'}
              </div>

              <button className="resubmit-btn" onClick={handleClear}>
                Submit Another Article
              </button>
            </div>
          )}

          {/* Footer note */}
          <div className="result-disclaimer">
            <div className="disclaimer-rule" />
            <p>
              This tool is intended for educational purposes. The Veritas AI
              does not constitute professional fact-checking. Always verify
              with authoritative sources.
            </p>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="newspaper-footer">
        <div className="footer-rule" />
        <div className="footer-inner">
          <span>The Veritas — AI Edition</span>
          <span className="footer-dot">◆</span>
          <span>Model: Logistic Regression / TF-IDF</span>
          <span className="footer-dot">◆</span>
          <span>Dataset: Kaggle Fake &amp; Real News</span>
        </div>
      </footer>
    </div>
  )
}
