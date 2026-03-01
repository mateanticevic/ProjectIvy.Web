import React, { useCallback, useEffect, useState } from 'react';
import { Badge, Button, Card, Col, Container, Form, InputGroup, Row } from 'react-bootstrap';

import api from 'api/main';
import Spinner from 'components/spinner';
import { components } from 'types/ivy-types';

type ToDo = components['schemas']['ToDo'];

const TodoPage: React.FC = () => {
    const [items, setItems] = useState<ToDo[]>([]);
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const loadTodos = useCallback(() => {
        setIsLoading(true);
        api.todo.get()
            .then(data => setItems(data.items ?? []))
            .catch(() => setItems([]))
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        loadTodos();
    }, [loadTodos]);

    const onAddTodo = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedName = name.trim();
        if (!trimmedName || isSaving) {
            return;
        }

        setIsSaving(true);
        api.todo.post({ name: trimmedName })
            .then(() => {
                setName('');
                loadTodos();
            })
            .finally(() => setIsSaving(false));
    };

    return (
        <Container>
            <Row>
                <Col lg={12}>
                    <Card>
                        <Card.Header>
                            <div className="fw-semibold">Todo</div>
                            <small className="text-muted">{items.length} items</small>
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={onAddTodo} className="mb-3">
                                <InputGroup>
                                    <Form.Control
                                        placeholder="Todo name"
                                        value={name}
                                        onChange={x => setName(x.target.value)}
                                    />
                                    <Button type="submit" disabled={isSaving || !name.trim()}>
                                        Add
                                    </Button>
                                </InputGroup>
                            </Form>

                            {isLoading ? (
                                <div className="text-center py-4">
                                    <Spinner size="2x" />
                                </div>
                            ) : items.length === 0 ? (
                                <div className="text-center text-muted py-3">No todo items found</div>
                            ) : (
                                <div className="d-flex flex-column gap-2">
                                    {items.map(item => (
                                        <Card key={item.id ?? item.name}>
                                            <Card.Body className="d-flex justify-content-between align-items-center py-2">
                                                <div className="fw-semibold">{item.name}</div>
                                                <div className="d-flex gap-1 flex-wrap justify-content-end">
                                                    {(item.tags ?? []).length > 0 ? (
                                                        (item.tags ?? []).map(tag => (
                                                            <Badge key={tag.id ?? tag.name} bg="secondary">
                                                                {tag.name}
                                                            </Badge>
                                                        ))
                                                    ) : (
                                                        <Badge bg="light" text="dark">No labels</Badge>
                                                    )}
                                                </div>
                                            </Card.Body>
                                        </Card>
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

export default TodoPage;