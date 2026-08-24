'use client';

import { useRef, useState } from 'react';
import { Icon } from '@/components/svg/Icon';
import type { Copy } from '@/content/types';

/**
 * Demonstration form. This is a static export with no backend, so nothing is
 * transmitted — the copy says so plainly rather than implying a message was
 * sent. To make it real, either point `action` at a form endpoint or move the
 * project to a Node host and add a server action.
 */
export function ContactForm({ c }: { c: Copy }) {
  const [sent, setSent] = useState(false);
  const ok = useRef<HTMLDivElement>(null);
  const f = c.form;

  return (
    <>
      <form
        className="form"
        id="rfq"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          (e.currentTarget as HTMLFormElement).reset();
          setSent(true);
          requestAnimationFrame(() =>
            ok.current?.scrollIntoView({ block: 'center', behavior: 'smooth' }));
        }}
      >
        <div className="field">
          <label htmlFor="f-name">{f.name}</label>
          <input id="f-name" name="name" placeholder={f.ph_name} required />
        </div>
        <div className="field">
          <label htmlFor="f-co">{f.company}</label>
          <input id="f-co" name="company" placeholder={f.ph_co} />
        </div>
        <div className="field">
          <label htmlFor="f-em">{f.email}</label>
          <input id="f-em" type="email" name="email" required dir="ltr" />
        </div>
        <div className="field">
          <label htmlFor="f-ph">{f.phone}</label>
          <input id="f-ph" type="tel" name="phone" dir="ltr" />
        </div>
        <div className="field field--full">
          <label htmlFor="f-dept">{f.dept}</label>
          <select id="f-dept" name="dept" defaultValue={c.formDepts[0]}>
            {c.formDepts.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div className="field field--full">
          <label htmlFor="f-msg">{f.msg}</label>
          <textarea id="f-msg" name="message" placeholder={f.msgPh} required />
        </div>
        <div className="field field--full">
          <label htmlFor="f-file">{f.file}</label>
          <input id="f-file" type="file" name="spec" accept=".pdf,.xlsx,.xls,.csv,.dwg" />
          <span className="field__hint">{f.file_hint}</span>
        </div>
        <div className="field--full">
          <button className="btn btn--primary" type="submit">
            {f.submit}<Icon name="arrow" />
          </button>
        </div>
      </form>

      <div className="formok" id="rfqok" data-on={sent ? 'true' : 'false'} role="status" ref={ok}>
        {f.ok}
      </div>
      <p className="formnote">{f.note}</p>
    </>
  );
}
