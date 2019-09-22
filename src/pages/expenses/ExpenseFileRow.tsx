import filesize from 'filesize';
import React from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap/lib';
import FontAwesome from 'react-fontawesome';
import Moment from 'react-moment';

const ExpenseFileRow = ({ expenseFile }) => {

    const fileTypeTooltip = (
        <Tooltip>
            {expenseFile.file.type.name}
        </Tooltip>
    );

    function mapFileTypeToIcon(typeId) {
        switch (typeId) {
            case 'jpg':
                return 'image';
            case 'pdf':
                return 'file-o';
            default:
                return 'file-o';
        }
    }

    return (
        <tr>
            <td><Moment format="Do MMMM YYYY">{expenseFile.file.created}</Moment></td>
            <td>{filesize(expenseFile.file.size)}</td>
            <td>
                <OverlayTrigger placement="right" overlay={fileTypeTooltip}>
                    <FontAwesome name={mapFileTypeToIcon(expenseFile.file.type.id)} />
                </OverlayTrigger>
                &nbsp;{expenseFile.type.name} {expenseFile.name && `(${expenseFile.name})`}
            </td>
            <td>
                <Button className="pull-right" bsStyle="primary" bsSize="xsmall" onClick={() => window.open(`https://api2.anticevic.net/file/${expenseFile.file.id}`)}>
                    <FontAwesome name="download" /> Download
                </Button>
            </td>
        </tr>
    );
};

export default ExpenseFileRow;
