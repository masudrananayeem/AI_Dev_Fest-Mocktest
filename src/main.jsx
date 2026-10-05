import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Download,
  FileJson,
  GitBranch,
  Languages,
  MapPin,
  Moon,
  RotateCcw,
  Route,
  Save,
  ShieldAlert,
  Sun,
  Upload,
  XCircle,
} from 'lucide-react';
import './styles.css';

const SAMPLE_URL = '/building.json';

const I18N = {
  en: {
    appEyebrow: 'AI DevFest 2026 • Practice',
    title: 'Smart Escape',
    subtitle: 'Interactive evacuation route simulator',
    description: 'Load a building graph, simulate hazards, and instantly find the lowest-cost route to an open exit.',
    importTitle: 'Import building.json',
    importHint: 'Use the supplied JSON schema. Judges may use unseen graphs.',
    chooseFile: 'Choose JSON file',
    sample: 'Load sample',
    reset: 'Reset',
    save: 'Save progress',
    saved: 'Saved',
    language: 'Language',
    contrast: 'High contrast',
    map: 'Interactive map',
    start: 'Starting location',
    selectStart: 'Select a room or junction',
    route: 'Recommended route',
    cost: 'Total cost',
    exit: 'Exit',
    corridors: 'Corridors',
    sequence: 'Node sequence',
    noRoute: 'No route available',
    blockedStart: 'Starting location blocked',
    chooseStart: 'Choose an unblocked room or junction to calculate a route.',
    hazards: 'Simulated hazards',
    blockedRooms: 'Blocked rooms / junctions',
    blockedCorridors: 'Blocked corridors',
    closedExits: 'Closed exits',
    open: 'Open',
    blocked: 'Blocked',
    close: 'Close',
    reopen: 'Reopen',
    unblock: 'Unblock',
    building: 'Building',
    legend: 'Legend',
    room: 'Room',
    junction: 'Junction',
    exitLegend: 'Open exit',
    closed: 'Closed exit',
    routeLegend: 'Recommended route',
    importError: 'Invalid building file',
    invalidDetail: 'Please provide a valid JSON file matching the required schema.',
    rules: 'Routing follows weighted corridor cost only; coordinates are for display.',
    initial: 'Original state',
    current: 'Current state',
    routeUpdated: 'Route recalculated',
    uploadSuccess: 'Building imported successfully.',
    resetSuccess: 'Original initial state restored.',
    savedSuccess: 'Current state saved in this browser.',
    restored: 'Saved state restored.',
    download: 'Download sample',
    challenge: 'Mock challenge',
    browserOnly: 'Frontend-only • local browser storage • no backend',
    schema: 'Schema validation',
    valid: 'Valid',
    nodes: 'nodes',
    edges: 'edges',
    instructions: 'Click a room/junction to start. Toggle hazards below and watch the route update.',
  },
  bn: {
    appEyebrow: 'AI DevFest 2026 • প্র্যাকটিস',
    title: 'Smart Escape',
    subtitle: 'ইন্টার‍্যাক্টিভ ইভাকুয়েশন রুট সিমুলেটর',
    description: 'বিল্ডিং গ্রাফ লোড করুন, হ্যাজার্ড পরিবর্তন করুন এবং ওপেন এক্সিটে সবচেয়ে কম খরচের রুট দেখুন।',
    importTitle: 'building.json ইমপোর্ট করুন',
    importHint: 'দেওয়া JSON schema ব্যবহার করুন। Judge-রা unseen graph ব্যবহার করতে পারে।',
    chooseFile: 'JSON ফাইল বাছাই',
    sample: 'Sample লোড',
    reset: 'Reset',
    save: 'Progress সেভ',
    saved: 'Saved',
    language: 'ভাষা',
    contrast: 'High contrast',
    map: 'ইন্টার‍্যাক্টিভ ম্যাপ',
    start: 'শুরুর লোকেশন',
    selectStart: 'Room বা junction বাছাই করুন',
    route: 'সেরা রুট',
    cost: 'মোট খরচ',
    exit: 'Exit',
    corridors: 'Corridor',
    sequence: 'Node sequence',
    noRoute: 'কোনো রুট পাওয়া যায়নি',
    blockedStart: 'Starting location blocked',
    chooseStart: 'রুট বের করতে একটি unblocked room বা junction বাছাই করুন।',
    hazards: 'Simulated hazards',
    blockedRooms: 'Blocked room / junction',
    blockedCorridors: 'Blocked corridor',
    closedExits: 'Closed exit',
    open: 'Open',
    blocked: 'Blocked',
    close: 'Close',
    reopen: 'Reopen',
    unblock: 'Unblock',
    building: 'Building',
    legend: 'Legend',
    room: 'Room',
    junction: 'Junction',
    exitLegend: 'Open exit',
    closed: 'Closed exit',
    routeLegend: 'Recommended route',
    importError: 'Invalid building file',
    invalidDetail: 'সঠিক schema অনুযায়ী valid JSON file দিন।',
    rules: 'রুটের cost শুধু corridor cost থেকে হিসাব হয়; coordinates শুধু display-এর জন্য।',
    initial: 'Original state',
    current: 'Current state',
    routeUpdated: 'Route recalculated',
    uploadSuccess: 'Building সফলভাবে import হয়েছে।',
    resetSuccess: 'Original initial state restore হয়েছে।',
    savedSuccess: 'এই browser-এ current state save হয়েছে।',
    restored: 'Saved state restore হয়েছে।',
    download: 'Sample download',
    challenge: 'Mock challenge',
    browserOnly: 'Frontend-only • browser storage • কোনো backend নেই',
    schema: 'Schema validation',
    valid: 'Valid',
    nodes: 'nodes',
    edges: 'edges',
    instructions: 'Room/junction-এ click করে start বাছাই করুন। নিচে hazard toggle করলে route সঙ্গে সঙ্গে update হবে।',
  },
};

const clone = (value) => JSON.parse(JSON.stringify(value));

function compareArrays(a, b) {
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i += 1) {
    if (a[i] < b[i]) return -1;
    if (a[i] > b[i]) return 1;
  }
  return a.length - b.length;
}

function stateKey(state) {
  return JSON.stringify({
    blocked_nodes: [...state.blocked_nodes].sort(),
    blocked_edges: [...state.blocked_edges].sort(),
    closed_exits: [...state.closed_exits].sort(),
  });
}

function validateBuilding(raw) {
  const errors = [];
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) errors.push('Root must be an object.');
  if (typeof raw?.building !== 'string' || !raw.building.trim()) errors.push('building must be a non-empty string.');
  if (!Array.isArray(raw?.nodes) || raw.nodes.length < 2 || raw.nodes.length > 60) errors.push('nodes[] must contain 2–60 nodes.');
  if (!Array.isArray(raw?.edges) || raw.edges.length < 1 || raw.edges.length > 150) errors.push('edges[] must contain 1–150 edges.');
  const nodes = raw?.nodes ?? [];
  const edges = raw?.edges ?? [];
  const nodeIds = new Set();
  let roomOrJunction = 0;
  let exits = 0;
  nodes.forEach((node, index) => {
    if (!node || typeof node !== 'object') return errors.push(`nodes[${index}] must be an object.`);
    if (typeof node.id !== 'string' || !node.id) errors.push(`nodes[${index}].id must be non-empty.`);
    if (nodeIds.has(node.id)) errors.push(`Duplicate node id: ${node.id}`);
    nodeIds.add(node.id);
    if (typeof node.label !== 'string' || !node.label) errors.push(`nodes[${index}].label must be non-empty.`);
    if (!['room', 'junction', 'exit'].includes(node.type)) errors.push(`Invalid node type: ${node.id}`);
    if (!Number.isFinite(node.x) || !Number.isFinite(node.y)) errors.push(`Invalid coordinates: ${node.id}`);
    if (node.type === 'exit') exits += 1;
    else roomOrJunction += 1;
  });
  if (!roomOrJunction) errors.push('At least one room/junction is required.');
  if (!exits) errors.push('At least one exit is required.');
  const edgeIds = new Set();
  const pairIds = new Set();
  edges.forEach((edge, index) => {
    if (!edge || typeof edge !== 'object') return errors.push(`edges[${index}] must be an object.`);
    if (typeof edge.id !== 'string' || !edge.id) errors.push(`edges[${index}].id must be non-empty.`);
    if (edgeIds.has(edge.id)) errors.push(`Duplicate edge id: ${edge.id}`);
    edgeIds.add(edge.id);
    if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to)) errors.push(`Edge ${edge.id} references an unknown node.`);
    if (edge.from === edge.to) errors.push(`Edge ${edge.id} cannot be a self-loop.`);
    if (!Number.isInteger(edge.cost) || edge.cost <= 0) errors.push(`Edge ${edge.id} cost must be a positive integer.`);
    const pair = [edge.from, edge.to].sort().join('::');
    if (pairIds.has(pair)) errors.push(`Repeated node pair: ${pair}`);
    pairIds.add(pair);
  });
  const initial = raw?.initial_state;
  if (!initial || typeof initial !== 'object') errors.push('initial_state is required.');
  ['blocked_nodes', 'blocked_edges', 'closed_exits'].forEach((field) => {
    if (!Array.isArray(initial?.[field])) errors.push(`initial_state.${field} must be an array.`);
  });
  const nodeById = new Map(nodes.map((n) => [n.id, n]));
  (initial?.blocked_nodes ?? []).forEach((id) => {
    if (!nodeById.has(id) || nodeById.get(id).type === 'exit') errors.push(`Invalid blocked node: ${id}`);
  });
  const edgeById = new Map(edges.map((e) => [e.id, e]));
  (initial?.blocked_edges ?? []).forEach((id) => {
    if (!edgeById.has(id)) errors.push(`Invalid blocked edge: ${id}`);
  });
  (initial?.closed_exits ?? []).forEach((id) => {
    if (!nodeById.has(id) || nodeById.get(id).type !== 'exit') errors.push(`Invalid closed exit: ${id}`);
  });
  return { valid: errors.length === 0, errors };
}

function computeBestRoute(building, state, startId) {
  if (!building || !startId) return null;
  const nodeById = new Map(building.nodes.map((node) => [node.id, node]));
  const start = nodeById.get(startId);
  if (!start || state.blocked_nodes.includes(startId)) return { status: 'blocked-start' };

  const blockedNodes = new Set(state.blocked_nodes);
  const blockedEdges = new Set(state.blocked_edges);
  const closedExits = new Set(state.closed_exits);
  const adjacency = new Map(building.nodes.map((node) => [node.id, []]));

  building.edges.forEach((edge) => {
    if (blockedEdges.has(edge.id)) return;
    if (blockedNodes.has(edge.from) || blockedNodes.has(edge.to)) return;
    if (!adjacency.has(edge.from) || !adjacency.has(edge.to)) return;
    adjacency.get(edge.from).push({ to: edge.to, cost: edge.cost, edgeId: edge.id });
    adjacency.get(edge.to).push({ to: edge.from, cost: edge.cost, edgeId: edge.id });
  });

  const dist = new Map();
  const bestPath = new Map();
  const visited = new Set();
  building.nodes.forEach((node) => {
    dist.set(node.id, Infinity);
    bestPath.set(node.id, null);
  });
  dist.set(startId, 0);
  bestPath.set(startId, [startId]);

  while (true) {
    let currentId = null;
    building.nodes.forEach((node) => {
      if (visited.has(node.id) || !Number.isFinite(dist.get(node.id))) return;
      if (currentId === null) currentId = node.id;
      else {
        const c = dist.get(node.id) - dist.get(currentId);
        if (c < 0 || (c === 0 && compareArrays(bestPath.get(node.id), bestPath.get(currentId)) < 0)) currentId = node.id;
      }
    });
    if (currentId === null) break;
    visited.add(currentId);
    const currentCost = dist.get(currentId);
    const currentPath = bestPath.get(currentId);
    adjacency.get(currentId).forEach(({ to, cost }) => {
      if (visited.has(to)) return;
      const nextCost = currentCost + cost;
      const nextPath = [...currentPath, to];
      const oldPath = bestPath.get(to);
      if (nextCost < dist.get(to) || (nextCost === dist.get(to) && oldPath && compareArrays(nextPath, oldPath) < 0)) {
        dist.set(to, nextCost);
        bestPath.set(to, nextPath);
      }
    });
  }

  const candidates = building.nodes
    .filter((node) => node.type === 'exit' && !closedExits.has(node.id) && !blockedNodes.has(node.id))
    .filter((node) => Number.isFinite(dist.get(node.id)))
    .map((node) => ({
      exitId: node.id,
      cost: dist.get(node.id),
      path: bestPath.get(node.id),
    }))
    .sort((a, b) => a.cost - b.cost || a.exitId.localeCompare(b.exitId) || compareArrays(a.path, b.path));

  if (!candidates.length) return { status: 'no-route' };
  const chosen = candidates[0];
  return { status: 'ok', ...chosen, corridorCount: Math.max(0, chosen.path.length - 1) };
}

function nodeTypeLabel(type, t) {
  if (type === 'room') return t.room;
  if (type === 'junction') return t.junction;
  return t.exitLegend;
}

function App() {
  const [lang, setLang] = useState('en');
  const [contrast, setContrast] = useState(false);
  const [dark, setDark] = useState(false);
  const [building, setBuilding] = useState(null);
  const [initialState, setInitialState] = useState(null);
  const [state, setState] = useState(null);
  const [startId, setStartId] = useState('');
  const [notice, setNotice] = useState(null);
  const [error, setError] = useState(null);
  const fileRef = useRef(null);
  const t = I18N[lang];

  const loadBuilding = (raw, sourceLabel = 'building.json') => {
    const result = validateBuilding(raw);
    if (!result.valid) {
      setError({ title: t.importError, details: result.errors.slice(0, 6) });
      return false;
    }
    const nextInitial = {
      blocked_nodes: [...raw.initial_state.blocked_nodes],
      blocked_edges: [...raw.initial_state.blocked_edges],
      closed_exits: [...raw.initial_state.closed_exits],
    };
    setBuilding(raw);
    setInitialState(nextInitial);
    setState(clone(nextInitial));
    const selectable = raw.nodes.find((n) => ['room', 'junction'].includes(n.type) && !nextInitial.blocked_nodes.includes(n.id));
    setStartId(selectable?.id ?? '');
    setError(null);
    setNotice(`${sourceLabel}: ${t.uploadSuccess}`);
    return true;
  };

  useEffect(() => {
    fetch(SAMPLE_URL)
      .then((res) => res.json())
      .then((raw) => loadBuilding(raw, 'Sample'))
      .catch(() => setError({ title: t.importError, details: ['Could not load the sample building.'] }));
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('smart-escape-state');
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      if (parsed.building && validateBuilding(parsed.building).valid) {
        setBuilding(parsed.building);
        setInitialState(parsed.initialState);
        setState(parsed.state);
        setStartId(parsed.startId || '');
        setNotice(t.restored);
      }
    } catch {
      // Ignore malformed local state.
    }
  }, []);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(() => setNotice(null), 2600);
    return () => clearTimeout(timer);
  }, [notice]);

  const route = useMemo(() => computeBestRoute(building, state, startId), [building, state, startId]);

  const nodeById = useMemo(() => new Map((building?.nodes ?? []).map((n) => [n.id, n])), [building]);
  const edgeById = useMemo(() => new Map((building?.edges ?? []).map((e) => [e.id, e])), [building]);
  const routeEdgeIds = useMemo(() => {
    if (!route || route.status !== 'ok') return new Set();
    const ids = new Set();
    for (let i = 0; i < route.path.length - 1; i += 1) {
      const a = route.path[i];
      const b = route.path[i + 1];
      const edge = building.edges.find((e) => (e.from === a && e.to === b) || (e.from === b && e.to === a));
      if (edge) ids.add(edge.id);
    }
    return ids;
  }, [route, building]);

  const selectableNodes = (building?.nodes ?? []).filter((node) => ['room', 'junction'].includes(node.type));
  const blockedNodes = new Set(state?.blocked_nodes ?? []);
  const blockedEdges = new Set(state?.blocked_edges ?? []);
  const closedExits = new Set(state?.closed_exits ?? []);

  const toggleInArray = (field, id) => {
    setState((prev) => {
      const set = new Set(prev[field]);
      if (set.has(id)) set.delete(id); else set.add(id);
      return { ...prev, [field]: [...set] };
    });
  };

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const raw = JSON.parse(await file.text());
      loadBuilding(raw, file.name);
    } catch {
      setError({ title: t.importError, details: ['The selected file is not valid JSON.'] });
    }
    event.target.value = '';
  };

  const reset = () => {
    if (!initialState) return;
    setState(clone(initialState));
    const selectable = building.nodes.find((n) => ['room', 'junction'].includes(n.type) && !initialState.blocked_nodes.includes(n.id));
    setStartId(selectable?.id ?? '');
    setNotice(t.resetSuccess);
  };

  const saveProgress = () => {
    if (!building || !state) return;
    localStorage.setItem('smart-escape-state', JSON.stringify({ building, initialState, state, startId }));
    setNotice(t.savedSuccess);
  };

  const downloadSample = () => {
    const blob = new Blob([JSON.stringify(building, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'building.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`app-shell ${dark ? 'dark' : ''} ${contrast ? 'contrast' : ''}`}>
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark"><Route size={19} /></div>
          <div>
            <div className="eyebrow">{t.appEyebrow}</div>
            <div className="brand-name">Smart Escape</div>
          </div>
        </div>
        <div className="top-actions">
          <button className="icon-btn" title={t.contrast} onClick={() => setContrast((v) => !v)}><CircleHelp size={17} /></button>
          <button className="icon-btn" title="Theme" onClick={() => setDark((v) => !v)}>{dark ? <Sun size={17} /> : <Moon size={17} />}</button>
          <button className="lang-btn" onClick={() => setLang((v) => v === 'en' ? 'bn' : 'en')}><Languages size={16} /> {lang === 'en' ? 'বাংলা' : 'English'}</button>
        </div>
      </header>

      <main className="page">
        <section className="hero-card">
          <div>
            <span className="pill">{t.challenge}</span>
            <h1>{t.title}</h1>
            <p className="hero-subtitle">{t.subtitle}</p>
            <p className="hero-copy">{t.description}</p>
            <div className="rule-chip"><ShieldAlert size={15} /> {t.browserOnly}</div>
          </div>
          <div className="hero-route-art" aria-hidden="true">
            <div className="art-line line-a" /><div className="art-line line-b" /><div className="art-node node-a" /><div className="art-node node-b" /><div className="art-node node-c" /><div className="art-exit">E</div>
          </div>
        </section>

        <section className="toolbar-card">
          <div className="toolbar-main">
            <div>
              <div className="section-kicker"><FileJson size={15} /> {t.importTitle}</div>
              <div className="muted">{t.importHint}</div>
            </div>
            <div className="toolbar-actions">
              <button className="primary-btn" onClick={() => fileRef.current?.click()}><Upload size={16} /> {t.chooseFile}</button>
              <button className="secondary-btn" onClick={() => fetch(SAMPLE_URL).then((r) => r.json()).then((raw) => loadBuilding(raw, 'Sample'))}><RotateCcw size={16} /> {t.sample}</button>
              <button className="secondary-btn" onClick={downloadSample} disabled={!building}><Download size={16} /> {t.download}</button>
              <button className="secondary-btn" onClick={saveProgress} disabled={!building}><Save size={16} /> {t.save}</button>
              <button className="secondary-btn danger-text" onClick={reset} disabled={!building}><RotateCcw size={16} /> {t.reset}</button>
              <input ref={fileRef} type="file" accept="application/json,.json" onChange={handleFile} hidden />
            </div>
          </div>
          {building && (
            <div className="validation-row">
              <span className="valid-badge"><CheckCircle2 size={14} /> {t.schema}: {t.valid}</span>
              <span>{building.building}</span>
              <span>{building.nodes.length} {t.nodes}</span>
              <span>{building.edges.length} {t.edges}</span>
            </div>
          )}
        </section>

        {error && (
          <div className="alert error-alert">
            <AlertTriangle size={18} />
            <div><strong>{error.title}</strong>{error.details?.map((detail) => <div key={detail} className="alert-detail">{detail}</div>)}</div>
            <button className="close-alert" onClick={() => setError(null)}><XCircle size={18} /></button>
          </div>
        )}
        {notice && <div className="toast"><CheckCircle2 size={17} /> {notice}</div>}

        <div className="workspace-grid">
          <section className="map-card card">
            <div className="card-heading">
              <div><div className="section-kicker"><MapPin size={15} /> {t.map}</div><h2>{building?.building ?? '—'}</h2></div>
              <div className="state-badge"><span className="pulse-dot" /> {t.routeUpdated}</div>
            </div>
            <p className="instructions">{t.instructions}</p>
            <div className="map-wrap">
              {building ? (
                <svg className="map-svg" viewBox="0 0 100 100" role="img" aria-label="Interactive building map">
                  <defs>
                    <filter id="routeGlow"><feGaussianBlur stdDeviation="1.2" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                  </defs>
                  {building.edges.map((edge) => {
                    const from = nodeById.get(edge.from);
                    const to = nodeById.get(edge.to);
                    const isBlocked = blockedEdges.has(edge.id) || blockedNodes.has(edge.from) || blockedNodes.has(edge.to);
                    const isRoute = routeEdgeIds.has(edge.id);
                    return <g key={edge.id} className={`edge-group ${isRoute ? 'route-edge' : ''} ${isBlocked ? 'blocked-edge' : ''}`}>
                      <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} className="edge-line" filter={isRoute ? 'url(#routeGlow)' : undefined} />
                      <g className="edge-label"><rect x={(from.x + to.x) / 2 - 4.3} y={(from.y + to.y) / 2 - 3.1} width="8.6" height="6.2" rx="2" /><text x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 + 1.2}>{edge.cost}</text></g>
                    </g>;
                  })}
                  {building.nodes.map((node) => {
                    const blocked = blockedNodes.has(node.id) || (node.type === 'exit' && closedExits.has(node.id));
                    const selected = startId === node.id;
                    const onRoute = route?.status === 'ok' && route.path.includes(node.id);
                    return <g key={node.id} className={`node-group ${node.type} ${blocked ? 'blocked-node' : ''} ${selected ? 'selected-node' : ''} ${onRoute ? 'on-route' : ''}`} onClick={() => !blocked && ['room', 'junction'].includes(node.type) && setStartId(node.id)}>
                      <circle cx={node.x} cy={node.y} r={selected ? 5.2 : 4.3} className="node-circle" />
                      <text x={node.x} y={node.y - 7} textAnchor="middle" className="node-id">{node.id}</text>
                      <text x={node.x} y={node.y + 8.5} textAnchor="middle" className="node-label">{node.label}</text>
                    </g>;
                  })}
                </svg>
              ) : <div className="empty-map"><FileJson size={36} /><strong>{t.importTitle}</strong><span>{t.importHint}</span></div>}
            </div>
            <div className="legend-row">
              <span><i className="legend-dot room-dot" /> {t.room}</span>
              <span><i className="legend-dot junction-dot" /> {t.junction}</span>
              <span><i className="legend-dot exit-dot" /> {t.exitLegend}</span>
              <span><i className="legend-dot closed-dot" /> {t.closed}</span>
              <span><i className="legend-route" /> {t.routeLegend}</span>
            </div>
          </section>

          <aside className="side-column">
            <section className="card route-card">
              <div className="section-kicker"><Route size={15} /> {t.route}</div>
              <div className="start-control">
                <label htmlFor="start-select">{t.start}</label>
                <select id="start-select" value={startId} onChange={(e) => setStartId(e.target.value)} disabled={!building}>
                  <option value="">{t.selectStart}</option>
                  {selectableNodes.map((node) => <option key={node.id} value={node.id}>{node.id} — {node.label}{blockedNodes.has(node.id) ? ` (${t.blocked})` : ''}</option>)}
                </select>
              </div>
              {!route || !startId ? <div className="route-empty"><MapPin size={22} /><span>{t.chooseStart}</span></div> : route.status === 'blocked-start' ? <div className="route-failure"><AlertTriangle size={22} /><strong>{t.blockedStart}</strong></div> : route.status === 'no-route' ? <div className="route-failure"><XCircle size={22} /><strong>{t.noRoute}</strong></div> : <div className="route-result">
                <div className="metric-grid">
                  <div><span>{t.exit}</span><strong>{route.exitId}</strong></div>
                  <div><span>{t.cost}</span><strong>{route.cost}</strong></div>
                  <div><span>{t.corridors}</span><strong>{route.corridorCount}</strong></div>
                </div>
                <div className="path-box">
                  {route.path.map((id, index) => <React.Fragment key={id}><span className={id === route.exitId ? 'path-node exit-path' : 'path-node'}>{id}</span>{index < route.path.length - 1 && <ChevronRight size={14} />}</React.Fragment>)}
                </div>
              </div>}
              <div className="route-rule"><GitBranch size={14} /> {t.rules}</div>
            </section>

            <section className="card hazards-card">
              <div className="section-kicker"><ShieldAlert size={15} /> {t.hazards}</div>
              <HazardGroup title={t.blockedRooms}>
                {selectableNodes.map((node) => <HazardRow key={node.id} label={`${node.id} — ${node.label}`} active={blockedNodes.has(node.id)} action={blockedNodes.has(node.id) ? t.unblock : t.blocked} onClick={() => toggleInArray('blocked_nodes', node.id)} />)}
              </HazardGroup>
              <HazardGroup title={t.blockedCorridors}>
                {(building?.edges ?? []).map((edge) => <HazardRow key={edge.id} label={`${edge.id} • ${edge.cost}`} active={blockedEdges.has(edge.id)} action={blockedEdges.has(edge.id) ? t.unblock : t.blocked} onClick={() => toggleInArray('blocked_edges', edge.id)} />)}
              </HazardGroup>
              <HazardGroup title={t.closedExits}>
                {(building?.nodes ?? []).filter((n) => n.type === 'exit').map((node) => <HazardRow key={node.id} label={`${node.id} — ${node.label}`} active={closedExits.has(node.id)} action={closedExits.has(node.id) ? t.reopen : t.close} onClick={() => toggleInArray('closed_exits', node.id)} />)}
              </HazardGroup>
            </section>
          </aside>
        </div>

        <section className="footer-note">
          <div><ShieldAlert size={16} /><strong>Smart Escape</strong> — {t.initial} → {t.current}</div>
          <div>Educational simulation only • AI DevFest mock test</div>
        </section>
      </main>
    </div>
  );
}

function HazardGroup({ title, children }) {
  return <div className="hazard-group"><div className="hazard-title">{title}</div><div className="hazard-list">{children}</div></div>;
}

function HazardRow({ label, active, action, onClick }) {
  return <div className={`hazard-row ${active ? 'active' : ''}`}><span>{label}</span><button onClick={onClick}>{active ? <AlertTriangle size={13} /> : <CheckCircle2 size={13} />} {action}</button></div>;
}

createRoot(document.getElementById('root')).render(<App />);
