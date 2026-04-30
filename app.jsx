// Workout Patna — root app (router + tweaks)

const { useState, useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "matchMode": "cards",
  "palette": "default",
  "density": "comfortable",
  "startScreen": "auth"
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = window.useTweaks(TWEAK_DEFAULTS);

  // Top-level route
  const [route, setRoute] = useState(tweaks.startScreen || 'auth'); // auth | onboard | app
  const [authMode, setAuthMode] = useState('signup');

  // Onboarding state
  const [onbStep, setOnbStep] = useState(1);
  const [onb, setOnb] = useState({ gym: null, level: null, goals: [], vibe: [] });

  // App state
  const [tab, setTab] = useState('home');
  const [openPersonId, setOpenPersonId] = useState(null);
  const [openThreadId, setOpenThreadId] = useState(null);
  const [matchedPerson, setMatchedPerson] = useState(null);

  const user = { gym: onb.gym || 'planet-southside', level: onb.level || 'Intermediate' };

  // Apply palette class to wrapper
  const paletteCls = tweaks.palette === 'dusk' ? 'palette-dusk'
                    : tweaks.palette === 'court' ? 'palette-court' : '';

  // Onboarding navigation
  const onbNext = () => {
    if (onbStep < 4) setOnbStep(onbStep + 1);
    else setRoute('app');
  };
  const onbBack = () => {
    if (onbStep > 1) setOnbStep(onbStep - 1);
    else setRoute('auth');
  };

  let screen;
  if (route === 'auth') {
    screen = <ScreenAuth mode={authMode} setMode={setAuthMode} onContinue={() => { setRoute('onboard'); setOnbStep(1); }}/>;
  } else if (route === 'onboard') {
    const shellProps = {
      step: onbStep, total: 4,
      onBack: onbBack,
      onNext: onbNext,
      onSkip: onbStep === 4 ? null : () => setOnbStep(onbStep + 1),
    };
    if (onbStep === 1) screen = <ScreenOnboardGym {...shellProps} value={onb.gym} setValue={(v) => setOnb({ ...onb, gym: v })} nextDisabled={!onb.gym}/>;
    else if (onbStep === 2) screen = <ScreenOnboardLevel {...shellProps} value={onb.level} setValue={(v) => setOnb({ ...onb, level: v })} nextDisabled={!onb.level}/>;
    else if (onbStep === 3) screen = <ScreenOnboardGoals {...shellProps} value={onb.goals} setValue={(v) => setOnb({ ...onb, goals: v })} nextDisabled={onb.goals.length === 0}/>;
    else screen = <ScreenOnboardVibe {...shellProps} value={onb.vibe} setValue={(v) => setOnb({ ...onb, vibe: v })} nextDisabled={onb.vibe.length === 0}/>;
  } else {
    // app
    if (openThreadId) {
      screen = <ScreenChat threadId={openThreadId} onBack={() => setOpenThreadId(null)}/>;
    } else {
      const tabScreen = (() => {
        if (tab === 'home') return <ScreenHome user={user} onOpenPerson={setOpenPersonId} onGoTo={setTab}/>;
        if (tab === 'browse') return <ScreenBrowse user={user} mode={tweaks.matchMode} onMetaphorChange={(m) => setTweak('matchMode', m)} onOpenPerson={setOpenPersonId} onMatch={setMatchedPerson}/>;
        if (tab === 'matches') return <ScreenMatches onOpenChat={setOpenThreadId} onOpenPerson={setOpenPersonId}/>;
        if (tab === 'chat') return <ScreenMatches onOpenChat={setOpenThreadId} onOpenPerson={setOpenPersonId}/>;
        if (tab === 'me') return <ScreenMe user={user} onLogout={() => setRoute('auth')}/>;
      })();

      screen = (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
            {tabScreen}
          </div>
          <TabBar active={tab} onChange={setTab} badge={{ matches: 6, chat: 2 }}/>
        </div>
      );
    }
  }

  // Profile detail overlay (works across tabs)
  const openPerson = openPersonId ? window.WP_PEOPLE.find(p => p.id === openPersonId) : null;

  return (
    <div className={paletteCls} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <window.IOSDevice width={402} height={874} dark={route === 'auth'} dynamicIsland>
        <div style={{ width: '100%', height: '100%', position: 'relative', background: 'var(--wp-cream)' }}>
          {screen}
          {openPerson && route === 'app' && (
            <ProfileDetail
              person={openPerson}
              onClose={() => setOpenPersonId(null)}
              onMatch={(p) => { setMatchedPerson(p); }}
            />
          )}
          {matchedPerson && (
            <MatchPopup
              person={matchedPerson}
              onClose={() => setMatchedPerson(null)}
              onMessage={() => {
                setMatchedPerson(null);
                setOpenPersonId(null);
                // open existing thread if exists else 1st
                const existing = window.WP_THREADS.find(t => t.personId === matchedPerson.id);
                setOpenThreadId(existing ? existing.id : window.WP_THREADS[0].id);
                setTab('chat');
              }}
            />
          )}
        </div>
      </window.IOSDevice>

      {/* Tweaks panel */}
      <window.TweaksPanel title="Tweaks">
        <window.TweakSection label="Match metaphor"/>
        <window.TweakRadio
          label="Browse style"
          value={tweaks.matchMode}
          onChange={(v) => setTweak('matchMode', v)}
          options={[
            { value: 'cards', label: 'Cards' },
            { value: 'feed', label: 'Feed' },
            { value: 'list', label: 'Roster' },
          ]}
        />
        <window.TweakSection label="Palette"/>
        <window.TweakRadio
          label="Color"
          value={tweaks.palette}
          onChange={(v) => setTweak('palette', v)}
          options={[
            { value: 'default', label: 'Default' },
            { value: 'dusk', label: 'Dusk' },
            { value: 'court', label: 'Court' },
          ]}
        />
        <window.TweakSection label="Jump to"/>
        <window.TweakButton label="Auth screen" onClick={() => { setRoute('auth'); }}/>
        <window.TweakButton label="Onboarding" onClick={() => { setRoute('onboard'); setOnbStep(1); }}/>
        <window.TweakButton label="Home" onClick={() => { setRoute('app'); setTab('home'); }}/>
        <window.TweakButton label="Browse" onClick={() => { setRoute('app'); setTab('browse'); }}/>
        <window.TweakButton label="Matches" onClick={() => { setRoute('app'); setTab('matches'); }}/>
        <window.TweakButton label="Open chat" onClick={() => { setRoute('app'); setOpenThreadId('t1'); }}/>
        <window.TweakButton label="Me" onClick={() => { setRoute('app'); setTab('me'); }}/>
      </window.TweaksPanel>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
