import React, { Component, ReactNode } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import ButtonWithSpinner from './button-with-spinner';

interface Props {
    children: ReactNode;
    dataLength: number;
    hasMore: boolean;
    isLoading?: boolean;
    loader?: ReactNode;
    onLoadMore: () => void;
}

interface State {
    isMobile: boolean;
}

class SmartScroll extends Component<Props, State> {
    state: State = {
        isMobile: window.innerWidth < 992,
    };

    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    handleResize = () => {
        this.setState({ isMobile: window.innerWidth < 992 });
    };

    render() {
        const { children, dataLength, hasMore, isLoading, loader, onLoadMore } = this.props;
        const { isMobile } = this.state;

        if (isMobile) {
            return (
                <>
                    {children}
                    {hasMore && (
                        <div className="d-grid mb-3">
                            <ButtonWithSpinner
                                onClick={onLoadMore}
                                isLoading={isLoading}
                            >
                                Load More
                            </ButtonWithSpinner>
                        </div>
                    )}
                </>
            );
        }

        return (
            <InfiniteScroll
                dataLength={dataLength}
                next={onLoadMore}
                hasMore={hasMore}
                loader={loader ?? <h4>Loading...</h4>}
            >
                {children}
            </InfiniteScroll>
        );
    }
}

export default SmartScroll;
