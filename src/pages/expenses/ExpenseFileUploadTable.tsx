import React from 'react';
import { Button, FormControl, Table } from 'react-bootstrap';
import filesize from 'filesize';
import FontAwesome from 'react-fontawesome';

import Select from '../../components/Select';
import { UploadedFile } from 'types/common';
import { ExpenseFile } from 'types/expenses';

interface Props {
  files: UploadedFile[];
  fileTypes: any;
  deleteFile: () => void;
  linkFile: (fileId: string, expenseFile: ExpenseFile) => void;
}

export const ExpenseFileUploadTable = ({ files, fileTypes, deleteFile, linkFile }: Props) =>
  <Table responsive>
    <thead>
      <tr>
        <th>File type</th>
        <th>Size</th>
        <th>Name</th>
        <th>Type</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {files.map(uploadedFile =>
        <tr>
          <td>{uploadedFile.file.type}</td>
          <td>{filesize(uploadedFile.file.size)}</td>
          <td>
            <FormControl value={uploadedFile.file.name} placeholder="Name" type="text" />
          </td>
          <td>
            <Select options={fileTypes} onChange={() => {}} />
          </td>
          <td>
            <Button className="pull-right" variant="primary" size="sm" onClick={() => linkFile(uploadedFile.id, { name: '', typeId: fileTypes[0].id })}>
              <FontAwesome name="link" /> Link
            </Button>&nbsp;
            <Button className="pull-right" variant="danger" size="sm">
              <FontAwesome name="trash" /> Delete
            </Button>
          </td>
        </tr>
      )}
    </tbody>
  </Table>;
