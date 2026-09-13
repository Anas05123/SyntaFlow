/**
 * D01 · Documents — one document system for every document type.
 *
 * A document belongs to exactly one project in V1, so creating one from this
 * global view requires choosing a project.
 */

import { useMemo, useState } from 'react';

import { useStore } from '../state/store';
import { useOverlay } from '../ui/overlay';
import { navigate } from '../app/router';
import { relative } from '../domain/dates';
import { Button, Card, CardBody, PageHead, Segmented, Select, TextInput } from '../ui/primitives';
import { Chip } from '../ui/primitives';
import type { DocumentType, ReviewState } from '../domain/types';

type TypeFilter = DocumentType | 'all';
type ReviewFilter = ReviewState | 'all';

export function DocumentsScreen() {
  const { derived } = useStore();
  const overlay = useOverlay();
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>('all');

  const types: TypeFilter[] = ['all', 'Proposal', 'Brief', 'Agreement record', 'Welcome pack', 'Scope / Report', 'Notes', 'Deliverable'];
  const reviewStates: ReviewFilter[] = ['all', 'none', 'waiting', 'changes-requested', 'approved'];

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return derived.documentsWithContext
      .filter((d) => (typeFilter === 'all' ? true : d.type === typeFilter))
      .filter((d) => (reviewFilter === 'all' ? true : d.reviewState === reviewFilter))
      .filter((d) => (q === '' ? true : d.title.toLowerCase().includes(q) || d.clientName.toLowerCase().includes(q)));
  }, [derived.documentsWithContext, typeFilter, reviewFilter, query]);

  return (
    <>
      <PageHead
        eyebrow="Deliverables"
        title="Documents"
        sub="One document system for proposals, briefs, agreement records, welcome packs and deliverables. A document belongs to exactly one project."
        actions={
          <Button variant="primary" icon="plus" onClick={() => overlay.openModal('new-document')}>
            Create document
          </Button>
        }
      />

      <div className="row row-wrap mb-16">
        <div style={{ maxWidth: 300, flex: '1 1 220px' }}>
          <TextInput
            placeholder="Search documents…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search documents"
          />
        </div>
        <div style={{ maxWidth: 190 }}>
          <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as TypeFilter)} aria-label="Document type">
            {types.map((t) => <option key={t} value={t}>{t === 'all' ? 'All types' : t}</option>)}
          </Select>
        </div>
        <div style={{ maxWidth: 200 }}>
          <Select value={reviewFilter} onChange={(e) => setReviewFilter(e.target.value as ReviewFilter)} aria-label="Review state">
            {reviewStates.map((s) => <option key={s} value={s}>{s === 'all' ? 'All review states' : s}</option>)}
          </Select>
        </div>
        <span className="grow" />
        <Segmented
          ariaLabel="Layout"
          value="list"
          onChange={() => overlay.toast('Grid view', 'List view is the V1 layout for documents.', 'default')}
          options={[{ value: 'list', label: 'List' }]}
        />
      </div>

      <Card>
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Title</th><th>Type</th><th>Client / Project</th><th>Working</th>
                <th>Submitted</th><th>Review state</th><th>Visibility</th><th>Reviewer</th><th>Modified</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={9}>
                    <div className="state">
                      <div className="state-title">No documents match</div>
                      <p className="state-text">Adjust the filters, or create the document you need.</p>
                      <div className="state-actions">
                        <Button onClick={() => { setQuery(''); setTypeFilter('all'); setReviewFilter('all'); }}>
                          Clear filters
                        </Button>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                rows.map((d) => (
                  <tr key={d.id}>
                    <td>
                      <a className="row-link" href={`#/documents/${d.id}`}>
                        <div className="cell-primary">{d.title}</div>
                        <div className="cell-sub">{d.sections.length} sections</div>
                      </a>
                    </td>
                    <td>{d.type}</td>
                    <td>
                      <div>{d.clientName}</div>
                      <div className="cell-sub">{d.projectName}</div>
                    </td>
                    <td className="num">v{d.workingVersion}</td>
                    <td className="num">{d.submittedVersion ? `v${d.submittedVersion}` : <span className="meta">—</span>}</td>
                    <td><Chip state={d.reviewState} /></td>
                    <td><Chip state={d.visibility} /></td>
                    <td>{d.activeReview ? d.activeReview.reviewer.name : <span className="meta">—</span>}</td>
                    <td className="num"><span className="meta">{relative(d.modified)}</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-3 mt-16">
        <Card>
          <CardBody>
            <div className="card-title">A submitted version is immutable</div>
            <div className="card-desc mt-4">
              Version history keeps every submitted version. A new draft copies forward; it never overwrites.
            </div>
            <Button className="mt-12" size="sm" onClick={() => navigate('#/documents/doc-guidelines?view=history')}>
              See version history
            </Button>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="card-title">Sharing is never a side effect</div>
            <div className="card-desc mt-4">
              Previewing a document does not share it. Sharing happens only in Review &amp; share setup.
            </div>
            <Button className="mt-12" size="sm" onClick={() => navigate('#/share')}>Open share setup</Button>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="card-title">Agreement evidence</div>
            <div className="card-desc mt-4">
              An agreement record links an external contract and its acceptance evidence. Approval is a review
              decision, not a signature.
            </div>
            <div className="mt-12"><span className="chip tone-neutral">Later scope: e-signing</span></div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
