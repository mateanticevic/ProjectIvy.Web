import React from "react";
import { Button, ButtonGroup } from "react-bootstrap";

interface Props {
    year?: number;
    onChange(year: number): void;
}

const YearNavigator = ({ year, onChange }: Props) => {
    const isCurrentYear = year === new Date().getFullYear();

    return (
        <ButtonGroup>
            <Button onClick={() => onChange(year! - 1)}>&#x3C; {year ? year - 1 : ''}</Button>
            <Button disabled={isCurrentYear}></Button>
        </ButtonGroup>
    );
}

export default YearNavigator;