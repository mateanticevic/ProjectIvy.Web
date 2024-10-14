import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from 'react-bootstrap';

interface DropzoneButtonProps {
    title: string;
    onSelected: (files: File[]) => void;
}

const DropzoneButton = ({ title, onSelected }) => {
    const { getRootProps, getInputProps } = useDropzone({ onDrop: onSelected });

    return (
        <div {...getRootProps()} style={{ display: 'inline-block' }}>
            <input {...getInputProps()} />
            <Button size="sm" variant="primary">
                {title}
            </Button>
        </div>
    );
};

export default DropzoneButton;