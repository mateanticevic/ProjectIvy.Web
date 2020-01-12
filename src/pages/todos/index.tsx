import React from 'react';
import { Checkbox, Col, Form, FormControl, Grid, Label, ListGroup, ListGroupItem, Panel, Row, Table } from 'react-bootstrap/lib';

import { boundMethod } from 'autobind-decorator';
import api from '../../api/main';

class ToDosPage extends React.Component {

    public state = {
        todos: {
            count: 0,
            items: [],
        },
        newTodo: '',
    };

    public componentDidMount() {
        this.getToDos();
    }

    @boundMethod
    public addNew(e) {
        e.preventDefault();
        api.todo.post(this.state.newTodo).then(() => {
            this.setState({ newTodo: '' });
            this.getToDos();
        });
        return false;
    }

    public getToDos() {
        api.todo.get({ isDone: false }).then((todos) => this.setState({ todos }));
    }

    @boundMethod
    public renderTodos() {
        return this.state.todos.items.map((todo) => (<tr key={todo.id}>
            <td><Checkbox onClick={() => this.setDone(todo.id)} /></td>
            <td>{todo.name}</td>
        </tr>
        ));
    }

    @boundMethod
    public setDone(id) {
        api.todo.postDone(id).then(() => this.getToDos());
    }

    public render() {

        return (
            <Grid>
                <Row>
                    <Col lg={12}>
                        <Panel>
                            <Panel.Heading>To Do</Panel.Heading>
                            <Panel.Body className="padding-0 panel-large">
                                <Form onSubmit={this.addNew}>
                                    <FormControl type="text" value={this.state.newTodo} onChange={x => this.setState({ newTodo: x.target.value })} />
                                </Form>
                                <Table responsive>
                                    <tbody>
                                        {this.renderTodos()}
                                    </tbody>
                                </Table>
                            </Panel.Body>
                        </Panel>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

export default ToDosPage;
