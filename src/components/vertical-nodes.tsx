import React from 'react';

import '../styles/vertical-nodes.scss';

export interface VerticalNodeItem {
    key: string | number;
    node: React.ReactNode;
    label: React.ReactNode;
}

interface Props {
    items: VerticalNodeItem[];
}

export const VerticalNodes = ({ items }: Props) => {
    if (items.length === 0) {
        return null;
    }

    return (
        <ol className="vertical-nodes">
            {items.map((item, index) => (
                <li key={item.key} className="vertical-nodes__item">
                    <div className="vertical-nodes__rail">
                        <div className="vertical-nodes__node">
                            {item.node}
                        </div>
                        {index < items.length - 1 && (
                            <div className="vertical-nodes__connector" aria-hidden />
                        )}
                    </div>
                    <div className="vertical-nodes__label">
                        {item.label}
                    </div>
                </li>
            ))}
        </ol>
    );
};

export default VerticalNodes;
