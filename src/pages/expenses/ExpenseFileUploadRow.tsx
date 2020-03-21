import filesize from 'filesize';
import React from 'react';
import { Button, FormControl } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import Select from '../../components/Select';

class ExpenseFileUploadRow extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            name: '',
            typeId: '',
        };

        this.onClickLink = this.onClickLink.bind(this);
        this.onNameChanged = this.onNameChanged.bind(this);
        this.onTypeIdChanged = this.onTypeIdChanged.bind(this);
    }

    public onClickLink() {
        const expenseFile = {
            file: this.props.file,
            name: this.state.name,
            type: this.state.typeId,
        };

        this.props.linkFile(expenseFile);
    }

    public onNameChanged(value) {
        this.setState({...this.state, name: value});
    }

    public onTypeIdChanged(typeId) {
        this.setState({...this.state, typeId});
    }

    public render() {

        const { file } = this.props;

        return (
            <tr>
                <td>{file.type}</td>
                <td>{filesize(file.size)}</td>
                <td>
                    <FormControl value={this.state.name} placeholder="Name" type="text" onChange={(e) => this.onNameChanged(e.target.value)} />
                </td>
                <td>
                    <Select options={this.props.fileTypes} onChange={this.onTypeIdChanged} />
                </td>
                <td>
                    <Button className="pull-right" variant="primary" size="xsmall" onClick={this.onClickLink}>
                        <FontAwesome name="link" /> Link
                    </Button>&nbsp;
                    <Button className="pull-right" variant="danger" size="xsmall" onClick={() => this.props.deleteFile(this.props.file.id)}>
                        <FontAwesome name="trash" /> Delete
                    </Button>
                </td>
            </tr>
      );
    }

}

export default ExpenseFileUploadRow;
