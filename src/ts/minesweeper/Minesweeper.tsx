import * as React from 'react';
import {List} from 'immutable';

export class Minesweeper extends React.Component {
    render() {
        let board = List([
            List(['', '', '', '', '', '', '', '', '', '']),
            List(['', '', '', '', '', '', '', '', '', '']),
            List(['', '', '', '', '', '', '', '', '', '']),
            List(['', '', '', '', '', '', '', '', '', '']),
            List(['', '', '', '', '', '', '', '', '', '']),
            List(['', '', '', '', '', '', '', '', '', '']),
            List(['', '', '', '', '', '', '', '', '', '']),
            List(['', '', '', '', '', '', '', '', '', '']),
            List(['', '', '', '', '', '', '', '', '', '']),
            List(['', '', '', '', '', '', '', '', '', ''])
        ])

        return (
            <div className="msw-board">
                {board.map(row => (
                    <div className="msw-board-row">
                        {row!.map(cell => (
                            <div className="msw-board-cell">
                                <span>{cell}</span>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        );
    }
}
