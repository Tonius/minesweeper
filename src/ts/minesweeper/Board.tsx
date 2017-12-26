import * as React from 'react';

import {Board as BoardType} from './Minesweeper';
import {Cell} from './Cell';

interface BoardProps {
    board: BoardType;
    onCellClick: (row: number, col: number) => void;
}

export class Board extends React.Component<BoardProps> {
    render() {
        return (
            <div className="msw-board">
                {this.props.board.map((row, ri) => (
                    <div key={ri} className="msw-board-row">
                        {row.map((cell, ci) => (
                            <Cell key={ci} cell={cell} onClick={() => this.props.onCellClick(ri, ci)} />
                        ))}
                    </div>
                ))}
            </div>
        );
    }
}
