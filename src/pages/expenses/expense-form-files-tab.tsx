import React, { useEffect, useState } from 'react';
import { Col, Row, Table } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';

import { UploadedFile } from 'types/common';
import { ExpenseFile } from 'types/expenses';
import { ExpenseFileRow } from './expense-file-row';
import { ExpenseFileUploadRow } from './expense-file-upload-row';

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
                        <Table responsive>
                            <tbody>
                                {files &&
                                    files.map(expenseFile => <ExpenseFileRow expenseFile={expenseFile} />)
                                }
                            </tbody>
                        </Table>
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
                        <Table responsive>
                            <tbody>
                                {uploadedFiles.map(uploadedFile =>
                                    <ExpenseFileUploadRow
                                        fileTypes={fileTypes}
                                        linkFile={onLinkFile}
                                        uploadedFile={uploadedFile}
                                    />
                                )}
                            </tbody>
                        </Table>
                    }
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default ExpenseFormFilesTab;
