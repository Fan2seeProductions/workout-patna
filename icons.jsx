// Workout Patna — small icon set (stroke-based)
// All icons accept { size, color, strokeWidth }

const Icon = ({ children, size = 22, color = 'currentColor', strokeWidth = 1.8, fill = 'none', viewBox = '0 0 24 24' }) => (
  <svg width={size} height={size} viewBox={viewBox} fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', flexShrink: 0 }}>
    {children}
  </svg>
);

const IconHome = (p) => <Icon {...p}><path d="M3 11.5L12 4l9 7.5"/><path d="M5 10v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9"/><path d="M10 20v-6h4v6"/></Icon>;
const IconSearch = (p) => <Icon {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></Icon>;
const IconSpark = (p) => <Icon {...p}><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.5 5.5l2.1 2.1M16.4 16.4l2.1 2.1M5.5 18.5l2.1-2.1M16.4 7.6l2.1-2.1"/><circle cx="12" cy="12" r="3.5"/></Icon>;
const IconChat = (p) => <Icon {...p}><path d="M21 12a8 8 0 1 1-3.4-6.5L21 4l-1.5 3.5A8 8 0 0 1 21 12Z"/><path d="M8 11h.01M12 11h.01M16 11h.01"/></Icon>;
const IconUser = (p) => <Icon {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></Icon>;
const IconPlus = (p) => <Icon {...p}><path d="M12 5v14M5 12h14"/></Icon>;
const IconBack = (p) => <Icon {...p}><path d="m15 6-6 6 6 6"/></Icon>;
const IconClose = (p) => <Icon {...p}><path d="M18 6 6 18M6 6l12 12"/></Icon>;
const IconCheck = (p) => <Icon {...p}><path d="m5 12 5 5L20 7"/></Icon>;
const IconHeart = (p) => <Icon {...p}><path d="M12 21s-7-4.35-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.65-9.5 9-9.5 9Z"/></Icon>;
const IconX = IconClose;
const IconBolt = (p) => <Icon {...p} fill={p.fill || 'currentColor'} stroke="none"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z"/></Icon>;
const IconFlame = (p) => <Icon {...p}><path d="M12 22c4 0 7-3 7-7 0-4-3-6-3-9 0 0-2 2-3 4-1-3-4-5-4-5s-3 3-3 7c0 4 2 6 2 8 0 1 1 2 4 2Z"/></Icon>;
const IconPin = (p) => <Icon {...p}><path d="M12 22s7-7.5 7-13a7 7 0 1 0-14 0c0 5.5 7 13 7 13Z"/><circle cx="12" cy="9" r="2.5"/></Icon>;
const IconClock = (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></Icon>;
const IconStar = (p) => <Icon {...p} fill="currentColor" stroke="none"><path d="m12 3 2.6 5.6 6.1.6-4.6 4.2 1.3 6L12 16.5 6.6 19.4l1.3-6L3.3 9.2l6.1-.6L12 3Z"/></Icon>;
const IconDumbbell = (p) => <Icon {...p}><path d="M3 9v6M6 6v12M10 8v8M14 8v8M18 6v12M21 9v6M6 12h12"/></Icon>;
const IconShield = (p) => <Icon {...p}><path d="M12 3 4 6v6c0 4.5 3.5 8 8 9 4.5-1 8-4.5 8-9V6l-8-3Z"/></Icon>;
const IconSliders = (p) => <Icon {...p}><path d="M4 6h16M4 12h16M4 18h16"/><circle cx="9" cy="6" r="2.2" fill="white"/><circle cx="15" cy="12" r="2.2" fill="white"/><circle cx="7" cy="18" r="2.2" fill="white"/></Icon>;
const IconSend = (p) => <Icon {...p}><path d="m4 12 16-8-6 18-2-8-8-2Z"/></Icon>;
const IconMore = (p) => <Icon {...p}><circle cx="5" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="19" cy="12" r="1.4" fill="currentColor"/></Icon>;
const IconChevR = (p) => <Icon {...p}><path d="m9 6 6 6-6 6"/></Icon>;
const IconList = (p) => <Icon {...p}><path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1.2" fill="currentColor"/><circle cx="4" cy="12" r="1.2" fill="currentColor"/><circle cx="4" cy="18" r="1.2" fill="currentColor"/></Icon>;
const IconCards = (p) => <Icon {...p}><rect x="6" y="3" width="14" height="18" rx="2.5"/><path d="M3 7v12a2 2 0 0 0 2 2h11"/></Icon>;
const IconMap = (p) => <Icon {...p}><path d="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2V6Z"/><path d="M9 4v16M15 6v16"/></Icon>;
const IconCrown = (p) => <Icon {...p}><path d="m3 7 4 4 5-7 5 7 4-4-2 12H5L3 7Z"/></Icon>;

Object.assign(window, {
  IconHome, IconSearch, IconSpark, IconChat, IconUser, IconPlus,
  IconBack, IconClose, IconCheck, IconHeart, IconX, IconBolt,
  IconFlame, IconPin, IconClock, IconStar, IconDumbbell, IconShield,
  IconSliders, IconSend, IconMore, IconChevR, IconList, IconCards, IconMap, IconCrown,
});
