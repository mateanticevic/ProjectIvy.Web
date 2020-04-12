import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';

import ExpenseFileTable from './ExpenseFileTable';
import { ExpenseFileUploadTable } from './ExpenseFileUploadTable';
import { UploadedFile } from 'types/common';
import { ExpenseFile } from 'types/expenses';

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

    const onLinkFile = (fileId: string, expenseFile: ExpenseFile) => {
        linkFile(fileId, expenseFile);
        setUploadedFiles(uploadedFiles.filter(x => x.id != fileId));
    };

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
                    <div className="dropzone" {...getRootProps()}>
                        <input {...getInputProps()} />
                        Drag & drop or click here
                    </div>
                </Col>
            </Row>
            <Row>
                <Col lg={12}>
                    {uploadedFiles?.length > 0 &&
                        <ExpenseFileUploadTable
                            files={uploadedFiles}
                            linkFile={onLinkFile}
                            deleteFile={deleteFile}
                            fileTypes={fileTypes}
                        />
                    }
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default ExpenseFormFilesTab;
