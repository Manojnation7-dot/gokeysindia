'use client';

import { useEffect, useId, useRef, useState } from 'react';

// Long HTML (e.g. a tour overview) shown as its first ~5 lines with a soft fade and "Read more" / "Read less".
// The full text is always in the server-rendered HTML: it is only clipped with CSS (max-height), never loaded on click.
// Short text (fits in the clipped height) gets no button and no fade.
export default function ReadMoreHtml({ html, className = '', collapsedHeight = '8.75rem' /* 5 lines of 16px prose */ }) {
  const id = useId();
  const ref = useRef(null);
  const expandedRef = useRef(false);
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);

  useEffect(() => {
    const check = () => {
      const el = ref.current;
      if (el && !expandedRef.current) setOverflowing(el.scrollHeight > el.clientHeight + 4);
    };
    check();
    window.addEventListener('resize', check);
    document.fonts?.ready?.then(check);
    return () => window.removeEventListener('resize', check);
  }, [html]);

  const toggle = () => {
    const next = !expanded;
    expandedRef.current = next;
    setExpanded(next);
    // Back to the start of the text when it is folded again, if that is above the screen
    if (!next && ref.current && ref.current.getBoundingClientRect().top < 0) ref.current.scrollIntoView({ block: 'start' });
  };

  return (
    <>
      <div className="relative">
        <div
          id={id}
          ref={ref}
          className={className}
          style={expanded ? undefined : { maxHeight: collapsedHeight, overflow: 'hidden' }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
        {overflowing && !expanded && (
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-16"
            style={{ background: 'linear-gradient(to top, var(--color-mist), transparent)' }} />
        )}
      </div>
      {(overflowing || expanded) && (
        <button type="button" onClick={toggle} aria-expanded={expanded} aria-controls={id}
          className="mt-2 min-h-[44px] text-sm font-semibold text-teal underline underline-offset-2">
          {expanded ? 'Read less' : 'Read more'}
        </button>
      )}
    </>
  );
}
