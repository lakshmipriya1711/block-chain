import { useState } from 'react';
import { verifyCredential } from './services/api';

const sampleCredential = {
  id: 'VD-2024-8842',
  title: 'M.Sc. Data Science',
  recipient: 'Ananya Rao',
  institution: 'Adelemerre University',
  issued: '14 June 2024',
  block: '#4,284,113',
  hash: '0x9f3a71b4e8d22a86cf5119e77d3d4681cc2aa5f',
  verified: true
};

function Icon({ children, className = '' }) {
  return <span className={`icon ${className}`} aria-hidden="true">{children}</span>;
}

function App() {
  const [credentialId, setCredentialId] = useState(sampleCredential.id);
  const [result, setResult] = useState(sampleCredential);
  const [status, setStatus] = useState('ready');
  const [activeNav, setActiveNav] = useState('Verify');

  async function handleVerify(event) {
    event.preventDefault();
    setStatus('loading');
    try {
      const credential = await verifyCredential(credentialId.trim());
      setResult(credential);
    } catch {
      setResult(null);
    } finally {
      setStatus('done');
    }
  }

  function handleIssue() {
    setActiveNav('Issue');
    document.getElementById('issue')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <main className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Veridoc home">
          <span className="brand-mark">V</span><span>Veridoc</span>
        </a>
        <nav className="nav-links" aria-label="Primary navigation">
          {['Verify', 'Issue', 'Ledger', 'Trust'].map((item) => (
            <a key={item} className={activeNav === item ? 'active' : ''} href={item === 'Verify' ? '#verify' : item === 'Issue' ? '#issue' : `#${item.toLowerCase()}`} onClick={() => setActiveNav(item)}>{item}</a>
          ))}
        </nav>
        <button className="access-button" onClick={() => setActiveNav('Issue')}>Get access</button>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <span className="eyebrow"><span className="live-dot" /> On-chain since 2021</span>
          <h1>Academic<br />credentials you can<br /><em>prove, instantly.</em></h1>
          <p>Veridoc anchors diplomas, transcripts and certificates to an immutable ledger, so employers verify authenticity in seconds, not weeks.</p>
          <div className="hero-actions">
            <button className="primary-button" onClick={handleIssue}>Verify a document</button>
            <button className="secondary-button" onClick={handleIssue}>Issue a credential</button>
          </div>
          <div className="metrics"><div><strong>1.4M</strong><span>DOCS ANCHORED</span></div><div><strong>340</strong><span>INSTITUTIONS</span></div><div><strong>0.8s</strong><span>AVG VERIFY</span></div></div>
        </div>

        <div className="verification-wrap" id="verify">
          <div className="orbit orbit-one" /><div className="orbit orbit-two" />
          <div className="verification-card">
            <div className="card-heading"><strong>Verification</strong><span className="status-pill">Live</span></div>
            <form onSubmit={handleVerify} className="verify-form">
              <input value={credentialId} onChange={(event) => setCredentialId(event.target.value)} aria-label="Credential ID" />
              <button type="submit" disabled={status === 'loading'}>{status === 'loading' ? '...' : 'Verify'}</button>
            </form>
            <p className="helper">Try VD-2024-8842 or enter a code above. No login required.</p>
            {result ? <div className="result-card">
              <div className="result-top"><span>VERIFICATION RESULT</span><span className="verified-badge"><Icon>✓</Icon> VERIFIED</span></div>
              <h3>{result.title}</h3><p>{result.recipient} · {result.institution}</p>
              <div className="result-meta"><span><small>ISSUE DATE</small>{result.issued}</span><span><small>BLOCK</small>{result.block}</span></div>
              <div className="hash"><small>TRANSACTION HASH</small>{result.hash}</div>
              <div className="match"><Icon>✓</Icon><span>Hash matched on ledger · seal integrity 100%</span></div>
            </div> : <div className="empty-result">No credential found. Check the ID and try again.</div>}
          </div>
          <div className="floating-toolbar"><span>◌</span><span>T</span><span>↗</span><span>▢</span></div>
        </div>
      </section>

      <section className="feature-grid" id="trust">
        <article className="feature-card"><div className="feature-icon lilac"><Icon>⌘</Icon></div><h2>Immutable anchoring</h2><p>Each document’s cryptographic hash is sealed to the chain at issuance — tampering is instantly detectable.</p></article>
        <article className="feature-card"><div className="feature-icon peach"><Icon>ϟ</Icon></div><h2>Instant verification</h2><p>Recruiters scan a QR or enter a code and get a definitive authentic-or-not result in under a second.</p></article>
        <article className="feature-card"><div className="feature-icon mint"><Icon>♙</Icon></div><h2>Privacy-first</h2><p>Zero-knowledge proofs confirm validity without exposing the underlying personal data to verifiers.</p></article>
      </section>

      <section className="process-section" id="ledger">
        <div className="section-heading"><h2>How a seal is made</h2><div className="floating-toolbar inline"><span>◌</span><span>T</span><span>↗</span><span>▢</span></div></div>
        <div className="process-grid"><article><span>01</span><h3>Issue</h3><p>The registrar signs the credential with the institution’s private key.</p></article><article><span>02</span><h3>Anchor</h3><p>Only the document’s hash is written to the ledger — never personal data.</p></article><article><span>03</span><h3>Verify</h3><p>Anyone checks the ID; the chain confirms the seal still matches.</p></article></div>
      </section>

      <section className="holders" id="issue">
        <h2>One seal, three holders</h2>
        <div className="holder-grid"><article><h3>Institutions</h3><p>Issue from a registrar console with signing keys and full audit logs.</p></article><article><h3>Students</h3><p>Carry a wallet of verified diplomas and share them with a single link.</p></article><article><h3>Verifiers</h3><p>Employers and boards confirm any credential against the ledger.</p></article></div>
      </section>

      <footer><span>© 2026 Veridoc — trust, anchored.</span><div><a href="#top">Docs</a><a href="#ledger">API</a><a href="#trust">Security</a></div></footer>
    </main>
  );
}

export default App;
