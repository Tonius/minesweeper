import * as React from 'react';

import {Board as BoardType, GameState} from './Minesweeper';
import {Cell} from './Cell';

interface BoardProps {
    board: BoardType;
    gameState: GameState;
    onCellClick: (row: number, col: number, button: number) => void;
}

export class Board extends React.Component<BoardProps> {
    render() {
        return (
            <div className="msw-board">
                {this.props.board.map((row, ri) => (
                    <div key={ri} className="msw-board-row">
                        {row.map((cell, ci) => (
                            <Cell
                                key={ci}
                                cell={cell}
                                gameState={this.props.gameState}
                                onClick={(button) => this.props.onCellClick(ri, ci, button)} />
                        ))}
                    </div>
                ))}
            </div>
        );
    }
}
