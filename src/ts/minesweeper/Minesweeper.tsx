import * as React from 'react';
import {List, Record} from 'immutable';
import {find, range} from 'lodash';

import {Board as BoardComponent} from './Board';
import {Stats} from './Stats';

export interface Cell {
    type: 'start' | 'empty' | 'mine';
    state: 'hidden' | 'shown' | 'flagged';
    adjacentMines: number;
};

export type CellRecord = Record<Cell>;
export const CellRecord = Record<Cell>({type: 'start', state: 'hidden', adjacentMines: 0});
export type Row = List<CellRecord>;
export type Board = List<Row>;

interface MinesweeperState {
    start: boolean;
    time: number;
    board: Board;
}

type MinePositions = {row: number, col: number}[];

const ROWS = 9;
const COLS = 9;
const MINES = 10;

const LEFT_CLICK = 0;
const RIGHT_CLICK = 2;

// TODO:
// - implement endGame
// - configure game

export class Minesweeper extends React.Component<{}, MinesweeperState> {
    private intervalId?: number;

    constructor(props) {
        super(props);

        this.state = {
            start: true,
            time: 0,
            board: List(range(ROWS).map(() => {
                return List(range(COLS).map(() => {
                    return CellRecord();
                }));
            }))
        };
    }

    handleCellClick = (ri: number, ci: number, button: number) => {
        if (this.state.start) {
            if (button !== LEFT_CLICK) {
                return;
            }

            this.setState({
                start: false,
                board: this.initializeBoard(ri, ci)
            });

            this.startTime();

            return;
        }

        if (this.isCellShown(ri, ci)) {
            return;
        }

        if (button === LEFT_CLICK) {
            if (this.isCellMine(ri, ci)) {
                this.endGame(true);

                return;
            }

            this.setState({board: this.revealCells(this.state.board, ri, ci)});
        } else if (button === RIGHT_CLICK) {
            this.setState({board: this.toggleCellFlag(this.state.board, ri, ci)})
        }
    }

    initializeBoard(startRow: number, startCol: number): Board {
        let board = this.state.board;

        let minePositions = this.generateMines(startRow, startCol);
        let isMinePos = (row, col) => {
            return find(minePositions, ({row: mineRow, col: mineCol}) => row === mineRow && col === mineCol) !== undefined;
        }

        board = board.map((row, ri) => row.map((cell, ci) => {
            if (isMinePos(ri, ci)) {
                return cell.set('type', 'mine');
            }

            let adjacentMines = 0;

            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    let checkRow = ri + i;
                    let checkCol = ci + j;

                    if (checkRow < 0 || checkRow >= ROWS || checkCol < 0 || checkCol >= COLS) {
                        continue;
                    }

                    if (isMinePos(checkRow, checkCol)) {
                        adjacentMines++;
                    }
                }
            }

            return cell.merge({type: 'empty', adjacentMines});
        }));

        return this.revealCells(board, startRow, startCol);
    }

    generateMines(startRow: number, startCol: number) {
        let mines: MinePositions = [];

        for (let i = 0; i < MINES; i++) {
            let occupied = false;

            do {
                let row = Math.floor(Math.random() * ROWS);
                let col = Math.floor(Math.random() * COLS);

                occupied = (
                    (row === startRow && col === startCol) ||
                    find(mines, ({row: oRow, col: oCol}) => row === oRow && col === oCol) !== undefined
                );

                if (!occupied) {
                    mines.push({row, col});
                }
            } while (occupied);
        }

        return mines;
    }

    startTime() {
        this.intervalId = setInterval(() => this.setState({time: this.state.time + 1}), 1000);
    }

    stopTime() {
        if (this.intervalId !== undefined) {
            clearInterval(this.intervalId);
        }
    }

    isCellMine(ri, ci): boolean {
        let row = this.state.board.get(ri);
        if (row === undefined) {
            return false;
        }

        let cell = row.get(ci);
        if (cell === undefined) {
            return false;
        }

        return cell.get('type', '') === 'mine';
    }

    isCellShown(ri, ci): boolean {
        let row = this.state.board.get(ri);
        if (row === undefined) {
            return true;
        }

        let cell = row.get(ci);
        if (cell === undefined) {
            return true;
        }

        return cell.get('state', '') === 'shown';
    }

    revealCells(board: Board, ri: number, ci: number): Board {
        let row = board.get(ri);
        if (row === undefined) {
            return board;
        }

        let cell = row.get(ci);
        if (cell === undefined) {
            return board;
        }

        if (cell.get('state', '') === 'shown' || cell.get('state', '') === 'flagged' || cell.get('type', '') === 'mine') {
            return board;
        }

        board = board.set(ri, row.set(ci, cell.set('state', 'shown')));

        if (cell.get('adjacentMines', 0) > 0) {
            return board;
        }

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                let nextRow = ri + i;
                let nextCol = ci + j;

                if (nextRow < 0 || nextRow >= ROWS || nextCol < 0 || nextCol >= COLS) {
                    continue;
                }

                board = this.revealCells(board, nextRow, nextCol);
            }
        }

        return board;
    }

    toggleCellFlag(board: Board, ri: number, ci: number): Board {
        let row = board.get(ri);
        if (row === undefined) {
            return board;
        }

        let cell = row.get(ci);
        if (cell === undefined) {
            return board;
        }

        let isFlagged = cell.get('state', '') === 'flagged';

        if (!isFlagged && this.getRemainingFlags() === 0) {
            return board;
        }

        return board.set(ri, row.set(ci, cell.set('state', isFlagged ? 'hidden' : 'flagged')));
    }

    getRemainingFlags(): number {
        let flags = 0;

        this.state.board.forEach(row => row.forEach(cell => {
            if (cell.get('state', '') === 'flagged') {
                flags++;
            }
        }))

        return MINES - flags;
    }

    endGame(boom: boolean) {
        console.log('end game', boom);
    }

    render() {
        return (
            <div className="msw-container">
                <Stats time={this.state.time} flags={this.getRemainingFlags()} />

                <div className="msw-board-container">
                    <BoardComponent board={this.state.board} onCellClick={this.handleCellClick} />
                </div>
            </div>
        );
    }
}
