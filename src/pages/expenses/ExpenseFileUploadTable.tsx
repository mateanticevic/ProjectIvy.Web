import React from 'react';
import { Table } from 'react-bootstrap';

import { UploadedFile } from 'types/common';
import { ExpenseFile } from 'types/expenses';
import { ExpenseFileUploadRow } from './ExpenseFileUploadRow';

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
        <ExpenseFileUploadRow
          fileTypes={fileTypes}
          linkFile={linkFile}
          uploadedFile={uploadedFile}
        />
      )}
    </tbody>
  </Table>;