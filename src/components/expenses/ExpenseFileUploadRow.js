import React from 'react';
import { Button, FormControl } from 'react-bootstrap/lib';
import FontAwesome from 'react-fontawesome';
import Select from '../common/Select';

class ExpenseFileUploadRow extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            name: '',
            typeId: ''
        };

        this.onClickLink = this.onClickLink.bind(this);
        this.onNameChanged = this.onNameChanged.bind(this);
        this.onTypeIdChanged = this.onTypeIdChanged.bind(this);
    }

    onClickLink(){
        const expenseFile = {
            file: this.props.file,
            name: this.state.name,
            type: this.state.typeId
        };

        this.props.linkFile(expenseFile);
    }

    onNameChanged(value){
        this.setState({...this.state, name: value});
    }

    onTypeIdChanged(typeId){
        this.setState({...this.state, typeId: typeId});
    }

    render(){

        let { file, common } = this.props;

        return (
            <tr>
                <td>{file.type}</td>
                <td>{file.size}</td>
                <td>
                    <FormControl value={this.state.name} placeholder="Name" type="text" onChange={e => this.onNameChanged(e.target.value)} />
                </td>
                <td>
                    <Select options={common.expenseFileTypes} onChange={this.onTypeIdChanged} />
                </td>
                <td>
                    <Button className="pull-right" bsStyle="primary" bsSize="xsmall" onClick={this.onClickLink}>
                        <FontAwesome name="link" /> Link
                    </Button>
                </td>
            </tr>
      );
    }

}

export default ExpenseFileUploadRow;