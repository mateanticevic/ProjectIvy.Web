import React from 'react';
import { Row, Col } from 'react-bootstrap/lib';
import ExpenseFileTable from './ExpenseFileTable';
import ExpenseFileUploadTable from './ExpenseFileUploadTable';
import Dropzone from 'react-dropzone';

const ExpenseFormFilesTab = ({expense, uploadFiles, files, linkFile, common}) => {

    return(
        <div>
            <Row>
                <Col lg={12}>
                    <ExpenseFileTable files={expense.files} />
                </Col>
            </Row>
            <Row>
                <Col lg={12}>
                    <ExpenseFileUploadTable files={files} linkFile={linkFile} common={common} />
                </Col>
            </Row>
            <Row>
                <Col lg={12}>
                    <Dropzone onDrop={files => uploadFiles(files, expense.id)}>
                        <p>Try dropping some files here, or click to select files to upload.</p>
                    </Dropzone>
                </Col>
            </Row>
        </div>
    );
}

export default ExpenseFormFilesTab;