// Workout Patna — Auth + Onboarding screens

const { useState, useEffect, useRef } = React;

// ────────────────────────────────────────────────────────────
// Splash + Auth
// ────────────────────────────────────────────────────────────

function WPLogo({ size = 44, light = false }) {
  // 'WP' monogram inside a barbell-inspired roundel
  const fg = light ? '#fff' : 'var(--wp-ink)';
  const accent = 'var(--wp-orange)';
  return (
    <div style={{
      width: size, height: size, borderRadius: 14,
      background: light ? 'rgba(255,255,255,0.12)' : '#fff',
      border: light ? '1px solid rgba(255,255,255,0.25)' : '1.5px solid var(--wp-line)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', flexShrink: 0,
    }}>
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none">
        <path d="M3 8v8M5 6v12M19 6v12M21 8v8" stroke={fg} strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M5 12h14" stroke={accent} strokeWidth="2.4" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

function ScreenAuth({ onContinue, mode = 'signup', setMode }) {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  return (
    <div className="wp-screen" style={{ background: 'var(--wp-ink)', color: '#fff' }}>
      {/* Hero */}
      <div style={{ flex: 1, padding: '34px 28px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
        {/* decorative blob */}
        <div style={{
          position: 'absolute', top: -120, right: -100, width: 320, height: 320,
          borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, rgba(242,107,58,0.55), rgba(242,107,58,0) 70%)',
          filter: 'blur(8px)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: -80, left: -60, width: 240, height: 240,
          borderRadius: '50%', background: 'radial-gradient(circle at 50% 50%, rgba(111,181,138,0.35), rgba(111,181,138,0) 70%)',
          filter: 'blur(8px)', pointerEvents: 'none',
        }} />

        {/* Background scene: people walking to the gym, chatting */}
        <svg viewBox="0 0 400 600" preserveAspectRatio="xMidYMax slice" style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          opacity: 0.42, pointerEvents: 'none', mixBlendMode: 'screen',
        }}>
          <defs>
            <linearGradient id="gymGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F26B3A" stopOpacity="0"/>
              <stop offset="100%" stopColor="#F26B3A" stopOpacity="0.35"/>
            </linearGradient>
          </defs>
          {/* gym building silhouette far back */}
          <rect x="0" y="380" width="400" height="220" fill="#000" opacity="0.35"/>
          <rect x="40" y="320" width="120" height="120" fill="#0B1F3A" opacity="0.6"/>
          <rect x="200" y="290" width="160" height="150" fill="#0B1F3A" opacity="0.55"/>
          {/* lit windows */}
          <g fill="#F26B3A" opacity="0.7">
            <rect x="56" y="340" width="14" height="18"/>
            <rect x="80" y="340" width="14" height="18"/>
            <rect x="104" y="340" width="14" height="18"/>
            <rect x="56" y="368" width="14" height="18"/>
            <rect x="104" y="368" width="14" height="18"/>
            <rect x="216" y="310" width="18" height="22"/>
            <rect x="246" y="310" width="18" height="22"/>
            <rect x="276" y="310" width="18" height="22"/>
            <rect x="306" y="310" width="18" height="22"/>
            <rect x="336" y="310" width="18" height="22"/>
            <rect x="216" y="344" width="18" height="22"/>
            <rect x="276" y="344" width="18" height="22"/>
            <rect x="336" y="344" width="18" height="22"/>
          </g>
          {/* glow above gym entrance */}
          <rect x="220" y="380" width="80" height="60" fill="url(#gymGlow)"/>
          <text x="260" y="408" textAnchor="middle" fill="#F26B3A" fontFamily="Archivo Black, Impact" fontSize="13" fontWeight="900" opacity="0.85" letterSpacing="2">GYM</text>

          {/* === Two people walking + chatting (foreground silhouettes) === */}
          {/* Person A - left, mid-stride, gym bag */}
          <g fill="#000" opacity="0.78" transform="translate(70 400)">
            {/* head */}
            <circle cx="0" cy="0" r="14"/>
            {/* hair tuft / bun */}
            <circle cx="-8" cy="-10" r="6"/>
            {/* torso */}
            <path d="M-14 14 Q-16 22 -14 38 L14 38 Q16 22 14 14 Z"/>
            {/* arm forward (gesturing) */}
            <path d="M14 18 Q26 22 34 14 L36 18 Q28 28 14 26 Z"/>
            {/* back arm with bag strap */}
            <path d="M-14 18 Q-22 28 -20 42 L-16 42 Q-12 30 -10 22 Z"/>
            {/* gym bag */}
            <rect x="-32" y="36" width="22" height="14" rx="3"/>
            <path d="M-26 36 Q-21 32 -16 36" stroke="#000" strokeWidth="2" fill="none"/>
            {/* legs - mid stride */}
            <path d="M-8 38 Q-10 56 -14 78 L-6 78 Q-2 58 0 40 Z"/>
            <path d="M2 38 Q6 56 12 76 L18 74 Q14 56 10 40 Z"/>
            {/* shoes */}
            <ellipse cx="-10" cy="80" rx="8" ry="3"/>
            <ellipse cx="15" cy="76" rx="8" ry="3"/>
          </g>

          {/* Person B - right, walking together, water bottle */}
          <g fill="#000" opacity="0.78" transform="translate(135 402)">
            {/* head */}
            <circle cx="0" cy="0" r="14"/>
            {/* cap */}
            <path d="M-14 -4 Q0 -18 14 -4 L14 -8 Q0 -22 -14 -8 Z"/>
            <path d="M14 -4 L24 -2 L14 0 Z"/>
            {/* torso */}
            <path d="M-14 14 Q-16 24 -14 40 L14 40 Q16 24 14 14 Z"/>
            {/* arm forward, holding water bottle */}
            <path d="M-14 18 Q-26 24 -32 18 L-30 24 Q-22 30 -10 26 Z"/>
            <rect x="-40" y="14" width="6" height="14" rx="2"/>
            <rect x="-39" y="11" width="4" height="4"/>
            {/* back arm relaxed */}
            <path d="M14 18 Q20 30 18 44 L14 44 Q12 30 10 22 Z"/>
            {/* legs - opposite stride from person A */}
            <path d="M-8 40 Q-12 58 -16 76 L-8 78 Q-2 60 0 42 Z"/>
            <path d="M2 40 Q4 58 8 80 L16 80 Q14 58 10 42 Z"/>
            <ellipse cx="-12" cy="78" rx="8" ry="3"/>
            <ellipse cx="12" cy="80" rx="8" ry="3"/>
          </g>

          {/* speech bubble between them */}
          <g opacity="0.55">
            <ellipse cx="105" cy="350" rx="22" ry="11" fill="#F26B3A"/>
            <path d="M95 358 L92 365 L100 360 Z" fill="#F26B3A"/>
            <circle cx="98" cy="350" r="2" fill="#0B1F3A"/>
            <circle cx="105" cy="350" r="2" fill="#0B1F3A"/>
            <circle cx="112" cy="350" r="2" fill="#0B1F3A"/>
          </g>

          {/* Third person ahead, jogging toward gym */}
          <g fill="#000" opacity="0.6" transform="translate(260 420) scale(0.85)">
            <circle cx="0" cy="0" r="12"/>
            {/* ponytail */}
            <path d="M10 -2 Q18 4 14 14" stroke="#000" strokeWidth="4" fill="none" strokeLinecap="round"/>
            {/* torso leaning forward */}
            <path d="M-12 12 Q-8 22 -10 34 L12 36 Q16 22 12 12 Z"/>
            {/* running arms */}
            <path d="M-10 16 Q-22 22 -20 34 L-16 34 Q-12 24 -8 18 Z"/>
            <path d="M12 16 Q22 14 26 6 L28 10 Q24 22 14 22 Z"/>
            {/* legs running */}
            <path d="M-6 34 Q-14 50 -18 66 L-10 68 Q-2 52 2 36 Z"/>
            <path d="M4 34 Q12 46 18 56 L24 50 Q16 42 10 34 Z"/>
            <ellipse cx="-14" cy="68" rx="7" ry="3"/>
            <ellipse cx="22" cy="52" rx="7" ry="3"/>
          </g>

          {/* Pavement line */}
          <path d="M0 488 L400 488" stroke="#fff" strokeOpacity="0.08" strokeWidth="1"/>
          <g stroke="#F26B3A" strokeOpacity="0.25" strokeWidth="2" strokeDasharray="8 12">
            <line x1="0" y1="498" x2="400" y2="498"/>
          </g>
        </svg>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative', zIndex: 1 }}>
          <WPLogo light />
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: '0.01em', textTransform: 'uppercase' }}>
            Workout <span style={{ color: 'var(--wp-orange)' }}>Patna</span>
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: 'var(--wp-orange)', marginBottom: 14,
          }}>For people who lift</div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 900,
            fontSize: 32, lineHeight: 1.05, letterSpacing: '-0.02em', margin: 0,
            position: 'relative', zIndex: 2,
          }}>
            Consistency starts with the <span style={{ color: 'var(--wp-orange)' }}>right partner.</span>
          </h1>
          <p style={{ fontSize: 13.5, lineHeight: 1.5, color: 'rgba(255,255,255,0.78)', marginTop: 16, maxWidth: 340, position: 'relative', zIndex: 2 }}>
            <b style={{ color: '#fff', fontWeight: 700 }}>WorkoutPatna</b> is the fitness social app that helps you find workout partners near you at gyms, apartment complexes, parks, run clubs, and community fitness centers. <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', color: '#fff' }}>No trainers. No guesswork.</span> Just better accountability.
          </p>
        </div>
      </div>

      {/* Auth card */}
      <div style={{
        background: 'var(--wp-cream)', color: 'var(--wp-ink)',
        borderTopLeftRadius: 28, borderTopRightRadius: 28,
        padding: '22px 22px 22px',
      }}>
        {/* Feature bullets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
          {[
            ['Match by gym, schedule, and goals'],
            ['Lifting, cardio, classes, or run clubs'],
            ['Check-ins, challenges, and accountability'],
          ].map(([t], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 22, height: 22, borderRadius: 6, background: 'var(--wp-orange-soft)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2.5 6.5 L5 9 L9.5 3.5" stroke="#F26B3A" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div style={{ fontSize: 13.5, color: 'var(--wp-ink)', fontWeight: 500 }}>{t}</div>
            </div>
          ))}
        </div>

        <button className="wp-btn wp-btn--orange" style={{ width: '100%' }} onClick={onContinue}>
          Join WorkoutPatna
        </button>

        <button className="wp-btn wp-btn--ghost" style={{ width: '100%', background: '#fff', marginTop: 10 }} onClick={onContinue}>
          Find a Gym Partner Near You
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '14px 4px 12px' }}>
          <hr className="wp-divider" style={{ flex: 1 }}/>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: 'var(--wp-mute)', textTransform: 'uppercase' }}>or</span>
          <hr className="wp-divider" style={{ flex: 1 }}/>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button className="wp-btn wp-btn--ghost" style={{ flex: 1, background: '#fff', height: 44, fontSize: 13 }} onClick={onContinue}>
            <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4c-.2 1.3-.9 2.3-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3Z"/><path fill="#34A853" d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.7-5.6-4H3.1v2.6A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.4 14.1A6 6 0 0 1 6.1 12c0-.7.1-1.4.3-2.1V7.3H3.1A10 10 0 0 0 2 12c0 1.6.4 3.2 1.1 4.7l3.3-2.6Z"/><path fill="#EA4335" d="M12 6.4c1.5 0 2.8.5 3.8 1.5l2.8-2.8C16.9 3.5 14.7 2.6 12 2.6A10 10 0 0 0 3.1 7.3l3.3 2.6c.8-2.4 3-4 5.6-4Z"/></svg>
            Google
          </button>
          <button className="wp-btn wp-btn--ghost" style={{ flex: 1, background: '#fff', height: 44, fontSize: 13 }} onClick={onContinue}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#0B1F3A"><path d="M16.4 12.6c0-2.4 2-3.6 2-3.6-1-1.6-2.7-1.8-3.3-1.8-1.4-.1-2.7.8-3.4.8-.7 0-1.8-.8-3-.8-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7c1.2 0 2-1.1 2.8-2.3.9-1.3 1.2-2.6 1.3-2.7-.1 0-2.6-1-2.7-3.5zM14.3 5.5c.6-.8 1-1.9.9-3-.9 0-2 .6-2.6 1.4-.6.7-1.1 1.8-.9 2.9 1 .1 2-.5 2.6-1.3z"/></svg>
            Apple
          </button>
        </div>

        <div style={{ marginTop: 14, fontSize: 12.5, textAlign: 'center', color: 'var(--wp-mute)' }}>
          Already a member? <button onClick={onContinue} style={{ color: 'var(--wp-orange)', fontWeight: 700 }}>Sign in</button>
        </div>

        <p style={{ fontSize: 10.5, color: 'var(--wp-mute)', textAlign: 'center', marginTop: 8, lineHeight: 1.5 }}>
          By continuing you agree to our Terms & Community Standards.
        </p>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Onboarding container
// ────────────────────────────────────────────────────────────

function OnboardShell({ step, total, title, subtitle, children, onBack, onNext, nextLabel = 'Continue', nextDisabled, onSkip }) {
  return (
    <div className="wp-screen">
      {/* Top bar */}
      <div style={{ padding: '8px 20px 4px', display: 'flex', alignItems: 'center', gap: 14 }}>
        {onBack ? (
          <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: 9999, background: '#fff', border: '1px solid var(--wp-line)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconBack size={18} color="var(--wp-ink)"/>
          </button>
        ) : <div style={{ width: 36 }}/>}
        <div style={{ flex: 1, height: 5, background: '#EEE3D2', borderRadius: 9999, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(step / total) * 100}%`, background: 'var(--wp-orange)', borderRadius: 9999, transition: 'width .35s ease' }}/>
        </div>
        {onSkip ? (
          <button onClick={onSkip} style={{ fontSize: 13, fontWeight: 600, color: 'var(--wp-mute)' }}>Skip</button>
        ) : <div style={{ width: 36 }}/>}
      </div>

      <div className="wp-scroll" style={{ padding: '14px 24px 20px' }}>
        <div className="wp-eyebrow" style={{ marginBottom: 8 }}>Step {step} of {total}</div>
        <h1 className="wp-h1" style={{ marginBottom: 8 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 15, color: 'var(--wp-mute)', lineHeight: 1.5, margin: '0 0 22px' }}>{subtitle}</p>}
        <div className="wp-fade-up" key={step}>{children}</div>
      </div>

      <div style={{ padding: '12px 24px 28px', borderTop: '1px solid var(--wp-line)', background: 'rgba(251,247,241,0.96)', backdropFilter: 'blur(10px)' }}>
        <button className="wp-btn wp-btn--orange" style={{ width: '100%', opacity: nextDisabled ? 0.4 : 1, pointerEvents: nextDisabled ? 'none' : 'auto' }} onClick={onNext}>
          {nextLabel}
        </button>
      </div>
    </div>
  );
}

function ScreenOnboardGym({ value, setValue, ...rest }) {
  return (
    <OnboardShell {...rest} title={<>Where do you <em>lift</em>?</>} subtitle="We only show people who train at your gym (or 1 mile away).">
      <div style={{ position: 'relative', marginBottom: 18 }}>
        <input className="wp-input" placeholder="Search by gym name or area" style={{ paddingLeft: 44 }}/>
        <div style={{ position: 'absolute', left: 16, top: 17 }}>
          <IconSearch size={18} color="var(--wp-mute)" />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {window.WP_GYMS.map(g => {
          const sel = value === g.id;
          return (
            <button key={g.id} onClick={() => setValue(g.id)} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 16px', borderRadius: 16,
              background: sel ? 'var(--wp-ink)' : '#fff',
              color: sel ? '#fff' : 'var(--wp-ink)',
              border: `1.5px solid ${sel ? 'var(--wp-ink)' : 'var(--wp-line)'}`,
              textAlign: 'left', transition: 'all .15s ease',
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12,
                background: sel ? 'rgba(255,255,255,0.12)' : 'var(--wp-orange-soft)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <IconDumbbell size={22} color={sel ? '#fff' : 'var(--wp-orange)'}/>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14.5, fontWeight: 700, marginBottom: 2 }}>{g.name}</div>
                <div style={{ fontSize: 12.5, opacity: 0.7 }}>{g.area} · {g.members.toLocaleString()} members</div>
              </div>
              {sel && <IconCheck size={20} color="var(--wp-orange)"/>}
            </button>
          );
        })}
      </div>
    </OnboardShell>
  );
}

function PickGrid({ options, value, setValue, multi = false, columns = 2 }) {
  const isSel = (o) => multi ? value.includes(o) : value === o;
  const toggle = (o) => {
    if (multi) {
      setValue(value.includes(o) ? value.filter(x => x !== o) : [...value, o]);
    } else {
      setValue(o);
    }
  };
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 10 }}>
      {options.map(o => {
        const sel = isSel(o);
        return (
          <button key={o} onClick={() => toggle(o)} style={{
            padding: '16px 14px', borderRadius: 16,
            background: sel ? 'var(--wp-ink)' : '#fff',
            color: sel ? '#fff' : 'var(--wp-ink)',
            border: `1.5px solid ${sel ? 'var(--wp-ink)' : 'var(--wp-line)'}`,
            fontSize: 14, fontWeight: 600, textAlign: 'center',
            transition: 'all .15s ease', minHeight: 56,
          }}>
            {o}
          </button>
        );
      })}
    </div>
  );
}

function ScreenOnboardLevel({ value, setValue, ...rest }) {
  const levels = [
    { id: 'Beginner', desc: 'Less than 1 year. Still learning form.', emoji: '🌱' },
    { id: 'Intermediate', desc: '1–3 years. I know what a hook grip is.', emoji: '🏋️' },
    { id: 'Advanced', desc: '3+ years. I have a coach or program.', emoji: '🔥' },
  ];
  return (
    <OnboardShell {...rest} title={<>Your <em>level</em>.</>} subtitle="Be honest — this matches you with people who lift like you do.">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {levels.map(l => {
          const sel = value === l.id;
          return (
            <button key={l.id} onClick={() => setValue(l.id)} style={{
              display: 'flex', alignItems: 'center', gap: 16,
              padding: '18px 18px', borderRadius: 18,
              background: sel ? 'var(--wp-ink)' : '#fff',
              color: sel ? '#fff' : 'var(--wp-ink)',
              border: `1.5px solid ${sel ? 'var(--wp-ink)' : 'var(--wp-line)'}`,
              textAlign: 'left',
            }}>
              <div style={{ fontSize: 30 }}>{l.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 17, fontWeight: 700 }}>{l.id}</div>
                <div style={{ fontSize: 13, opacity: 0.72, marginTop: 2 }}>{l.desc}</div>
              </div>
              {sel && <IconCheck size={22} color="var(--wp-orange)"/>}
            </button>
          );
        })}
      </div>
    </OnboardShell>
  );
}

function ScreenOnboardGoals({ value, setValue, ...rest }) {
  return (
    <OnboardShell {...rest} title={<>What are you <em>chasing</em>?</>} subtitle="Pick 1–3. We'll prioritize people working toward similar things.">
      <PickGrid options={window.WP_GOALS} value={value} setValue={setValue} multi columns={2}/>
    </OnboardShell>
  );
}

function ScreenOnboardVibe({ value, setValue, ...rest }) {
  return (
    <OnboardShell {...rest} title={<>Your gym <em>vibe</em>.</>} subtitle="What kind of partner do you actually want? Pick all that fit." nextLabel="Find my people →">
      <PickGrid options={window.WP_VIBES} value={value} setValue={setValue} multi columns={2}/>
      <div className="wp-card" style={{ padding: 14, marginTop: 22, display: 'flex', gap: 12, alignItems: 'flex-start', background: 'var(--wp-orange-soft)', border: 'none' }}>
        <IconShield size={20} color="var(--wp-orange)"/>
        <div style={{ fontSize: 12.5, color: '#7A3815', lineHeight: 1.5 }}>
          <b>Heads up:</b> Workout Patna is for finding workout partners, not dates. Profiles flagged as romantic get a one-strike warning.
        </div>
      </div>
    </OnboardShell>
  );
}

Object.assign(window, {
  WPLogo,
  ScreenAuth,
  ScreenOnboardGym,
  ScreenOnboardLevel,
  ScreenOnboardGoals,
  ScreenOnboardVibe,
});
