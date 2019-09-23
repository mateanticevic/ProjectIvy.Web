import React from 'react';
import { Col, Row } from 'react-bootstrap/lib';
import Dropzone from 'react-dropzone';
import ExpenseFileTable from './ExpenseFileTable';
import ExpenseFileUploadTable from './ExpenseFileUploadTable';

const ExpenseFormFilesTab = ({expense, uploadFiles, files, linkFile, deleteFile, fileTypes}) => {

    return(
        <div>
            <Row>
                <Col lg={12}>
                    <ExpenseFileTable files={files} />
                </Col>
            </Row>
            <Row>
                <Col lg={12}>
                    <ExpenseFileUploadTable files={files} linkFile={linkFile} deleteFile={deleteFile} fileTypes={fileTypes} />
                </Col>
            </Row>
            <Row>
                <Col lg={12}>
                    <Dropzone onDrop={(files) => uploadFiles(files, expense.id)}>
                        <p>Try dropping some files here, or click to select files to upload.</p>
                    </Dropzone>
                </Col>
            </Row>
        </div>
    );
};

export default ExpenseFormFilesTab;
