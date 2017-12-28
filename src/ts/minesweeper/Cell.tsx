import * as React from 'react';

import {CellRecord, GameState} from './Minesweeper';

interface CellProps {
    cell: CellRecord;
    gameState: GameState;
    onClick: (button: number) => void;
}

export class Cell extends React.Component<CellProps> {
    render() {
        const type = this.props.cell.get('type', '');
        const state = this.props.cell.get('state', '');
        const adjacentMines = this.props.cell.get('adjacentMines', 0);

        let className = `msw-board-cell state-${state}`;

        let text = '';
        if (state === 'flagged') {
            text = '🚩';
        } else if (state === 'shown') {
            if (type === 'mine') {
                text = '💣';
                className = `${className} clicked-mine`;
            } else if (adjacentMines > 0) {
                text = String(adjacentMines);
                className = `${className} adjacent-${adjacentMines}`;
            }
        } else if (this.props.gameState === 'lose' && type === 'mine') {
            text = '💣';
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
