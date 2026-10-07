/**
 * Client-side search. Loads /search-index.json and Fuse.js lazily on first
 * interaction, then renders grouped results with full keyboard support
 * (combobox + listbox pattern).
 *
 * Markup contract (see SearchPanel.astro):
 *   [data-search-root][data-index][data-mode="inline"|"page"]
 *     input[data-search-input]
 *     [data-search-results]   (role=listbox)
 *     [data-search-status]    (aria-live)
 *     [data-search-hint]      (shown when the query is empty)
 */
import type Fuse from 'fuse.js';
import { KIND_ORDER, type SearchDoc, type SearchKind, type SearchStrings } from '@/lib/search-types';

const engines = new Map<string, Promise<Fuse<SearchDoc>>>();

function loadEngine(indexUrl: string): Promise<Fuse<SearchDoc>> {
  const cached = engines.get(indexUrl);
  if (cached) return cached;
  const engine = Promise.all([
    import('fuse.js').then((m) => m.default),
    fetch(indexUrl).then((r) => {
      if (!r.ok) throw new Error(`Search index: HTTP ${r.status}`);
      return r.json() as Promise<SearchDoc[]>;
    }),
  ]).then(
    ([FuseCtor, docs]) =>
      new FuseCtor(docs, {
        keys: [
          { name: 't', weight: 4 },
          { name: 'a', weight: 3 },
          { name: 'g', weight: 2 },
          { name: 's', weight: 1 },
          { name: 'c', weight: 0.5 },
          { name: 'w', weight: 1 },
        ],
        threshold: 0.3,
        ignoreLocation: true,
        ignoreDiacritics: true,
        minMatchCharLength: 2,
        includeScore: true,
      }),
  );
  engines.set(indexUrl, engine);
  engine.catch(() => engines.delete(indexUrl));
  return engine;
}

const el = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

function initRoot(root: HTMLElement) {
  const input = root.querySelector<HTMLInputElement>('[data-search-input]');
  const list = root.querySelector<HTMLElement>('[data-search-results]');
  const status = root.querySelector<HTMLElement>('[data-search-status]');
  const hint = root.querySelector<HTMLElement>('[data-search-hint]');
  const indexUrl = root.dataset.index;
  if (!input || !list || !status || !indexUrl) return;

  const mode = root.dataset.mode ?? 'inline';
  const str = JSON.parse(root.dataset.strings ?? '{}') as SearchStrings;
  const perKind = mode === 'page' ? 25 : 5;
  const idBase = list.id;
  let options: HTMLAnchorElement[] = [];
  let active = -1;
  let seq = 0;

  const setActive = (i: number) => {
    options[active]?.setAttribute('aria-selected', 'false');
    active = options.length ? (i + options.length) % options.length : -1;
    const opt = options[active];
    if (opt) {
      opt.setAttribute('aria-selected', 'true');
      opt.scrollIntoView({ block: 'nearest' });
      input.setAttribute('aria-activedescendant', opt.id);
    } else {
      input.removeAttribute('aria-activedescendant');
    }
  };

  const setQuery = (q: string) => {
    input.value = q;
    input.focus();
    void run();
  };

  const render = (q: string, results: { item: SearchDoc }[]) => {
    list.replaceChildren();
    options = [];
    active = -1;
    input.removeAttribute('aria-activedescendant');

    const hasQuery = q.length > 0;
    hint?.toggleAttribute('hidden', hasQuery);
    list.toggleAttribute('hidden', !hasQuery);
    input.setAttribute('aria-expanded', String(hasQuery && results.length > 0));

    if (!hasQuery) {
      status.textContent = '';
      return;
    }
    if (results.length === 0) {
      const empty = el('p', 'px-4 py-6 text-sm text-mute');
      const [before = '', after = ''] = str.none.split('{q}');
      empty.append(before, el('span', 'font-mono text-paper', q), after);
      list.append(empty);
      status.textContent = str.none.replace('{q}', q);
      return;
    }

    const groups = new Map<SearchKind, SearchDoc[]>();
    for (const { item } of results) {
      const bucket = groups.get(item.k) ?? [];
      if (bucket.length < perKind) bucket.push(item);
      groups.set(item.k, bucket);
    }

    for (const kind of KIND_ORDER) {
      const items = groups.get(kind);
      if (!items?.length) continue;
      const group = el('div', 'py-2');
      group.setAttribute('role', 'group');
      const labelId = `${idBase}-g-${kind}`;
      group.setAttribute('aria-labelledby', labelId);
      const label = el('p', 'label px-4 pt-1 pb-1.5', str.kinds[kind]);
      label.id = labelId;
      group.append(label);

      for (const doc of items) {
        const a = el(
          'a',
          'group/opt flex items-baseline gap-3 px-4 py-2 outline-none aria-selected:bg-ink-800 hover:bg-ink-850',
        );
        a.href = doc.u;
        a.id = `${idBase}-o-${options.length}`;
        a.setAttribute('role', 'option');
        a.setAttribute('aria-selected', 'false');
        a.tabIndex = -1;
        const marker = el('span', 'w-3 shrink-0 font-mono text-xs text-ember opacity-0 group-aria-selected/opt:opacity-100', '›');
        marker.setAttribute('aria-hidden', 'true');
        const body = el('span', 'min-w-0 flex-1');
        const head = el('span', 'flex flex-wrap items-baseline gap-x-3 gap-y-0.5');
        head.append(
          el('span', 'font-medium text-paper', doc.t),
          el('span', 'label text-faint', doc.c),
        );
        body.append(head);
        if (doc.s) body.append(el('span', 'mt-0.5 block truncate text-sm text-mute', doc.s));
        // "What to do": playbooks this entry is used in, and tools to start with.
        const relations: [string, string[] | undefined][] = [
          [str.usefulFor, doc.p],
          [str.tools, doc.x],
        ];
        for (const [labelText, values] of relations) {
          if (!values?.length) continue;
          const line = el('span', 'mt-1 block truncate font-mono text-[0.6875rem] text-faint');
          line.append(el('span', 'text-ember', `${labelText}: `), values.join(' · '));
          body.append(line);
        }
        a.append(marker, body);
        group.append(a);
        options.push(a);
      }
      list.append(group);
    }

    // "Related" terms: tags of the best matches, as one-click refinements.
    const related = [
      ...new Set(results.slice(0, 6).flatMap(({ item }) => item.g)),
    ].filter((t) => t.toLowerCase() !== q.toLowerCase()).slice(0, 8);
    if (related.length) {
      const wrap = el('div', 'flex flex-wrap items-center gap-2 border-t border-ink-700 px-4 py-3');
      wrap.append(el('span', 'label mr-1', str.related));
      for (const tag of related) {
        const b = el('button', 'chip cursor-pointer hover:border-ember/60 hover:text-paper', tag);
        b.type = 'button';
        b.addEventListener('click', () => setQuery(tag));
        wrap.append(b);
      }
      list.append(wrap);
    }

    const total = options.length;
    status.textContent = (total === 1 ? str.one : str.many).replace('{n}', String(total));
  };

  const run = async () => {
    const q = input.value.trim();
    const mySeq = ++seq;
    if (mode === 'page') {
      const u = new URL(location.href);
      if (q) u.searchParams.set('q', q);
      else u.searchParams.delete('q');
      history.replaceState(null, '', u);
    }
    if (!q) return render('', []);
    try {
      const fuse = await loadEngine(indexUrl);
      if (mySeq !== seq) return; // a newer query superseded this one
      render(q, fuse.search(q, { limit: 120 }));
    } catch (err) {
      console.error(err);
      status.textContent = str.error;
    }
  };

  input.addEventListener('focus', () => void loadEngine(indexUrl).catch(() => {}), { once: true });
  input.addEventListener('input', () => void run());
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive(active + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(active - 1);
    } else if (e.key === 'Enter') {
      const target = options[active] ?? options[0];
      if (target) {
        e.preventDefault();
        location.href = target.href;
      }
    } else if (e.key === 'Escape' && mode !== 'dialog' && input.value) {
      e.preventDefault();
      setQuery('');
    }
  });

  root.querySelectorAll<HTMLButtonElement>('[data-search-example]').forEach((b) =>
    b.addEventListener('click', () => setQuery(b.dataset.searchExample ?? '')),
  );

  if (mode === 'page') {
    const q = new URLSearchParams(location.search).get('q');
    if (q) setQuery(q);
  }
}

function initShortcuts() {
  const dialog = document.querySelector<HTMLDialogElement>('#search-dialog');
  const open = () => {
    const primary = document.querySelector<HTMLInputElement>('[data-search-primary] [data-search-input]');
    if (primary) {
      primary.focus();
      primary.select();
      return;
    }
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    dialog.querySelector<HTMLInputElement>('[data-search-input]')?.focus();
  };

  document.querySelectorAll<HTMLElement>('[data-open-search]').forEach((b) =>
    b.addEventListener('click', (e) => {
      e.preventDefault();
      if (!dialog) return;
      dialog.showModal();
      dialog.querySelector<HTMLInputElement>('[data-search-input]')?.focus();
    }),
  );

  dialog?.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close(); // backdrop click
  });

  document.addEventListener('keydown', (e) => {
    const t = e.target as HTMLElement | null;
    const typing = t?.closest('input, textarea, select, [contenteditable="true"]');
    if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      open();
    } else if (e.key === '/' && !typing) {
      e.preventDefault();
      open();
    }
  });
}

document.querySelectorAll<HTMLElement>('[data-search-root]').forEach(initRoot);
initShortcuts();
