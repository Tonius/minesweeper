import * as React from 'react';

import {CellRecord} from './Minesweeper';

interface CellProps {
    cell: CellRecord;
    onClick: (button: number) => void;
}

export class Cell extends React.Component<CellProps> {
    render() {
        const state = this.props.cell.get('state', 'hidden');
        const adjacentMines = this.props.cell.get('adjacentMines', 0);

        let className = `msw-board-cell state-${state}`;

        let text = '';
        if (state === 'flagged') {
            text = '🚩';
        } else if (state === 'shown' && adjacentMines > 0) {
            text = String(adjacentMines);
        }

        return (
            <div
                className={className}
                onMouseDown={(evt) => this.props.onClick(evt.button)}
                onContextMenu={(evt) => evt.preventDefault()}>
                <span>{text}</span>
            </div>
        );
    }
}
