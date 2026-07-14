import React, { useCallback, useEffect, useState } from 'react';
import { Button, Col, Container, Form, Modal, Row, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import moment from 'moment';

import api from 'api/main';
import { MarkdownPreview } from 'components';
import Pagination from 'components/pagination';
import Spinner from 'components/spinner';
import { components } from 'types/ivy-types';

type JournalEntry = components['schemas']['JournalEntry'];
type JournalEntryBinding = components['schemas']['JournalEntryBinding'];

const PAGE_SIZE = 20;

const JournalPage: React.FC = () => {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [count, setCount] = useState(0);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
    const [binding, setBinding] = useState<JournalEntryBinding>({});
    const [isContentEditMode, setIsContentEditMode] = useState(true);

    const load = useCallback(() => {
        setIsLoading(true);
        api.journal.get({ Page: page, PageSize: PAGE_SIZE, OrderAscending: false })
            .then(data => {
                setEntries(data.items ?? []);
                setCount(Number(data.count) || 0);
            })
            .catch(() => {
                setEntries([]);
                setCount(0);
            })
            .finally(() => setIsLoading(false));
    }, [page]);

    useEffect(() => {
        load();
    }, [load]);

    const openNewModal = () => {
        setSelectedEntry(null);
        setBinding({ date: moment().format('YYYY-MM-DD'), entry: '' });
        setIsContentEditMode(true);
        setIsModalOpen(true);
    };

    const openEditModal = (entry: JournalEntry) => {
        setSelectedEntry(entry);
        setBinding({ date: entry.date ?? '', entry: entry.entry ?? '' });
        setIsContentEditMode(false);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedEntry(null);
    };

    const onSave = () => {
        if (!binding.date) return;

        setIsSaving(true);
        const action = selectedEntry
            ? api.journal.put(binding.date, binding)
            : api.journal.post(binding);

        action
            .then(() => {
                closeModal();
                load();
            })
            .finally(() => setIsSaving(false));
    };

    const onDelete = () => {
        if (!selectedEntry?.date) return;

        setIsDeleting(true);
        api.journal.del(selectedEntry.date)
            .then(() => {
                closeModal();
                load();
            })
            .finally(() => setIsDeleting(false));
    };

    const pages = Math.ceil(count / PAGE_SIZE);

    return (
        <Container>
            <Row className="mt-3 mb-3">
                <Col>
                    <h4>Journal</h4>
                </Col>
                <Col xs="auto">
                    <Button variant="primary" onClick={openNewModal}>New Entry</Button>
                </Col>
            </Row>

            {isLoading ? (
                <Spinner />
            ) : (
                <>
                    {entries.length === 0 && (
                        <p className="text-muted">No journal entries yet.</p>
                    )}
                    {entries.map(entry => (
                        <div
                            key={entry.date}
                            className="border rounded p-3 mb-2"
                            style={{ cursor: 'pointer' }}
                            onClick={() => openEditModal(entry)}
                        >
                            <div className="d-flex justify-content-between align-items-start">
                                <strong>{moment(entry.date).format('Do MMMM YYYY')}</strong>
                                <small className="text-muted">
                                    {entry.modified ? moment(entry.modified).format('HH:mm') : ''}
                                </small>
                            </div>
                            <div className="text-muted mt-1" style={{ fontSize: '0.9em', overflow: 'hidden', maxHeight: 60 }}>
                                {(entry.entry ?? '').split('\n')[0]}
                            </div>
                        </div>
                    ))}
                    {pages > 1 && (
                        <Pagination page={page} pages={pages} onPageChange={setPage} />
                    )}
                </>
            )}

            <Modal show={isModalOpen} onHide={closeModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{selectedEntry ? 'Edit Entry' : 'New Entry'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Date</Form.Label>
                        <Form.Control
                            type="date"
                            value={binding.date ?? ''}
                            onChange={e => setBinding(prev => ({ ...prev, date: e.target.value }))}
                            disabled={!!selectedEntry || isSaving}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <Form.Label className="mb-0">Entry</Form.Label>
                            <ToggleButtonGroup
                                type="radio"
                                name="content-mode"
                                value={isContentEditMode ? 'edit' : 'preview'}
                                size="sm"
                            >
                                <ToggleButton
                                    id="content-mode-preview"
                                    type="radio"
                                    variant={!isContentEditMode ? 'secondary' : 'outline-secondary'}
                                    checked={!isContentEditMode}
                                    value="preview"
                                    disabled={isSaving}
                                    onChange={() => setIsContentEditMode(false)}
                                >
                                    Preview
                                </ToggleButton>
                                <ToggleButton
                                    id="content-mode-edit"
                                    type="radio"
                                    variant={isContentEditMode ? 'secondary' : 'outline-secondary'}
                                    checked={isContentEditMode}
                                    value="edit"
                                    disabled={isSaving}
                                    onChange={() => setIsContentEditMode(true)}
                                >
                                    Edit
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </div>
                        {isContentEditMode ? (
                            <Form.Control
                                as="textarea"
                                rows={12}
                                value={binding.entry ?? ''}
                                onChange={e => setBinding(prev => ({ ...prev, entry: e.target.value }))}
                                placeholder="Write your journal entry here..."
                                disabled={isSaving}
                            />
                        ) : (
                            <div className="border rounded p-3" style={{ minHeight: 200, maxHeight: 400, overflow: 'auto' }}>
                                <MarkdownPreview content={binding.entry} />
                            </div>
                        )}
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    {selectedEntry && (
                        <Button
                            variant="danger"
                            onClick={onDelete}
                            disabled={isSaving || isDeleting}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    )}
                    <Button variant="secondary" onClick={closeModal} disabled={isSaving || isDeleting}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={onSave} disabled={isSaving || isDeleting || !binding.date}>
                        {isSaving ? 'Saving...' : 'Save'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default JournalPage;
