import React, { useCallback, useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, FormControl, InputGroup, Row, Table } from 'react-bootstrap';

import api from 'api/main';
import Pagination from 'components/pagination';
import Spinner from 'components/spinner';
import InventoryModal from './inventory-modal';
import { components } from 'types/ivy-types';

type InventoryItem = components['schemas']['InventoryItem'];
type InventoryItemBinding = components['schemas']['InventoryItemBinding'];

interface Filter {
    page: number;
    pageSize: number;
    search?: string;
}

const InventoryPage: React.FC = () => {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [count, setCount] = useState(0);
    const [filter, setFilter] = useState<Filter>({ page: 1, pageSize: 25, search: '' });
    const [searchText, setSearchText] = useState(filter.search ?? '');
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
    const [binding, setBinding] = useState<InventoryItemBinding>({});

    const loadInventory = useCallback(() => {
        setIsLoading(true);
        api.inventory.get({
            page: filter.page,
            pageSize: filter.pageSize,
            search: filter.search ?? undefined,
        })
            .then(data => {
                setItems(data.items ?? []);
                setCount(Number(data.count) || 0);
            })
            .catch(() => {
                setItems([]);
                setCount(0);
            })
            .finally(() => setIsLoading(false));
    }, [filter]);

    useEffect(() => {
        loadInventory();
    }, [loadInventory]);

    const onPageChange = (page: number) => {
        setFilter(prev => ({ ...prev, page }));
    };

    const onSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFilter(prev => ({ ...prev, page: 1, search: searchText }));
    };

    const onSearchClear = () => {
        setSearchText('');
        setFilter(prev => ({ ...prev, page: 1, search: '' }));
    };

    const openNewModal = () => {
        setSelectedItem(null);
        setBinding({ name: '', brandId: undefined });
        setIsModalOpen(true);
    };

    const onItemClick = (item: InventoryItem) => {
        setSelectedItem(item);
        setBinding({
            name: item.name ?? '',
            brandId: item.brand?.id ?? undefined,
        });
        setIsModalOpen(true);
    };

    const onModalChange = (changed: Partial<InventoryItemBinding>) => {
        setBinding(prev => ({ ...prev, ...changed }));
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
    };

    const onModalSave = () => {
        const trimmedName = binding.name?.trim();
        if (!trimmedName) {
            return;
        }

        setIsSaving(true);
        const payload: InventoryItemBinding = {
            name: trimmedName,
            brandId: binding.brandId ?? null,
        };

        let saveRequest: Promise<any>;
        if (selectedItem?.id) {
            saveRequest = api.inventory.put(selectedItem.id, payload);
        }
        else {
            saveRequest = api.inventory.post(payload);
        }

        saveRequest
            .then(() => {
                setIsModalOpen(false);
                setSelectedItem(null);
                setBinding({});
                loadInventory();
            })
            .finally(() => setIsSaving(false));
    };

    const totalPages = Math.max(1, Math.ceil((count || 0) / filter.pageSize));

    return (
        <Container fluid>
            <Row>
                <Col>
                    <Card>
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <div>
                                <div className="fw-semibold">Inventory</div>
                                <small className="text-muted">{count} items</small>
                            </div>
                            <Button onClick={openNewModal}>New item</Button>
                        </Card.Header>
                        <Card.Body>
                            <Form className="mb-3" onSubmit={onSearchSubmit}>
                                <InputGroup>
                                    <FormControl
                                        placeholder="Search by name or brand"
                                        value={searchText}
                                        onChange={x => setSearchText(x.target.value)}
                                    />
                                    <Button type="submit" variant="primary">Search</Button>
                                    <Button
                                        type="button"
                                        variant="outline-secondary"
                                        onClick={onSearchClear}
                                        disabled={!filter.search && !searchText}
                                    >
                                        Reset
                                    </Button>
                                </InputGroup>
                            </Form>
                            {isLoading ? (
                                <div className="text-center py-4">
                                    <Spinner size="2x" />
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <Table hover size="sm">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Brand</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {items.length === 0 && (
                                                <tr>
                                                    <td colSpan={2} className="text-center text-muted py-3">
                                                        No inventory items found
                                                    </td>
                                                </tr>
                                            )}
                                            {items.map(item => (
                                                <tr
                                                    key={item.id ?? item.name}
                                                    onClick={() => onItemClick(item)}
                                                    role="button"
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <td>{item.name}</td>
                                                    <td>{item.brand?.name ?? '—'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            )}
                            <div className="d-flex justify-content-center">
                                <Pagination
                                    page={filter.page}
                                    pages={totalPages}
                                    onPageChange={onPageChange}
                                />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <InventoryModal
                binding={binding}
                inventoryItem={selectedItem}
                isOpen={isModalOpen}
                isSaving={isSaving}
                onChange={onModalChange}
                onClose={closeModal}
                onSave={onModalSave}
            />
        </Container>
    );
};

export default InventoryPage;
