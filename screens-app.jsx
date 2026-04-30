// Workout Patna — Main app screens

const { useState: useStateApp, useEffect: useEffectApp, useRef: useRefApp, useMemo } = React;

// ────────────────────────────────────────────────────────────
// Reusable: Avatar
// ────────────────────────────────────────────────────────────

function Avatar({ person, size = 44, ring }) {
  const initials = person.name.split(' ').map(p => p[0]).slice(0, 2).join('');
  const bg = `linear-gradient(140deg, hsl(${person.hue}, 80%, 78%), hsl(${person.hue}, 65%, 52%))`;
  return (
    <div className="wp-avatar" style={{
      width: size, height: size, fontSize: size * 0.36, background: bg,
      boxShadow: ring ? `0 0 0 3px ${ring}` : 'none',
    }}>
      {initials}
    </div>
  );
}

function ProfilePhoto({ person, height = 380, rounded = 22 }) {
  // Generate a stylized "photo" — duotone gradient + abstract shape
  const h = person.hue;
  return (
    <div style={{
      height, borderRadius: rounded, position: 'relative', overflow: 'hidden',
      background: `linear-gradient(160deg, hsl(${h}, 75%, 72%) 0%, hsl(${h}, 60%, 38%) 100%)`,
    }}>
      {/* concentric rings — stylized */}
      <svg viewBox="0 0 400 500" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.55 }} preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id={`g-${person.id}`} cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor={`hsl(${h}, 90%, 88%)`} stopOpacity="0.9"/>
            <stop offset="100%" stopColor={`hsl(${h}, 60%, 30%)`} stopOpacity="0"/>
          </radialGradient>
        </defs>
        <circle cx="200" cy="200" r="160" fill={`url(#g-${person.id})`}/>
        <circle cx="200" cy="200" r="120" fill="none" stroke="#fff" strokeOpacity="0.18" strokeWidth="1"/>
        <circle cx="200" cy="200" r="180" fill="none" stroke="#fff" strokeOpacity="0.12" strokeWidth="1"/>
        {/* abstract "figure" silhouette */}
        <ellipse cx="200" cy="180" rx="38" ry="42" fill="rgba(0,0,0,0.32)"/>
        <path d="M120 320 Q200 230 280 320 L290 500 L110 500 Z" fill="rgba(0,0,0,0.32)"/>
      </svg>
      {/* initial badge */}
      <div style={{
        position: 'absolute', top: 18, left: 18,
        fontFamily: 'var(--font-display)', fontWeight: 900,
        fontSize: 90, lineHeight: 1, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase',
      }}>{person.name[0]}</div>
      {/* placeholder watermark */}
      <div style={{
        position: 'absolute', bottom: 12, right: 14,
        fontSize: 9.5, fontWeight: 600, letterSpacing: '0.14em',
        color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase',
      }}>placeholder</div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Tab bar
// ────────────────────────────────────────────────────────────
function TabBar({ active, onChange, badge }) {
  const tabs = [
    { id: 'home', label: 'Home', Icon: window.IconHome },
    { id: 'browse', label: 'Browse', Icon: window.IconSpark },
    { id: 'matches', label: 'Matches', Icon: window.IconHeart, badge: badge?.matches },
    { id: 'chat', label: 'Chats', Icon: window.IconChat, badge: badge?.chat },
    { id: 'me', label: 'Me', Icon: window.IconUser },
  ];
  return (
    <div className="wp-tabbar">
      {tabs.map(t => (
        <button key={t.id} className="wp-tab" data-active={active === t.id} onClick={() => onChange(t.id)}>
          <div style={{ position: 'relative' }} className="wp-tab-icon">
            <t.Icon size={24}/>
            {t.badge ? <div style={{
              position: 'absolute', top: -4, right: -8,
              minWidth: 16, height: 16, padding: '0 4px',
              borderRadius: 9999, background: 'var(--wp-orange)',
              color: '#fff', fontSize: 10, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{t.badge}</div> : null}
          </div>
          <div>{t.label}</div>
        </button>
      ))}
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// HOME
// ────────────────────────────────────────────────────────────
function ScreenHome({ user, onOpenPerson, onGoTo }) {
  const matches = window.WP_THREADS;
  const peopleById = Object.fromEntries(window.WP_PEOPLE.map(p => [p.id, p]));
  const myGym = window.WP_GYMS.find(g => g.id === user.gym);
  const newPeople = window.WP_PEOPLE.filter(p => p.gym === user.gym).slice(0, 4);

  return (
    <div className="wp-screen">
      {/* Header */}
      <div style={{ padding: '12px 20px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--wp-mute)' }}>Good morning,</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>Alex 👋</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ width: 40, height: 40, borderRadius: 9999, background: '#fff', border: '1px solid var(--wp-line)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconBolt size={18} color="var(--wp-orange)" fill="var(--wp-orange)"/>
          </button>
        </div>
      </div>

      <div className="wp-scroll" style={{ padding: '6px 0 8px' }}>
        {/* Today card */}
        <div style={{ padding: '0 20px' }}>
          <div className="wp-card" style={{
            padding: '20px 20px 18px', position: 'relative', overflow: 'hidden',
            background: 'var(--wp-ink)', color: '#fff', border: 'none',
          }}>
            <div style={{
              position: 'absolute', top: -60, right: -60, width: 160, height: 160,
              borderRadius: '50%', pointerEvents: 'none',
              background: 'radial-gradient(circle, rgba(242,107,58,0.45), rgba(242,107,58,0) 70%)',
              filter: 'blur(8px)', zIndex: 0,
            }}/>
            <div style={{ position: 'relative' }}>
              <div className="wp-eyebrow" style={{ color: 'var(--wp-orange)' }}>Today · {myGym?.area}</div>
              <h2 className="wp-h2" style={{ color: '#fff', marginTop: 6, marginBottom: 12 }}>
                <em style={{ color: 'var(--wp-orange)', fontStyle: 'italic' }}>14 lifters</em> at your gym this week.
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ display: 'flex' }}>
                  {window.WP_PEOPLE.slice(0, 4).map((p, i) => (
                    <div key={p.id} style={{ marginLeft: i ? -10 : 0, border: '2px solid var(--wp-ink)', borderRadius: 9999 }}>
                      <Avatar person={p} size={32}/>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>+10 more</div>
              </div>
              <button className="wp-btn wp-btn--orange wp-btn--sm" onClick={() => onGoTo('browse')}>
                Browse them <IconChevR size={14}/>
              </button>
            </div>
          </div>
        </div>

        {/* Daily motivation */}
        <div style={{ padding: '20px 20px 0' }}>
          <div style={{
            padding: '16px 18px', borderRadius: 18,
            background: 'var(--wp-orange-soft)', display: 'flex', gap: 14, alignItems: 'flex-start',
          }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 44, color: 'var(--wp-orange)', lineHeight: 0.7, marginTop: -2 }}>“</div>
            <div>
              <div style={{ fontFamily: 'var(--font-condensed)', fontSize: 22, lineHeight: 1.15, color: '#5C2C0F', letterSpacing: '0.01em', textTransform: 'uppercase' }}>
                Showing up beats the perfect program every single day.
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#9B5223', marginTop: 6, letterSpacing: '0.04em' }}>
                — Daily nudge
              </div>
            </div>
          </div>
        </div>

        {/* New at your gym */}
        <div style={{ padding: '24px 0 0' }}>
          <div style={{ padding: '0 20px 12px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, margin: 0, textTransform: 'uppercase', letterSpacing: '-0.005em' }}>New at your gym</h3>
            <button onClick={() => onGoTo('browse')} style={{ fontSize: 13, fontWeight: 600, color: 'var(--wp-orange)' }}>See all →</button>
          </div>
          <div className="no-scrollbar" style={{ display: 'flex', gap: 12, padding: '0 20px', overflowX: 'auto' }}>
            {newPeople.map(p => (
              <button key={p.id} onClick={() => onOpenPerson(p.id)} style={{
                width: 168, flexShrink: 0, textAlign: 'left',
                background: '#fff', border: '1px solid var(--wp-line)', borderRadius: 18, overflow: 'hidden',
              }}>
                <div style={{ height: 140 }}>
                  <ProfilePhoto person={p} height={140} rounded={0}/>
                </div>
                <div style={{ padding: '10px 12px 12px' }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{p.name.split(' ')[0]}, {p.age}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--wp-mute)', marginTop: 2 }}>{p.level} · {p.split}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Activity */}
        <div style={{ padding: '24px 20px 0' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '-0.005em' }}>Recent activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {window.WP_ACTIVITY.map(a => {
              const p = peopleById[a.personId];
              const colors = { pr: 'var(--wp-orange-soft)', streak: 'var(--wp-green-soft)', session: '#EEF2F8', match: 'var(--wp-orange-soft)' };
              return (
                <div key={a.id} className="wp-card" style={{ padding: '12px 14px', display: 'flex', gap: 12, alignItems: 'center' }}>
                  <Avatar person={p} size={42}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, lineHeight: 1.35 }}>
                      <b>{p.name.split(' ')[0]}</b> <span style={{ color: 'var(--wp-mute)' }}>{a.text}</span>
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--wp-mute-2)', marginTop: 2 }}>{a.time}</div>
                  </div>
                  <div style={{
                    width: 30, height: 30, borderRadius: 9999,
                    background: colors[a.kind] || '#EEF2F8', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {a.kind === 'pr' && <IconBolt size={14} color="var(--wp-orange)"/>}
                    {a.kind === 'streak' && <IconFlame size={14} color="#2D6845"/>}
                    {a.kind === 'session' && <IconDumbbell size={14} color="var(--wp-mute)"/>}
                    {a.kind === 'match' && <IconHeart size={14} color="var(--wp-orange)"/>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Premium upsell */}
        <div style={{ padding: '20px 20px 28px' }}>
          <div className="wp-card" style={{
            padding: 18, background: 'linear-gradient(135deg, #FFE4D6, #FFD0B0)',
            border: 'none', display: 'flex', gap: 14, alignItems: 'center',
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14, background: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <IconCrown size={24} color="var(--wp-orange)"/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--wp-ink)' }}>Unlock unlimited matches</div>
              <div style={{ fontSize: 12.5, color: '#7A3815' }}>2 of 2 free profiles used today · $10/mo</div>
            </div>
            <button className="wp-btn wp-btn--orange wp-btn--sm">Upgrade</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// BROWSE — multi-metaphor (swipe / feed / list)
// ────────────────────────────────────────────────────────────
function ScreenBrowse({ user, mode, onMetaphorChange, onOpenPerson, onMatch }) {
  const myGym = window.WP_GYMS.find(g => g.id === user.gym);
  const people = window.WP_PEOPLE.filter(p => p.gym === user.gym || p.distance.includes('mi'));

  return (
    <div className="wp-screen">
      <div style={{ padding: '12px 20px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 className="wp-h1" style={{ fontSize: 30 }}>Browse</h1>
          <div style={{ fontSize: 13, color: 'var(--wp-mute)', marginTop: 2 }}>
            <IconPin size={12} color="var(--wp-mute)" /> {myGym?.name.split('—')[0].trim()} · {people.length} people
          </div>
        </div>
        <button style={{ width: 40, height: 40, borderRadius: 9999, background: '#fff', border: '1px solid var(--wp-line)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconSliders size={18} color="var(--wp-ink)"/>
        </button>
      </div>

      {/* Metaphor switcher */}
      <div style={{ padding: '0 20px 10px' }}>
        <div style={{ display: 'flex', gap: 4, padding: 4, background: '#EEE3D2', borderRadius: 12 }}>
          {[
            { id: 'cards', label: 'Cards', Icon: IconCards },
            { id: 'feed', label: 'Feed', Icon: IconList },
            { id: 'list', label: 'Roster', Icon: IconMap },
          ].map(m => (
            <button key={m.id} onClick={() => onMetaphorChange(m.id)} style={{
              flex: 1, height: 34, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              background: mode === m.id ? '#fff' : 'transparent',
              color: 'var(--wp-ink)', fontSize: 13, fontWeight: 600,
              boxShadow: mode === m.id ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
            }}>
              <m.Icon size={15} color="var(--wp-ink)"/>{m.label}
            </button>
          ))}
        </div>
      </div>

      {mode === 'cards' && <BrowseCards people={people} onOpenPerson={onOpenPerson} onMatch={onMatch}/>}
      {mode === 'feed' && <BrowseFeed people={people} onOpenPerson={onOpenPerson} onMatch={onMatch}/>}
      {mode === 'list' && <BrowseList people={people} onOpenPerson={onOpenPerson} onMatch={onMatch}/>}
    </div>
  );
}

// Cards (Tinder-style swipe)
function BrowseCards({ people, onOpenPerson, onMatch }) {
  const [idx, setIdx] = useStateApp(0);
  const [drag, setDrag] = useStateApp({ x: 0, y: 0, active: false });
  const startRef = useRefApp({ x: 0, y: 0 });

  const onPointerDown = (e) => {
    startRef.current = { x: e.clientX, y: e.clientY };
    setDrag({ x: 0, y: 0, active: true });
  };
  const onPointerMove = (e) => {
    if (!drag.active) return;
    setDrag({ x: e.clientX - startRef.current.x, y: e.clientY - startRef.current.y, active: true });
  };
  const onPointerUp = () => {
    if (Math.abs(drag.x) > 90) {
      const liked = drag.x > 0;
      if (liked && Math.random() > 0.5) onMatch?.(people[idx]);
      setIdx(i => Math.min(i + 1, people.length));
    }
    setDrag({ x: 0, y: 0, active: false });
  };

  if (idx >= people.length) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>🏁</div>
        <div className="wp-h2">You've seen everyone.</div>
        <p style={{ fontSize: 14, color: 'var(--wp-mute)', marginTop: 8, maxWidth: 260 }}>New lifters check in daily. We'll ping you when someone new arrives at your gym.</p>
        <button className="wp-btn wp-btn--orange wp-btn--sm" style={{ marginTop: 18 }} onClick={() => setIdx(0)}>Start over</button>
      </div>
    );
  }

  const top = people[idx];
  const next = people[idx + 1];
  const rotation = drag.x * 0.06;
  const likeOpacity = Math.max(0, Math.min(1, drag.x / 100));
  const nopeOpacity = Math.max(0, Math.min(1, -drag.x / 100));

  return (
    <div style={{ flex: 1, padding: '6px 20px 12px', position: 'relative', overflow: 'hidden' }}>
      {/* next card behind */}
      {next && (
        <div style={{
          position: 'absolute', inset: '6px 28px 80px', borderRadius: 24,
          transform: 'scale(0.95)', opacity: 0.7, pointerEvents: 'none',
        }}>
          <CardFace person={next} compact/>
        </div>
      )}
      {/* top card */}
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClick={() => Math.abs(drag.x) < 5 && onOpenPerson(top.id)}
        style={{
          position: 'absolute', inset: '6px 20px 80px', borderRadius: 24,
          transform: `translate(${drag.x}px, ${drag.y * 0.4}px) rotate(${rotation}deg)`,
          transition: drag.active ? 'none' : 'transform .35s cubic-bezier(.2,1.2,.4,1)',
          touchAction: 'none', userSelect: 'none',
        }}>
        <CardFace person={top} likeOpacity={likeOpacity} nopeOpacity={nopeOpacity}/>
      </div>

      {/* Swipe action buttons */}
      <div style={{
        position: 'absolute', bottom: 16, left: 0, right: 0,
        display: 'flex', justifyContent: 'center', gap: 18, pointerEvents: 'none',
      }}>
        <button onClick={() => setIdx(i => i + 1)} style={{
          pointerEvents: 'auto', width: 56, height: 56, borderRadius: 9999,
          background: '#fff', border: '1.5px solid var(--wp-line)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'var(--shadow-card)',
        }}>
          <IconClose size={24} color="var(--wp-mute)"/>
        </button>
        <button onClick={() => onOpenPerson(top.id)} style={{
          pointerEvents: 'auto', width: 50, height: 50, borderRadius: 9999,
          background: '#fff', border: '1.5px solid var(--wp-line)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'var(--shadow-card)',
        }}>
          <IconUser size={20} color="var(--wp-ink)"/>
        </button>
        <button onClick={() => { onMatch?.(top); setIdx(i => i + 1); }} style={{
          pointerEvents: 'auto', width: 56, height: 56, borderRadius: 9999,
          background: 'var(--wp-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 6px 18px rgba(242,107,58,0.4)',
        }}>
          <IconDumbbell size={24} color="#fff"/>
        </button>
      </div>
    </div>
  );
}

function CardFace({ person, likeOpacity = 0, nopeOpacity = 0, compact }) {
  return (
    <div style={{
      width: '100%', height: '100%', borderRadius: 24, overflow: 'hidden',
      background: '#fff', border: '1px solid var(--wp-line)',
      boxShadow: '0 4px 16px rgba(11,31,58,0.08), 0 18px 40px rgba(11,31,58,0.10)',
      position: 'relative', display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ flex: 1, position: 'relative' }}>
        <ProfilePhoto person={person} height="100%" rounded={0}/>
        {/* Same gym badge */}
        <div style={{
          position: 'absolute', top: 14, left: 14,
          background: 'rgba(255,255,255,0.95)', borderRadius: 9999,
          padding: '5px 10px', fontSize: 11, fontWeight: 700, color: 'var(--wp-ink)',
          display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap',
        }}>
          <div style={{ width: 6, height: 6, borderRadius: 9999, background: 'var(--wp-green)' }}/>
          {person.distance}
        </div>
        {/* LIKE / NOPE overlays */}
        {!compact && (
          <>
            <div style={{
              position: 'absolute', top: 32, right: 24, padding: '8px 14px',
              border: '3px solid var(--wp-green)', color: 'var(--wp-green)',
              fontSize: 22, fontWeight: 800, letterSpacing: '0.05em',
              borderRadius: 10, transform: 'rotate(15deg)', opacity: likeOpacity,
              background: 'rgba(255,255,255,0.9)',
            }}>LIFT</div>
            <div style={{
              position: 'absolute', top: 32, left: 24, padding: '8px 14px',
              border: '3px solid #C7415B', color: '#C7415B',
              fontSize: 22, fontWeight: 800, letterSpacing: '0.05em',
              borderRadius: 10, transform: 'rotate(-15deg)', opacity: nopeOpacity,
              background: 'rgba(255,255,255,0.9)',
            }}>PASS</div>
          </>
        )}
        {/* Bottom info */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '40px 18px 18px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0))',
          color: '#fff',
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, lineHeight: 1, whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '-0.01em' }}>{person.name}</div>
            <div style={{ fontSize: 16, opacity: 0.7 }}>{person.age}</div>
          </div>
          <div style={{ fontSize: 12.5, opacity: 0.85, marginTop: 6, lineHeight: 1.4 }}>
            {person.level} · {person.split}<br/>{person.schedule}
          </div>
        </div>
      </div>
      {!compact && (
        <div style={{ padding: '14px 18px 16px', background: '#fff' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
            {person.goals.map(g => <span key={g} className="wp-chip wp-chip--orange">{g}</span>)}
            {person.vibe.slice(0, 2).map(v => <span key={v} className="wp-chip wp-chip--green">{v}</span>)}
          </div>
          <div style={{ fontSize: 13, color: 'var(--wp-mute)', lineHeight: 1.4 }}>
            {person.bio}
          </div>
        </div>
      )}
    </div>
  );
}

// Feed (vertical scrolling cards)
function BrowseFeed({ people, onOpenPerson, onMatch }) {
  return (
    <div className="wp-scroll" style={{ padding: '6px 20px 16px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {people.map(p => (
          <div key={p.id} className="wp-card" style={{ overflow: 'hidden' }}>
            <button onClick={() => onOpenPerson(p.id)} style={{ width: '100%', textAlign: 'left' }}>
              <ProfilePhoto person={p} height={300} rounded={0}/>
            </button>
            <div style={{ padding: '14px 16px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
                <div>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: 1, textTransform: 'uppercase', letterSpacing: '-0.005em' }}>{p.name}</span>
                  <span style={{ fontSize: 16, color: 'var(--wp-mute)', marginLeft: 6 }}>{p.age}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--wp-mute)' }}>
                  <IconStar size={14} color="var(--wp-orange)"/>{p.rating}
                </div>
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--wp-mute)', marginBottom: 10 }}>
                {p.level} · {p.split} · {p.schedule}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                {p.goals.slice(0, 2).map(g => <span key={g} className="wp-chip wp-chip--orange">{g}</span>)}
                {p.vibe.slice(0, 1).map(v => <span key={v} className="wp-chip wp-chip--green">{v}</span>)}
              </div>
              <p style={{ fontSize: 13.5, color: 'var(--wp-ink)', lineHeight: 1.45, margin: '0 0 14px' }}>{p.bio}</p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="wp-btn wp-btn--ghost wp-btn--sm" style={{ flex: 1, background: '#fff' }} onClick={() => onOpenPerson(p.id)}>View profile</button>
                <button className="wp-btn wp-btn--orange wp-btn--sm" style={{ flex: 1 }} onClick={() => onMatch?.(p)}>
                  <IconDumbbell size={15} color="#fff"/> Lift together
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// List / Roster (compact rows)
function BrowseList({ people, onOpenPerson, onMatch }) {
  const buckets = useMemo(() => {
    const b = { 'Beginner': [], 'Intermediate': [], 'Advanced': [] };
    people.forEach(p => b[p.level]?.push(p));
    return b;
  }, [people]);
  return (
    <div className="wp-scroll" style={{ padding: '6px 20px 16px' }}>
      {Object.entries(buckets).map(([lvl, list]) => list.length ? (
        <div key={lvl} style={{ marginBottom: 22 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
            <div className="wp-eyebrow">{lvl}</div>
            <div style={{ fontSize: 12, color: 'var(--wp-mute)' }}>{list.length} {list.length === 1 ? 'person' : 'people'}</div>
          </div>
          <div className="wp-card" style={{ padding: 0, overflow: 'hidden' }}>
            {list.map((p, i) => (
              <div key={p.id} style={{
                padding: '14px 14px', display: 'flex', alignItems: 'center', gap: 12,
                borderTop: i ? '1px solid var(--wp-line)' : 'none',
              }}>
                <button onClick={() => onOpenPerson(p.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, textAlign: 'left' }}>
                  <Avatar person={p} size={48}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                      <span style={{ fontSize: 14.5, fontWeight: 700 }}>{p.name}</span>
                      <span style={{ fontSize: 12, color: 'var(--wp-mute)' }}>{p.age}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--wp-mute)', marginTop: 2 }}>
                      {p.split} · {p.schedule}
                    </div>
                    <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                      {p.goals.slice(0, 2).map(g => (
                        <span key={g} style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--wp-orange)', background: 'var(--wp-orange-soft)', padding: '2px 7px', borderRadius: 9999 }}>{g}</span>
                      ))}
                    </div>
                  </div>
                </button>
                <button onClick={() => onMatch?.(p)} style={{
                  width: 38, height: 38, borderRadius: 9999,
                  background: 'var(--wp-orange-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <IconDumbbell size={18} color="var(--wp-orange)"/>
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null)}
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// PROFILE DETAIL (modal)
// ────────────────────────────────────────────────────────────
function ProfileDetail({ person, onClose, onMatch }) {
  if (!person) return null;
  return (
    <div className="wp-screen" style={{ position: 'absolute', inset: 0, zIndex: 50, animation: 'wp-fade-up .25s ease both' }}>
      <div className="wp-scroll">
        <div style={{ position: 'relative' }}>
          <ProfilePhoto person={person} height={420} rounded={0}/>
          <button onClick={onClose} style={{
            position: 'absolute', top: 14, left: 14, width: 38, height: 38, borderRadius: 9999,
            background: 'rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}>
            <IconBack size={18} color="var(--wp-ink)"/>
          </button>
          <button style={{
            position: 'absolute', top: 14, right: 14, width: 38, height: 38, borderRadius: 9999,
            background: 'rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <IconMore size={18} color="var(--wp-ink)"/>
          </button>
        </div>
        <div style={{ padding: '20px 22px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <h1 className="wp-h1" style={{ fontSize: 36 }}>{person.name}</h1>
            <span style={{ fontSize: 22, color: 'var(--wp-mute)' }}>{person.age}</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', marginTop: 6, fontSize: 13, color: 'var(--wp-mute)' }}>
            <IconPin size={14} color="var(--wp-mute)"/>{person.distance}
            <span>·</span>
            <IconClock size={14} color="var(--wp-mute)"/>{person.schedule}
          </div>

          {/* stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 18 }}>
            <Stat label="Rating" value={person.rating} icon={<IconStar size={14} color="var(--wp-orange)"/>}/>
            <Stat label="Sessions" value={person.sessions}/>
            <Stat label="Streak" value={`${person.streak}d`} icon={<IconFlame size={14} color="var(--wp-orange)"/>}/>
          </div>

          <Section title="About">
            <p style={{ fontSize: 15, lineHeight: 1.55, margin: 0, color: 'var(--wp-ink)' }}>{person.bio}</p>
          </Section>

          <Section title="Training">
            <Row label="Level" value={person.level}/>
            <Row label="Split" value={person.split}/>
            <Row label="Schedule" value={person.schedule}/>
          </Section>

          <Section title="Goals">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {person.goals.map(g => <span key={g} className="wp-chip wp-chip--orange">{g}</span>)}
            </div>
          </Section>

          <Section title="Vibe">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {person.vibe.map(v => <span key={v} className="wp-chip wp-chip--green">{v}</span>)}
            </div>
          </Section>

          <div style={{ height: 80 }}/>
        </div>
      </div>
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '14px 22px 28px', borderTop: '1px solid var(--wp-line)',
        background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(10px)',
        display: 'flex', gap: 10,
      }}>
        <button className="wp-btn wp-btn--ghost" style={{ flex: 0, padding: '0 18px', background: '#fff' }} onClick={onClose}>Pass</button>
        <button className="wp-btn wp-btn--orange" style={{ flex: 1 }} onClick={() => { onMatch?.(person); onClose(); }}>
          <IconDumbbell size={18} color="#fff"/> Lift with {person.name.split(' ')[0]}
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value, icon }) {
  return (
    <div style={{ background: '#fff', border: '1px solid var(--wp-line)', borderRadius: 14, padding: '10px 12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 18, fontWeight: 700 }}>
        {icon}{value}
      </div>
      <div style={{ fontSize: 11, color: 'var(--wp-mute)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>{label}</div>
    </div>
  );
}
function Section({ title, children }) {
  return (
    <div style={{ marginTop: 22 }}>
      <div className="wp-eyebrow" style={{ marginBottom: 10 }}>{title}</div>
      {children}
    </div>
  );
}
function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--wp-line)' }}>
      <span style={{ fontSize: 13, color: 'var(--wp-mute)' }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 600 }}>{value}</span>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// MATCHES
// ────────────────────────────────────────────────────────────
function ScreenMatches({ onOpenChat, onOpenPerson }) {
  const peopleById = Object.fromEntries(window.WP_PEOPLE.map(p => [p.id, p]));
  const newMatches = window.WP_PEOPLE.slice(0, 6);
  return (
    <div className="wp-screen">
      <div style={{ padding: '12px 20px 6px' }}>
        <h1 className="wp-h1" style={{ fontSize: 32 }}>Matches</h1>
      </div>
      <div className="wp-scroll" style={{ padding: '6px 0 8px' }}>
        <div style={{ padding: '6px 20px 0' }}>
          <div className="wp-eyebrow" style={{ marginBottom: 10 }}>New · {newMatches.length}</div>
          <div className="no-scrollbar" style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 6 }}>
            {newMatches.map(p => (
              <button key={p.id} onClick={() => onOpenPerson(p.id)} style={{ textAlign: 'center', flexShrink: 0, width: 78 }}>
                <div style={{
                  padding: 3, borderRadius: 9999,
                  background: 'linear-gradient(135deg, var(--wp-orange), var(--wp-green))',
                }}>
                  <div style={{ background: 'var(--wp-cream)', borderRadius: 9999, padding: 2 }}>
                    <Avatar person={p} size={66}/>
                  </div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, marginTop: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name.split(' ')[0]}</div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: '20px 20px 0' }}>
          <div className="wp-eyebrow" style={{ marginBottom: 10 }}>Chats</div>
          <div className="wp-card" style={{ padding: 0, overflow: 'hidden' }}>
            {window.WP_THREADS.map((t, i) => {
              const p = peopleById[t.personId];
              return (
                <button key={t.id} onClick={() => onOpenChat(t.id)} style={{
                  width: '100%', padding: '14px 14px', display: 'flex', alignItems: 'center', gap: 12,
                  borderTop: i ? '1px solid var(--wp-line)' : 'none', textAlign: 'left',
                }}>
                  <Avatar person={p} size={50}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
                      <span style={{ fontSize: 14.5, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</span>
                      <span style={{ fontSize: 11, color: 'var(--wp-mute-2)', flexShrink: 0 }}>{t.lastTime}</span>
                    </div>
                    <div style={{ fontSize: 13, color: t.unread ? 'var(--wp-ink)' : 'var(--wp-mute)', fontWeight: t.unread ? 600 : 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2 }}>
                      {t.last}
                    </div>
                  </div>
                  {t.unread > 0 && (
                    <div style={{
                      minWidth: 22, height: 22, padding: '0 7px', borderRadius: 9999,
                      background: 'var(--wp-orange)', color: '#fff', fontSize: 11, fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>{t.unread}</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// CHAT
// ────────────────────────────────────────────────────────────
function ScreenChat({ threadId, onBack }) {
  const thread = window.WP_THREADS.find(t => t.id === threadId);
  const person = window.WP_PEOPLE.find(p => p.id === thread?.personId);
  const [msgs, setMsgs] = useStateApp(thread?.messages || []);
  const [input, setInput] = useStateApp('');
  const scrollRef = useRefApp(null);

  useEffectApp(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs]);

  const send = () => {
    if (!input.trim()) return;
    setMsgs(m => [...m, { from: 'me', text: input, time: 'now' }]);
    setInput('');
    setTimeout(() => {
      setMsgs(m => [...m, { from: 'them', text: 'Sounds good — see you there 💪', time: 'now' }]);
    }, 1100);
  };

  if (!thread) return null;

  return (
    <div className="wp-screen">
      {/* Header */}
      <div style={{ padding: '8px 14px 10px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--wp-line)', background: '#fff' }}>
        <button onClick={onBack} style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconBack size={20} color="var(--wp-ink)"/>
        </button>
        <Avatar person={person} size={38}/>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.1 }}>{person.name}</div>
          <div style={{ fontSize: 11.5, color: 'var(--wp-green)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
            <span className="wp-dot" style={{ width: 6, height: 6 }}/> at the gym now
          </div>
        </div>
        <button style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconMore size={20} color="var(--wp-ink)"/>
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="wp-scroll" style={{ padding: '14px 16px 8px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* Match banner */}
        <div style={{
          textAlign: 'center', padding: '10px 14px',
          background: 'var(--wp-orange-soft)', borderRadius: 14,
          fontSize: 12.5, color: '#7A3815', margin: '4px auto 8px', maxWidth: 280,
        }}>
          You matched 3 days ago · Both train at Planet Fitness Southside
        </div>

        {msgs.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.from === 'me' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '76%', padding: '10px 14px',
              borderRadius: m.from === 'me' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: m.from === 'me' ? 'var(--wp-ink)' : '#fff',
              color: m.from === 'me' ? '#fff' : 'var(--wp-ink)',
              border: m.from === 'me' ? 'none' : '1px solid var(--wp-line)',
              fontSize: 14.5, lineHeight: 1.4,
            }}>{m.text}</div>
          </div>
        ))}
      </div>

      {/* Quick reply chips */}
      <div className="no-scrollbar" style={{ display: 'flex', gap: 8, padding: '6px 16px 8px', overflowX: 'auto' }}>
        {['📅 Lift today?', '6am works', '🤝 Spot me?', 'Running 10 late'].map(q => (
          <button key={q} onClick={() => setInput(q)} style={{
            padding: '8px 14px', borderRadius: 9999, background: '#fff',
            border: '1px solid var(--wp-line)', fontSize: 13, fontWeight: 500,
            whiteSpace: 'nowrap', flexShrink: 0,
          }}>{q}</button>
        ))}
      </div>

      {/* Composer */}
      <div style={{ padding: '6px 12px 18px', display: 'flex', gap: 8, alignItems: 'center', background: 'var(--wp-cream)', borderTop: '1px solid var(--wp-line)' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Message…"
          style={{
            flex: 1, height: 44, background: '#fff',
            border: '1px solid var(--wp-line)', borderRadius: 9999,
            padding: '0 18px', fontSize: 14.5, outline: 'none', color: 'var(--wp-ink)',
          }}
        />
        <button onClick={send} style={{
          width: 44, height: 44, borderRadius: 9999, background: 'var(--wp-orange)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(242,107,58,0.35)',
        }}>
          <IconSend size={18} color="#fff"/>
        </button>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// ME (profile)
// ────────────────────────────────────────────────────────────
function ScreenMe({ user, onLogout }) {
  const myPerson = {
    id: 'me', name: 'Alex Morgan', age: 29, hue: 24,
  };
  const myGym = window.WP_GYMS.find(g => g.id === user.gym);
  return (
    <div className="wp-screen">
      <div className="wp-scroll" style={{ padding: '12px 20px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <h1 className="wp-h1" style={{ fontSize: 32 }}>You</h1>
          <button style={{ width: 40, height: 40, borderRadius: 9999, background: '#fff', border: '1px solid var(--wp-line)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconSliders size={18} color="var(--wp-ink)"/>
          </button>
        </div>

        {/* Hero card */}
        <div className="wp-card" style={{ padding: 0, overflow: 'hidden' }}>
          <ProfilePhoto person={myPerson} height={220} rounded={0}/>
          <div style={{ padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <h2 className="wp-h2" style={{ fontSize: 24 }}>Alex Morgan</h2>
              <span style={{ fontSize: 14, color: 'var(--wp-mute)' }}>· {user.level || 'Intermediate'}</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--wp-mute)', marginTop: 4 }}>
              <IconPin size={12} color="var(--wp-mute)"/> {myGym?.name}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              <button className="wp-btn wp-btn--ghost wp-btn--sm" style={{ flex: 1, background: '#fff' }}>Edit profile</button>
              <button className="wp-btn wp-btn--sm" style={{ flex: 1, background: 'var(--wp-ink)' }}>Preview</button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 14 }}>
          <Stat label="Streak" value="9d" icon={<IconFlame size={14} color="var(--wp-orange)"/>}/>
          <Stat label="Sessions" value="34"/>
          <Stat label="Matches" value="7"/>
        </div>

        {/* Premium upsell */}
        <div className="wp-card" style={{
          marginTop: 18, padding: 18, background: 'var(--wp-ink)', color: '#fff', border: 'none',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(242,107,58,0.4), rgba(242,107,58,0) 70%)',
          }}/>
          <div style={{ position: 'relative' }}>
            <div className="wp-eyebrow" style={{ color: 'var(--wp-orange)' }}>Patna Plus</div>
            <h3 className="wp-h2" style={{ color: '#fff', fontSize: 22, marginTop: 4 }}>
              Unlimited matches. <em style={{ color: 'var(--wp-orange)', fontStyle: 'italic' }}>$10/mo.</em>
            </h3>
            <ul style={{ margin: '12px 0', padding: 0, listStyle: 'none', fontSize: 13.5, opacity: 0.85, lineHeight: 1.7 }}>
              <li>· See who lifted you</li>
              <li>· Filter by schedule + split</li>
              <li>· Verified badge</li>
            </ul>
            <button className="wp-btn wp-btn--orange wp-btn--sm">Upgrade — $10/mo</button>
          </div>
        </div>

        {/* Settings list */}
        <div style={{ marginTop: 18 }}>
          <div className="wp-card" style={{ padding: 0, overflow: 'hidden' }}>
            {[
              ['My gyms', myGym?.area],
              ['Schedule', 'Weekday 6–7am'],
              ['Privacy', 'Visible to gym'],
              ['Notifications', 'On'],
              ['Help & safety', null],
            ].map(([label, val], i) => (
              <button key={label} style={{
                width: '100%', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderTop: i ? '1px solid var(--wp-line)' : 'none', textAlign: 'left',
              }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{label}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--wp-mute)' }}>
                  {val}<IconChevR size={16} color="var(--wp-mute-2)"/>
                </span>
              </button>
            ))}
          </div>
        </div>

        <button onClick={onLogout} style={{ width: '100%', padding: '14px', marginTop: 12, fontSize: 13.5, color: 'var(--wp-mute)', fontWeight: 600 }}>
          Sign out
        </button>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// MATCH POPUP
// ────────────────────────────────────────────────────────────
function MatchPopup({ person, onClose, onMessage }) {
  if (!person) return null;
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 60,
      background: 'rgba(11,31,58,0.85)', backdropFilter: 'blur(8px)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 32,
    }}>
      <div className="wp-pop" style={{ textAlign: 'center', color: '#fff', marginBottom: 24 }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 900,
          fontSize: 64, lineHeight: 1, color: 'var(--wp-orange)', textTransform: 'uppercase', letterSpacing: '-0.02em',
        }}>It's a Lift!</div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', marginTop: 8 }}>
          You and {person.name.split(' ')[0]} both want to train together.
        </div>
      </div>
      <div className="wp-pop" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28, animationDelay: '.1s' }}>
        <div style={{ padding: 4, borderRadius: 9999, background: 'var(--wp-orange)' }}>
          <Avatar person={{ name: 'Alex Morgan', hue: 24 }} size={86}/>
        </div>
        <div style={{ fontSize: 32 }}>🤝</div>
        <div style={{ padding: 4, borderRadius: 9999, background: 'var(--wp-orange)' }}>
          <Avatar person={person} size={86}/>
        </div>
      </div>
      <button className="wp-btn wp-btn--orange wp-pop" style={{ width: '100%', maxWidth: 280, animationDelay: '.2s' }} onClick={onMessage}>
        <IconChat size={18} color="#fff"/> Send a message
      </button>
      <button onClick={onClose} style={{ marginTop: 12, padding: 12, fontSize: 13.5, color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>
        Keep browsing
      </button>
    </div>
  );
}

Object.assign(window, {
  Avatar, ProfilePhoto, TabBar,
  ScreenHome, ScreenBrowse, ScreenMatches, ScreenChat, ScreenMe,
  ProfileDetail, MatchPopup,
});
