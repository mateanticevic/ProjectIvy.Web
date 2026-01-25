import React, { useEffect, useState } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';

import api from 'api/main';
import Spinner from 'components/spinner';
import { components } from 'types/ivy-types';

type ExpenseTypeNode = components['schemas']['ExpenseTypeNode'];

interface TreeNodeProps {
    node: ExpenseTypeNode;
    level?: number;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, level = 0 }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const hasChildren = node.children && node.children.length > 0;
    const paddingLeft = level * 32;

    return (
        <div>
            <div
                className="py-2 border-bottom"
                style={{
                    paddingLeft: `${paddingLeft + 16}px`,
                    paddingRight: '16px',
                    cursor: hasChildren ? 'pointer' : 'default',
                    backgroundColor: level % 2 === 0 ? 'var(--bs-body-bg)' : 'rgba(var(--bs-emphasis-color-rgb), 0.02)',
                    borderLeft: level > 0 ? '2px solid rgba(var(--bs-emphasis-color-rgb), 0.1)' : 'none',
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
                </div>
            </div>
            {hasChildren && isExpanded && (
                <div>
                    {node.children?.map((child, index) => (
                        <TreeNode
                            key={child.this?.id || `child-${level}-${index}`}
                            node={child}
                            level={level + 1}
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
                                        />
                                    ))}
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ExpenseTypesPage;
