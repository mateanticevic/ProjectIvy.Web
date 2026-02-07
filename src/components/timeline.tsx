import React, { useEffect, useRef } from 'react';
import moment from 'moment';
import '../styles/timeline.scss';

const MIN_POSITION = 5;
const MAX_POSITION = 95;

export type TimelineOrientation = 'horizontal' | 'vertical';
export type TimelineValueType = 'date' | 'number';

interface TimelineItem<T = any> {
    value: Date | number;
    label?: string;
    data?: T;
}

interface TimelineProps<T = any> {
    items: TimelineItem<T>[];
    orientation?: TimelineOrientation;
    valueType?: TimelineValueType;
    renderItem?: (item: TimelineItem<T>, index: number) => React.ReactNode;
    formatValue?: (value: Date | number) => string;
    unit?: string;
}

const defaultFormatValue = (value: Date | number, valueType: TimelineValueType, unit?: string): string => {
    if (valueType === 'date') {
        return moment(value).format('MMM D, YYYY');
    }
    return unit ? `${value} ${unit}` : String(value);
};

export const Timeline = <T,>({
    items,
    orientation = 'horizontal',
    valueType = 'date',
    renderItem,
    formatValue,
    unit,
}: TimelineProps<T>) => {
    const timelineWrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (orientation === 'horizontal' && timelineWrapperRef.current) {
            // Scroll to the far right
            timelineWrapperRef.current.scrollLeft = timelineWrapperRef.current.scrollWidth;
        }
    }, [items, orientation]);

    if (!items || items.length === 0) {
        return <div className="timeline-empty">No items to display</div>;
    }

    const sortedItems = [...items].sort((a, b) => {
        const aVal = valueType === 'date' ? new Date(a.value).getTime() : Number(a.value);
        const bVal = valueType === 'date' ? new Date(b.value).getTime() : Number(b.value);
        return aVal - bVal;
    });

    // Calculate numeric values for positioning
    const numericValues = sortedItems.map(item => 
        valueType === 'date' ? new Date(item.value).getTime() : Number(item.value)
    );

    const minValue = Math.min(...numericValues);
    const maxValue = Math.max(...numericValues);
    const range = maxValue - minValue;
    const positionRange = MAX_POSITION - MIN_POSITION;

    // Calculate position percentage for each item (using adjustable position range)
    const itemsWithPositions = sortedItems.map((item, index) => {
        const position = range === 0 ? (MIN_POSITION + MAX_POSITION) / 2 : MIN_POSITION + ((numericValues[index] - minValue) / range) * positionRange;
        return { item, position, numericValue: numericValues[index] };
    });

    // Group items by their numeric value (same date/number)
    const groupedItems = itemsWithPositions.reduce((acc, { item, position, numericValue }) => {
        const existing = acc.find(g => g.numericValue === numericValue);
        if (existing) {
            existing.items.push(item);
        } else {
            acc.push({ position, numericValue, items: [item] });
        }
        return acc;
    }, [] as Array<{ position: number; numericValue: number; items: TimelineItem<T>[] }>);

    const formatter = formatValue || ((val) => defaultFormatValue(val, valueType, unit));

    return (
        <div className={`timeline timeline-${orientation}`}>
            {orientation === 'horizontal' ? (
                <div className="timeline-wrapper" ref={timelineWrapperRef}>
                    <div className="timeline-line" />
                    <div className="timeline-items">
                        {groupedItems.map((group, groupIndex) => (
                            <div 
                                key={groupIndex} 
                                className="timeline-item"
                                style={{ left: `${group.position}%` }}
                            >
                                <div className="timeline-point" />
                                <div className="timeline-content">
                                    <div className="timeline-value">{formatter(group.items[0].value)}</div>
                                    {group.items.map((item, itemIndex) => (
                                        <div key={itemIndex} className="timeline-item-group">
                                            {item.label && <div className="timeline-label">{item.label}</div>}
                                            {renderItem && <div className="timeline-custom">{renderItem(item, itemIndex)}</div>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <>
                    <div className="timeline-line" />
                    <div className="timeline-items">
                        {groupedItems.map((group, groupIndex) => (
                            <div 
                                key={groupIndex} 
                                className="timeline-item"
                                style={{ top: `${group.position}%` }}
                            >
                                <div className="timeline-point" />
                                <div className="timeline-content">
                                    <div className="timeline-value">{formatter(group.items[0].value)}</div>
                                    {group.items.map((item, itemIndex) => (
                                        <div key={itemIndex} className="timeline-item-group">
                                            {item.label && <div className="timeline-label">{item.label}</div>}
                                            {renderItem && <div className="timeline-custom">{renderItem(item, itemIndex)}</div>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};
