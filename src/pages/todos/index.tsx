import React from 'react';
import { Grid, Row, Col, Panel, ListGroup, ListGroupItem, Label, Checkbox, Table, FormControl, Form } from 'react-bootstrap/lib';

import api from "../../api/main";
import { boundMethod } from 'autobind-decorator';

class ToDosPage extends React.Component {

    state = {
        todos: {
            count: 0,
            items: []
        },
        newTodo: ''
    }

    componentDidMount() {
        this.getToDos();
    }

    @boundMethod
    addNew(e) {
        e.preventDefault();
        api.todo.post(this.state.newTodo).then(() => {
            this.setState({ newTodo: '' });
            this.getToDos();
        });
        return false;
    }

    getToDos() {
        api.todo.get({ isDone: false }).then(todos => this.setState({ todos }));
    }

    @boundMethod
    renderTodos() {
        return this.state.todos.items.map(todo => (<tr key={todo.id}>
            <td><Checkbox onClick={() => this.setDone(todo.id)} /></td>
            <td>{todo.name}</td>
        </tr>
        ));
    }

    @boundMethod
    setDone(id) {
        api.todo.postDone(id).then(() => this.getToDos());
    }

    render() {

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