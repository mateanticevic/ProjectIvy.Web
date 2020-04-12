import React, { useState } from 'react';
import filesize from 'filesize';
import { FormControl, Button } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

import Select from '../../components/Select';
import { ExpenseFile } from 'types/expenses';
import { UploadedFile } from 'types/common';

interface Props {
    fileTypes: any;
    uploadedFile: UploadedFile;
    linkFile: (fileId: string, expenseFile: ExpenseFile) => void;
}

export const ExpenseFileUploadRow = ({ fileTypes, uploadedFile, linkFile }: Props) => {
    const [name, setName] = useState('');
    const [fileTypeId, setFileTypeId] = useState(fileTypes[0].id);

    return (
        <tr>
            <td>{uploadedFile.file.type}</td>
            <td>{filesize(uploadedFile.file.size)}</td>
            <td>
                <FormControl value={name} placeholder="Name" type="text" onChange={e => setName(e.target.value)} />
            </td>
            <td>
                <Select
                    options={fileTypes}
                    onChange={id => setFileTypeId(id)}
                    selected={fileTypeId}
                />
            </td>
            <td>
                <Button className="pull-right" variant="primary" size="sm" onClick={() => linkFile(uploadedFile.id, { name, typeId: fileTypeId })}>
                    <FontAwesome name="link" /> Link
                </Button>&nbsp;
                <Button className="pull-right" variant="danger" size="sm">
                    <FontAwesome name="trash" /> Delete
                </Button>
            </td>
        </tr>
    );
}