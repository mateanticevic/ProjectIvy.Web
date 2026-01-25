import React, { useEffect, useState } from 'react';
import { Card, Col, Container, Row, Modal, Form, Button } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';

import api from 'api/main';
import Spinner from 'components/spinner';
import { components } from 'types/ivy-types';

type ExpenseTypeNode = components['schemas']['ExpenseTypeNode'];

interface TreeNodeProps {
    node: ExpenseTypeNode;
    level?: number;
    onDrop?: (draggedNode: ExpenseTypeNode, targetNode: ExpenseTypeNode) => void;
    onAddChild?: (parentNode: ExpenseTypeNode) => void;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, level = 0, onDrop, onAddChild }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const hasChildren = node.children && node.children.length > 0;
    const paddingLeft = level * 32;

    const handleDragStart = (e: React.DragEvent) => {
        e.stopPropagation();
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('application/json', JSON.stringify(node));
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'move';
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);

        try {
            const draggedNode = JSON.parse(e.dataTransfer.getData('application/json')) as ExpenseTypeNode;
            if (draggedNode.this?.id !== node.this?.id && onDrop) {
                onDrop(draggedNode, node);
            }
        } catch (error) {
            console.error('Error parsing dragged data:', error);
        }
    };

    return (
        <div>
            <div
                draggable
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className="py-2 border-bottom"
                style={{
                    paddingLeft: `${paddingLeft + 16}px`,
                    paddingRight: '16px',
                    cursor: hasChildren ? 'pointer' : 'default',
                    backgroundColor: isDragOver 
                        ? 'rgba(var(--bs-primary-rgb), 0.1)' 
                        : level % 2 === 0 ? 'var(--bs-body-bg)' : 'rgba(var(--bs-emphasis-color-rgb), 0.02)',
                    borderLeft: level > 0 ? '2px solid rgba(var(--bs-emphasis-color-rgb), 0.1)' : 'none',
                    transition: 'background-color 0.2s',
                }}
                onClick={() => hasChildren && setIsExpanded(!isExpanded)}
            >
                <div className="d-flex align-items-center">
                    {hasChildren && (
                        <span className="me-2" style={{ width: '20px', textAlign: 'center' }}>
                            {isExpanded ? '▼' : '►'}
                        </span>
                    )}
                    {!hasChildren && <span className="me-2" style={{ width: '20px' }} />}
                    <span className={hasChildren ? 'fw-semibold' : ''}>
                        {node.this?.name || 'Unnamed'}
                    </span>
                    {hasChildren && (
                        <span className="ms-2 text-muted small">
                            ({node.children?.length} {node.children?.length === 1 ? 'child' : 'children'})
                        </span>
                    )}
                    <button
                        className="btn btn-sm btn-link text-primary ms-2 p-0"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAddChild?.(node);
                        }}
                        style={{ fontSize: '0.875rem' }}
                        title="Add child expense type"
                    >
                        <FaPlus />
                    </button>
                </div>
            </div>
            {hasChildren && isExpanded && (
                <div>
                    {node.children?.map((child, index) => (
                        <TreeNode
                            key={child.this?.id || `child-${level}-${index}`}
                            node={child}
                            level={level + 1}
                            onDrop={onDrop}
                            onAddChild={onAddChild}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const ExpenseTypesPage: React.FC = () => {
    const [tree, setTree] = useState<ExpenseTypeNode[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [newExpenseTypeName, setNewExpenseTypeName] = useState('');
    const [selectedParentNode, setSelectedParentNode] = useState<ExpenseTypeNode | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Recursively sort nodes alphabetically by name
    const sortTree = (nodes: ExpenseTypeNode[]): ExpenseTypeNode[] => {
        return nodes
            .sort((a, b) => {
                const nameA = a.this?.name?.toLowerCase() || '';
                const nameB = b.this?.name?.toLowerCase() || '';
                return nameA.localeCompare(nameB);
            })
            .map(node => ({
                ...node,
                children: node.children ? sortTree(node.children) : node.children,
            }));
    };

    const handleDrop = async (draggedNode: ExpenseTypeNode, targetNode: ExpenseTypeNode) => {
        const draggedId = draggedNode.this?.id;
        const targetId = targetNode.this?.id;

        if (!draggedId || !targetId) {
            console.error('Missing node IDs');
            return;
        }

        try {
            // Move the dragged node to be a child of the target node
            await api.expenseType.postExpenseType(targetId, draggedId);
            
            // Refresh the tree
            const data = await api.expenseType.getTree();
            const sortedData = sortTree(data ?? []);
            setTree(sortedData);
            const countNodes = (nodes: ExpenseTypeNode[]): number => {
                return nodes.reduce((acc, node) => {
                    return acc + 1 + (node.children ? countNodes(node.children) : 0);
                }, 0);
            };
            setTotalCount(countNodes(sortedData));
        } catch (error) {
            console.error('Error moving expense type:', error);
        }
    };

    const handleAddChild = (parentNode: ExpenseTypeNode) => {
        setSelectedParentNode(parentNode);
        setNewExpenseTypeName('');
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setNewExpenseTypeName('');
        setSelectedParentNode(null);
    };

    const handleSave = async () => {
        if (!newExpenseTypeName.trim() || !selectedParentNode?.this?.id) {
            return;
        }

        setIsSaving(true);
        try {
            await api.expenseType.post({
                name: newExpenseTypeName.trim(),
                parentId: selectedParentNode.this.id,
            });
            
            // Refresh the tree
            const data = await api.expenseType.getTree();
            const sortedData = sortTree(data ?? []);
            setTree(sortedData);
            const countNodes = (nodes: ExpenseTypeNode[]): number => {
                return nodes.reduce((acc, node) => {
                    return acc + 1 + (node.children ? countNodes(node.children) : 0);
                }, 0);
            };
            setTotalCount(countNodes(sortedData));
            
            handleCloseModal();
        } catch (error) {
            console.error('Error creating expense type:', error);
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        api.expenseType.getTree()
            .then(data => {
                const sortedData = sortTree(data ?? []);
                setTree(sortedData);
                // Count total nodes recursively
                const countNodes = (nodes: ExpenseTypeNode[]): number => {
                    return nodes.reduce((acc, node) => {
                        return acc + 1 + (node.children ? countNodes(node.children) : 0);
                    }, 0);
                };
                setTotalCount(countNodes(sortedData));
            })
            .catch(() => {
                setTree([]);
                setTotalCount(0);
            })
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <Container fluid>
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <div className="fw-semibold">Expense Types</div>
                            <small className="text-muted">
                                {totalCount} {totalCount === 1 ? 'type' : 'types'} in hierarchy
                            </small>
                        </Card.Header>
                        <Card.Body className="p-0">
                            {isLoading ? (
                                <div className="text-center py-4">
                                    <Spinner size="2x" />
                                </div>
                            ) : tree.length === 0 ? (
                                <div className="text-center text-muted py-4">
                                    No expense types found
                                </div>
                            ) : (
                                <div>
                                    {tree.map((node, index) => (
                                        <TreeNode
                                            key={node.this?.id || `root-${index}`}
                                            node={node}
                                            onDrop={handleDrop}
                                            onAddChild={handleAddChild}
                                        />
                                    ))}
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Child Expense Type</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter expense type name"
                                value={newExpenseTypeName}
                                onChange={(e) => setNewExpenseTypeName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleSave();
                                    }
                                }}
                                autoFocus
                            />
                        </Form.Group>
                        {selectedParentNode && (
                            <div className="mt-2 text-muted small">
                                Parent: {selectedParentNode.this?.name}
                            </div>
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal} disabled={isSaving}>
                        Cancel
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={handleSave} 
                        disabled={!newExpenseTypeName.trim() || isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Save'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ExpenseTypesPage;
