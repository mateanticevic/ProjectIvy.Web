import _ from 'lodash';
import React from 'react';
import BootstrapPagination from 'react-bootstrap/lib/Pagination';

interface Props {
    page: number;
    pages: number;
    showPages?: number;
    onPageChange: (page: number) => void;
}

const Pagination = ({ showPages, page, pages, onPageChange }: Props) => {

    showPages = showPages ? showPages : 5;

    const startPage = page > 2 ? (page + showPages > pages ? (pages - showPages < 0 ? 1 : pages - showPages + 1) : page - 2) : 1;

    const endPage = startPage + showPages > pages ? pages : startPage + showPages - 1;

    const items = _.range(startPage, endPage + 1).map(item =>
        <BootstrapPagination.Item
            key={_.uniqueId('pagination_item_')}
            active={item == page}
            onClick={() => onPageChange(item)}>
            {item}
        </BootstrapPagination.Item>,
    );

    return (
        <BootstrapPagination>
            {items}
        </BootstrapPagination>
    );
};

export default Pagination;
