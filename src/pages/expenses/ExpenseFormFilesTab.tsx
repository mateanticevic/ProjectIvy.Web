import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';

import ExpenseFileTable from './ExpenseFileTable';
import { ExpenseFileUploadTable } from './ExpenseFileUploadTable';
import { UploadedFile } from 'types/common';

const ExpenseFormFilesTab = ({ uploadFile, files, linkFile, deleteFile, fileTypes }) => {
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

    useEffect(() => {
        async function effect() {
            const newUploadedFiles = await Promise.all(acceptedFiles.filter(file => !uploadedFiles.some(uf => uf.file == file))
                .map(async (file) => {
                    const fileId = await uploadFile(file);
                    return {
                        id: fileId,
                        file,
                    };
                }));

            setUploadedFiles([
                ...uploadedFiles,
                ...newUploadedFiles,
            ]);
        }

        effect();
    }, [acceptedFiles]);

    return (
        <React.Fragment>
            {files && files.length > 0 &&
                <Row>
                    <Col lg={12}>
                        <ExpenseFileTable files={files} />
                    </Col>
                </Row>
            }
            <Row>
                <Col lg={12}>
                    <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <p>Drag 'n' drop some files here, or click to select files</p>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col lg={12}>
                    <ExpenseFileUploadTable
                        files={uploadedFiles}
                        linkFile={linkFile}
                        deleteFile={deleteFile}
                        fileTypes={fileTypes}
                    />
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default ExpenseFormFilesTab;
