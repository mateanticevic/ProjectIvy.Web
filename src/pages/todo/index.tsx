import React, { useCallback, useEffect, useState } from 'react';
import AsyncCreatableSelect from 'react-select/async-creatable';
import AsyncSelect from 'react-select/async';
import { SingleValue, StylesConfig } from 'react-select';
import { Badge, Button, Card, Col, Container, Dropdown, Form, InputGroup, Row, Tab, Tabs } from 'react-bootstrap';

import api from 'api/main';
import { SmartScroll } from 'components';
import Spinner from 'components/spinner';
import { components } from 'types/ivy-types';
import { useReactSelectStyles } from 'utils/react-select-dark-theme';
import { IoPricetag } from 'react-icons/io5';
import { FaRoute } from 'react-icons/fa';

type ToDo = components['schemas']['ToDo'];
type Tag = components['schemas']['Tag'];
type Trip = components['schemas']['Trip'];
type ToDoWithTrips = ToDo & { trips?: Trip[] | null };
type TagInt32KeyValuePair = components['schemas']['TagInt32KeyValuePair'];
type SelectTagOption = { value: string; label: string; __isNew__?: boolean };
type SelectTripOption = { value: string; label: string };
const TODO_PAGE_SIZE = 20;

const TodoPage: React.FC = () => {
    const [todoItems, setTodoItems] = useState<ToDo[]>([]);
    const [completedItems, setCompletedItems] = useState<ToDo[]>([]);
    const [todoCount, setTodoCount] = useState(0);
    const [completedCount, setCompletedCount] = useState(0);
    const [tagCounts, setTagCounts] = useState<TagInt32KeyValuePair[]>([]);
    const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState<'todo' | 'completed'>('todo');
    const [todoPage, setTodoPage] = useState(1);
    const [completedPage, setCompletedPage] = useState(1);
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMoreTodo, setIsLoadingMoreTodo] = useState(false);
    const [isLoadingMoreCompleted, setIsLoadingMoreCompleted] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [updatingItemFor, setUpdatingItemFor] = useState<string | null>(null);
    const [openTagDropdownFor, setOpenTagDropdownFor] = useState<string | null>(null);
    const [openTripDropdownFor, setOpenTripDropdownFor] = useState<string | null>(null);
    const [assigningTagFor, setAssigningTagFor] = useState<string | null>(null);
    const [assigningTripFor, setAssigningTripFor] = useState<string | null>(null);
    const reactSelectStyles = useReactSelectStyles();
    const tagSelectStyles = reactSelectStyles as StylesConfig<SelectTagOption, false>;
    const tripSelectStyles = reactSelectStyles as StylesConfig<SelectTripOption, false>;

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

    const loadTripOptions = useCallback((search: string, callback: (options: SelectTripOption[]) => void) => {
        api.trip.get({ Search: search, PageSize: 10 })
            .then(data => {
                const options = (data.items ?? []).reduce<SelectTripOption[]>((result, trip: Trip) => {
                    if (trip.id && trip.name) {
                        result.push({ value: trip.id, label: trip.name });
                    }

                    return result;
                }, []);
                callback(options);
            })
            .catch(() => callback([]));
    }, []);

    const loadTodos = useCallback(() => {
        setIsLoading(true);
        setTodoPage(1);
        setCompletedPage(1);
        const filters = selectedTagIds.length > 0 ? { TagId: selectedTagIds } : undefined;
        const countFilters = {
            ...filters,
            IsCompleted: activeTab === 'completed'
        };

        Promise.all([
            api.todo.get({ IsCompleted: false, Page: 1, PageSize: TODO_PAGE_SIZE, ...filters }),
            api.todo.get({ IsCompleted: true, Page: 1, PageSize: TODO_PAGE_SIZE, ...filters }),
            api.todo.getCountByTag(countFilters)
        ])
            .then(([todoData, completedData, countsData]) => {
                setTodoItems(todoData.items ?? []);
                setCompletedItems(completedData.items ?? []);
                setTodoCount(todoData.count ?? 0);
                setCompletedCount(completedData.count ?? 0);
                setTagCounts(countsData ?? []);
            })
            .catch(() => {
                setTodoItems([]);
                setCompletedItems([]);
                setTodoCount(0);
                setCompletedCount(0);
                setTagCounts([]);
            })
            .finally(() => setIsLoading(false));
    }, [activeTab, selectedTagIds]);

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

    const onTripSelected = (item: ToDo, selected: SingleValue<SelectTripOption>) => {
        if (!item.id || !selected?.value) {
            return;
        }

        const itemKey = getItemKey(item);
        if (!itemKey) {
            return;
        }

        setAssigningTripFor(itemKey);

        api.trip.addToDo(selected.value, item.id)
            .then(() => {
                setOpenTripDropdownFor(null);
                loadTodos();
            })
            .finally(() => setAssigningTripFor(null));
    };

    const toggleTagSelection = (tag?: Tag | null) => {
        const tagId = tag?.id;
        if (!tagId) {
            return;
        }

        setSelectedTagIds(current =>
            current.includes(tagId)
                ? current.filter(x => x !== tagId)
                : [...current, tagId]
        );
    };

    const loadMoreTodo = () => {
        if (isLoadingMoreTodo || todoItems.length >= todoCount) {
            return;
        }

        const nextPage = todoPage + 1;
        const filters = selectedTagIds.length > 0 ? { TagId: selectedTagIds } : undefined;

        setIsLoadingMoreTodo(true);
        api.todo.get({ IsCompleted: false, Page: nextPage, PageSize: TODO_PAGE_SIZE, ...filters })
            .then(data => {
                const nextItems = data.items ?? [];
                setTodoItems(current => [...current, ...nextItems]);
                setTodoCount(data.count ?? 0);
                setTodoPage(nextPage);
            })
            .finally(() => setIsLoadingMoreTodo(false));
    };

    const loadMoreCompleted = () => {
        if (isLoadingMoreCompleted || completedItems.length >= completedCount) {
            return;
        }

        const nextPage = completedPage + 1;
        const filters = selectedTagIds.length > 0 ? { TagId: selectedTagIds } : undefined;

        setIsLoadingMoreCompleted(true);
        api.todo.get({ IsCompleted: true, Page: nextPage, PageSize: TODO_PAGE_SIZE, ...filters })
            .then(data => {
                const nextItems = data.items ?? [];
                setCompletedItems(current => [...current, ...nextItems]);
                setCompletedCount(data.count ?? 0);
                setCompletedPage(nextPage);
            })
            .finally(() => setIsLoadingMoreCompleted(false));
    };

    const renderTodoList = (
        items: ToDo[],
        emptyLabel: string,
        isCompletedList: boolean,
        totalCount: number,
        isLoadingMore: boolean,
        onLoadMore: () => void,
    ) => {
        if (items.length === 0) {
            return <div className="text-center text-muted py-3">{emptyLabel}</div>;
        }

        return (
            <SmartScroll
                dataLength={items.length}
                hasMore={items.length < totalCount}
                isLoading={isLoadingMore}
                onLoadMore={onLoadMore}
            >
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
                                    {((item as ToDoWithTrips).trips ?? []).length > 0 && (
                                        ((item as ToDoWithTrips).trips ?? []).map(trip => (
                                            <Badge key={`trip-${trip.id ?? trip.name}`} bg="secondary">
                                                {trip.name}
                                            </Badge>
                                        ))
                                    )}
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
                                            <IoPricetag />
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
                                    <Dropdown
                                        align="end"
                                        autoClose="outside"
                                        show={openTripDropdownFor === getItemKey(item)}
                                        onToggle={isOpen => setOpenTripDropdownFor(isOpen ? getItemKey(item) : null)}
                                    >
                                        <Dropdown.Toggle
                                            size="sm"
                                            variant="outline-secondary"
                                            className="py-0 px-2"
                                            id={`todo-trip-toggle-${getItemKey(item)}`}
                                            disabled={!item.id || assigningTripFor === getItemKey(item) || updatingItemFor === getItemKey(item)}
                                        >
                                            <FaRoute />
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className="p-2" style={{ minWidth: 260 }}>
                                            <AsyncSelect<SelectTripOption, false>
                                                loadOptions={loadTripOptions}
                                                defaultOptions
                                                isClearable
                                                styles={tripSelectStyles}
                                                isDisabled={assigningTripFor === getItemKey(item) || updatingItemFor === getItemKey(item)}
                                                placeholder="Search trip"
                                                onChange={option => onTripSelected(item, option)}
                                                noOptionsMessage={({ inputValue }) => inputValue ? 'No trips found' : 'Type to search trips'}
                                            />
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            </SmartScroll>
        );
    };

    const renderTagFilters = () => {
        if (tagCounts.length === 0) {
            return null;
        }

        return (
            <div className="d-flex gap-1 flex-wrap mb-3">
                {tagCounts.map(tagCount => {
                    const tagId = tagCount.key?.id;
                    const isSelected = tagId ? selectedTagIds.includes(tagId) : false;

                    return (
                        <Badge
                            key={tagCount.key?.id ?? tagCount.key?.name}
                            bg={isSelected ? 'primary' : 'secondary'}
                            className="cursor-pointer"
                            onClick={() => toggleTagSelection(tagCount.key)}
                        >
                            {`${tagCount.key?.name ?? 'Unknown'} (${tagCount.value ?? 0})`}
                        </Badge>
                    );
                })}
            </div>
        );
    };

    const activeItemCount = activeTab === 'todo' ? todoCount : completedCount;

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
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col lg={12}>
                    {isLoading ? (
                        <div className="text-center py-4">
                            <Spinner size="2x" />
                        </div>
                    ) : (
                        <Tabs
                            activeKey={activeTab}
                            onSelect={key => {
                                setSelectedTagIds([]);
                                setActiveTab((key as 'todo' | 'completed') || 'todo');
                            }}
                            className="mb-3"
                        >
                            <Tab eventKey="todo" title="To do">
                                {renderTagFilters()}
                                {renderTodoList(todoItems, 'No todo items found', false, todoCount, isLoadingMoreTodo, loadMoreTodo)}
                            </Tab>
                            <Tab eventKey="completed" title="Completed">
                                {renderTagFilters()}
                                {renderTodoList(completedItems, 'No completed items found', true, completedCount, isLoadingMoreCompleted, loadMoreCompleted)}
                            </Tab>
                        </Tabs>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default TodoPage;