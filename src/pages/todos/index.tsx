import React from 'react';
import { FormCheck, Col, Form, FormControl, Container, FormLabel, Card, Row, Table } from 'react-bootstrap';

import { boundMethod } from 'autobind-decorator';
import api from '../../api/main';

class ToDosPage extends React.Component {

    state = {
        todos: {
            count: 0,
            items: [],
        },
        newTodo: '',
    };

    componentDidMount() {
        this.getToDos();
    }

    render() {

        return (
            <Container>
                <Row>
                    <Col lg={12}>
                        <Card>
                            <Card.Header>To Do</Card.Header>
                            <Card.Body className="padding-0 panel-large">
                                <Form onSubmit={this.addNew}>
                                    <FormControl type="text" value={this.state.newTodo} onChange={x => this.setState({ newTodo: x.target.value })} />
                                </Form>
                                <Table responsive>
                                    <tbody>
                                        {this.renderTodos()}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }

    @boundMethod
    private addNew(e) {
        e.preventDefault();
        api.todo.post(this.state.newTodo).then(() => {
            this.setState({ newTodo: '' });
            this.getToDos();
        });
        return false;
    }

    private getToDos() {
        api.todo.get({ isDone: false })
            .then(todos => this.setState({ todos }));
    }

    @boundMethod
    private renderTodos() {
        return this.state.todos.items.map((todo) => (<tr key={todo.id}>
            <td><FormCheck onClick={() => this.setDone(todo.id)} /></td>
            <td>{todo.name}</td>
        </tr>
        ));
    }

    @boundMethod
    private setDone(id) {
        api.todo.postDone(id)
            .then(() => this.getToDos());
    }
}

export default ToDosPage;
