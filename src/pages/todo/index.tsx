import React, { useCallback, useEffect, useState } from 'react';
import AsyncCreatableSelect from 'react-select/async-creatable';
import { SingleValue, StylesConfig } from 'react-select';
import { Badge, Button, Card, Col, Container, Dropdown, Form, InputGroup, Row, Tab, Tabs } from 'react-bootstrap';

import api from 'api/main';
import Spinner from 'components/spinner';
import { components } from 'types/ivy-types';
import { useReactSelectStyles } from 'utils/react-select-dark-theme';

type ToDo = components['schemas']['ToDo'];
type Tag = components['schemas']['Tag'];
type SelectTagOption = { value: string; label: string; __isNew__?: boolean };

const TodoPage: React.FC = () => {
    const [todoItems, setTodoItems] = useState<ToDo[]>([]);
    const [completedItems, setCompletedItems] = useState<ToDo[]>([]);
    const [activeTab, setActiveTab] = useState<'todo' | 'completed'>('todo');
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [updatingItemFor, setUpdatingItemFor] = useState<string | null>(null);
    const [openTagDropdownFor, setOpenTagDropdownFor] = useState<string | null>(null);
    const [assigningTagFor, setAssigningTagFor] = useState<string | null>(null);
    const reactSelectStyles = useReactSelectStyles();
    const tagSelectStyles = reactSelectStyles as StylesConfig<SelectTagOption, false>;

    const getItemKey = useCallback((item: ToDo) => item.id ?? item.name ?? '', []);

    const loadTagOptions = useCallback((search: string, callback: (options: SelectTagOption[]) => void) => {
        api.tag.get({ Search: search, PageSize: 10 })
            .then(data => {
                const options = (data.items ?? []).reduce<SelectTagOption[]>((result, tag) => {
                    if (tag.id && tag.name) {
                        result.push({ value: tag.id, label: tag.name });
                    }

                    return result;
                }, []);
                callback(options);
            })
            .catch(() => callback([]));
    }, []);

    const loadTodos = useCallback(() => {
        setIsLoading(true);
        Promise.all([
            api.todo.get({ IsCompleted: false }),
            api.todo.get({ IsCompleted: true })
        ])
            .then(([todoData, completedData]) => {
                setTodoItems(todoData.items ?? []);
                setCompletedItems(completedData.items ?? []);
            })
            .catch(() => {
                setTodoItems([]);
                setCompletedItems([]);
            })
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

    const onTagSelected = (item: ToDo, selected: SingleValue<SelectTagOption>) => {
        if (!item.id || !selected) {
            return;
        }

        const itemKey = getItemKey(item);
        if (!itemKey) {
            return;
        }

        setAssigningTagFor(itemKey);

        const selectedLabel = (selected.label ?? '').trim().toLocaleLowerCase();
        const isAlreadyAssigned = (item.tags ?? []).some(tag =>
            (tag.id && tag.id === selected.value)
            || ((tag.name ?? '').trim().toLocaleLowerCase() === selectedLabel)
        );

        if (isAlreadyAssigned) {
            setAssigningTagFor(null);
            setOpenTagDropdownFor(null);
            return;
        }

        const assignTag = async () => {
            let tagId = selected.value;

            if (selected.__isNew__) {
                const tagName = selected.label?.trim();
                if (!tagName) {
                    return;
                }

                await api.tag.post({ name: tagName });

                const tagData = await api.tag.get({ Search: tagName, PageSize: 20 });
                const createdTag = (tagData.items ?? []).find((tag: Tag) =>
                    (tag.name ?? '').trim().toLocaleLowerCase() === tagName.toLocaleLowerCase()
                );

                if (!createdTag?.id) {
                    return;
                }

                tagId = createdTag.id;
            }

            await api.todo.postTag(item.id as string, tagId);
            setOpenTagDropdownFor(null);
            loadTodos();
        };

        assignTag().finally(() => setAssigningTagFor(null));
    };

    const onToggleCompleted = (item: ToDo, isCompleted: boolean) => {
        if (!item.id) {
            return;
        }

        const itemKey = getItemKey(item);
        if (!itemKey || updatingItemFor === itemKey) {
            return;
        }

        setUpdatingItemFor(itemKey);

        api.todo.put(item.id, {
            name: item.name,
            description: item.description,
            isCompleted,
        })
            .then(() => loadTodos())
            .finally(() => setUpdatingItemFor(null));
    };

    const renderTodoList = (items: ToDo[], emptyLabel: string, isCompletedList: boolean) => {
        if (items.length === 0) {
            return <div className="text-center text-muted py-3">{emptyLabel}</div>;
        }

        return (
            <div className="d-flex flex-column gap-2">
                {items.map(item => (
                    <Card key={item.id ?? item.name}>
                        <Card.Body className="d-flex justify-content-between align-items-center py-2">
                            <div className="d-flex align-items-center gap-2">
                                <Form.Check
                                    type="checkbox"
                                    checked={isCompletedList}
                                    disabled={!item.id || updatingItemFor === getItemKey(item)}
                                    onChange={x => onToggleCompleted(item, x.currentTarget.checked)}
                                    aria-label={`Mark ${item.name ?? 'todo item'} as completed`}
                                />
                                <div className="fw-semibold">{item.name}</div>
                            </div>
                            <div className="d-flex gap-1 flex-wrap justify-content-end align-items-center">
                                {(item.tags ?? []).length > 0 ? (
                                    (item.tags ?? []).map(tag => (
                                        <Badge key={tag.id ?? tag.name} bg="secondary">
                                            {tag.name}
                                        </Badge>
                                    ))
                                ) : (
                                    <Badge bg="light" text="dark">No labels</Badge>
                                )}
                                <Dropdown
                                    align="end"
                                    autoClose="outside"
                                    show={openTagDropdownFor === getItemKey(item)}
                                    onToggle={isOpen => setOpenTagDropdownFor(isOpen ? getItemKey(item) : null)}
                                >
                                    <Dropdown.Toggle
                                        size="sm"
                                        variant="outline-secondary"
                                        className="py-0 px-2"
                                        id={`todo-tag-toggle-${getItemKey(item)}`}
                                        disabled={!item.id || assigningTagFor === getItemKey(item) || updatingItemFor === getItemKey(item)}
                                    >
                                        +
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className="p-2" style={{ minWidth: 260 }}>
                                        <AsyncCreatableSelect<SelectTagOption, false>
                                            loadOptions={loadTagOptions}
                                            defaultOptions
                                            isClearable
                                            styles={tagSelectStyles}
                                            isDisabled={assigningTagFor === getItemKey(item) || updatingItemFor === getItemKey(item)}
                                            placeholder="Search or create tag"
                                            onChange={option => onTagSelected(item, option)}
                                            formatCreateLabel={value => `Create \"${value}\"`}
                                            noOptionsMessage={({ inputValue }) => inputValue ? 'No tags found' : 'Type to search tags'}
                                        />
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </Card.Body>
                    </Card>
                ))}
            </div>
        );
    };

    const activeItemCount = activeTab === 'todo' ? todoItems.length : completedItems.length;

    return (
        <Container>
            <Row>
                <Col lg={12}>
                    <Card>
                        <Card.Header>
                            <div className="fw-semibold">Todo</div>
                            <small className="text-muted">{activeItemCount} items</small>
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
                            ) : (
                                <Tabs
                                    activeKey={activeTab}
                                    onSelect={key => setActiveTab((key as 'todo' | 'completed') || 'todo')}
                                    className="mb-3"
                                >
                                    <Tab eventKey="todo" title="To do">
                                        {renderTodoList(todoItems, 'No todo items found', false)}
                                    </Tab>
                                    <Tab eventKey="completed" title="Completed">
                                        {renderTodoList(completedItems, 'No completed items found', true)}
                                    </Tab>
                                </Tabs>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default TodoPage;