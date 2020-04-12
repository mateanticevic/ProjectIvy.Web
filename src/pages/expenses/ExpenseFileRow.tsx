import filesize from 'filesize';
import React from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Moment from 'react-moment';
import { FaFile, FaImage, FaDownload } from 'react-icons/fa';

const ExpenseFileRow = ({ expenseFile }) => {

    const fileTypeTooltip = (
        <Tooltip>
            {expenseFile.file.type.name}
        </Tooltip>
    );

    function mapFileTypeToIcon(typeId) {
        switch (typeId) {
            case 'jpg':
                return <FaImage />;
            default:
                return <FaFile />;
        }
    }

    return (
        <tr>
            <td><Moment format="Do MMMM YYYY">{expenseFile.file.created}</Moment></td>
            <td>{filesize(expenseFile.file.size)}</td>
            <td>
                <OverlayTrigger placement="right" overlay={fileTypeTooltip}>
                    {mapFileTypeToIcon(expenseFile.file.type.id)}
                </OverlayTrigger>
                &nbsp;{expenseFile.type.name} {expenseFile.name && `(${expenseFile.name})`}
            </td>
            <td>
                <Button
                    className="pull-right"
                    variant="primary"
                    size="sm"
                    onClick={() => window.open(`https://api2.anticevic.net/file/${expenseFile.file.id}`)}
                >
                    <FaDownload /> Download
                </Button>
            </td>
        </tr>
    );
};

export default ExpenseFileRow;
