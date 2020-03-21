import _ from 'lodash';
import React from 'react';
import BootstrapPagination from 'react-bootstrap/Pagination';

interface Props {
    page: number;
    pages: number;
    showPages?: number;
    onPageChange: (page: number) => void;
}

const Pagination = ({ showPages, page, pages, onPageChange }: Props) => {

    showPages = showPages ? showPages : 5;

    const startPage = page > 1 ? Math.floor((page - 2) / (showPages - 2)) * (showPages - 2) + 1 : 1;

    const endPage = startPage + showPages > pages ? pages : startPage + showPages - 1;

    return (
        <BootstrapPagination>
            {_.range(startPage, endPage + 1).map(item =>
                <BootstrapPagination.Item
                    key={_.uniqueId('pagination_item_')}
                    active={item == page}
                    onClick={() => onPageChange(item)}>
                    {item}
                </BootstrapPagination.Item>,
            )}
        </BootstrapPagination>
    );
};

export default Pagination;
