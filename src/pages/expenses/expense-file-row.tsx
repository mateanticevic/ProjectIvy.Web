import { filesize } from 'filesize';
import React from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaFile, FaImage, FaDownload } from 'react-icons/fa';
import moment from 'moment';

import { components } from 'types/ivy-types';

type ExpenseFile = components['schemas']['ExpenseFile'];

interface Props {
    expenseFile: ExpenseFile,
}

export const ExpenseFileRow = ({ expenseFile }: Props) => {

    const fileTypeTooltip = (
        <Tooltip>
            {expenseFile!.file!.type!.name}
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
            <td>{moment(expenseFile.file!.created).format('Do MMMM YYYY')}</td>
            <td>{filesize(expenseFile.file!.size!)}</td>
            <td>
                <OverlayTrigger placement="right" overlay={fileTypeTooltip}>
                    {mapFileTypeToIcon(expenseFile!.file!.type!.id)}
                </OverlayTrigger>
                &nbsp;{expenseFile.type!.name} {expenseFile.name && `(${expenseFile.name})`}
            </td>
            <td>
                <Button
                    className="pull-right"
                    variant="primary"
                    size="sm"
                    onClick={() => window.open(`${import.meta.env.VITE_API_URL}/file/${expenseFile.file!.id}`)}
                >
                    <FaDownload /> Download
                </Button>
            </td>
        </tr>
    );
};
