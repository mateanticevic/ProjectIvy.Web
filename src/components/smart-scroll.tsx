import React, { Component, ReactNode } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Button } from 'react-bootstrap';

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
                        <Button 
                            onClick={onLoadMore} 
                            className="w-100 mb-3"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Loading...' : 'Load More'}
                        </Button>
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
