/**
 * W05 · Archive — archived records are read-only and keep their prior context.
 *
 * Restoring is owner-only. Access revocation is always separate from archiving.
 */

import { useState } from 'react';

import { useStore } from '../state/store';
import { useOverlay } from '../ui/overlay';
import { navigate } from '../app/router';
import { formatDate, relative } from '../domain/dates';
import { Banner, Button, Card, CardBody, CardHead, Chip, Def, Defs, EmptyState, PageHead, TextInput } from '../ui/primitives';

export function ArchiveScreen() {
  const { state, dispatch, derived } = useStore();
  const overlay = useOverlay();
  const [query, setQuery] = useState('');

  const archived = state.clients.filter(
    (c) => c.state === 'archived' && (query === '' || c.name.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <>
      <PageHead
        eyebrow="Record"
        title="Archive"
        sub="Archived records are read-only and keep their prior context. Restoring is owner-only, and access revocation is always separate."
      />

      <div className="row row-wrap mb-16">
        <div style={{ maxWidth: 300, flex: '1 1 220px' }}>
          <TextInput
            placeholder="Search the archive…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search archive"
          />
        </div>
        <span className="grow" />
        <span className="meta">
          {archived.length} archived record{archived.length === 1 ? '' : 's'}
        </span>
      </div>

      {archived.length === 0 ? (
        <Card>
          <EmptyState
            icon="archive"
            title={query ? `Nothing archived matches “${query}”` : 'Nothing archived'}
            text="Archived clients, projects and documents appear here with the date they were archived and their prior context."
            secondary={query ? <Button onClick={() => setQuery('')}>Clear search</Button> : undefined}
          />
        </Card>
      ) : (
        archived.map((c) => {
          const projects = derived.projectsOfClient(c.id);
          const docs = state.documents.filter((d) => d.clientId === c.id);
          const grants = state.grants.filter((g) => g.recipient.email === c.contacts[0]?.email);
          return (
            <Card key={c.id} className="mb-16">
              <CardHead
                title={c.name}
                desc={`Client relationship · archived ${formatDate(c.archivedOn)}`}
                action={<Chip state="archived" />}
              />
              <CardBody>
                <Defs>
                  <Def k="Primary contact">
                    {c.contacts[0] ? `${c.contacts[0].name} · ${c.contacts[0].email}` : '—'}
                  </Def>
                  <Def k="Projects">{projects.length} on record (retained)</Def>
                  <Def k="Documents">{docs.length} on record (retained)</Def>
                  <Def k="Last activity">{formatDate(c.lastActivity)} · {relative(c.lastActivity)}</Def>
                  <Def k="Guest access">
                    {grants.length === 0 ? (
                      <span className="meta">No grants on record</span>
                    ) : (
                      <>Grants remain as recorded — revocation is separate from archiving</>
                    )}
                  </Def>
                </Defs>
                <div className="mt-16">
                  <Banner
                    title="Restore conflict check"
                    sub="If a record with the same name was created after archiving, restore asks you to confirm which one keeps the name."
                  />
                </div>
              </CardBody>
              <div className="card-foot">
                <div className="row-between row-wrap">
                  <span className="meta">Read-only · history is intact</span>
                  <div className="row">
                    <Button
                      size="sm"
                      onClick={() => overlay.toast('Archive history', `${projects.length} projects and ${docs.length} documents are retained and unchanged.`, 'default')}
                    >
                      Inspect history
                    </Button>
                    <Button
                      size="sm"
                      variant="primary"
                      icon="undo"
                      onClick={() => {
                        dispatch({ type: 'client/patch', id: c.id, patch: { state: 'inactive', archivedOn: undefined } });
                        overlay.toast('Client restored', 'Guest access was not reinstated automatically.', 'ok');
                      }}
                    >
                      Restore
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })
      )}

      <Card>
        <CardBody>
          <div className="card-title">What archiving does not do</div>
          <div className="grid grid-3 mt-12">
            <div>
              <div className="strong" style={{ fontSize: 'var(--fs-label)' }}>It does not delete history</div>
              <p className="meta mt-4" style={{ lineHeight: 1.6 }}>
                Projects, documents and submitted versions stay readable.
              </p>
            </div>
            <div>
              <div className="strong" style={{ fontSize: 'var(--fs-label)' }}>It does not revoke access</div>
              <p className="meta mt-4" style={{ lineHeight: 1.6 }}>
                Grants are managed in Settings → Client access, on purpose.
              </p>
            </div>
            <div>
              <div className="strong" style={{ fontSize: 'var(--fs-label)' }}>It does not cascade silently</div>
              <p className="meta mt-4" style={{ lineHeight: 1.6 }}>
                Archiving a client never archives its projects behind your back.
              </p>
            </div>
          </div>
          <Button className="mt-16" size="sm" onClick={() => navigate('#/clients')}>Back to clients</Button>
        </CardBody>
      </Card>
    </>
  );
}
