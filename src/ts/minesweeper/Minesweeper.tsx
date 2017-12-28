import * as React from 'react';
import {List, Record} from 'immutable';
import {find, range} from 'lodash';

import {Board as BoardComponent} from './Board';
import {Stats} from './Stats';

export type GameState = 'start' | 'playing' | 'win' | 'lose';

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
    gameState: GameState;
    time: number;
    board: Board;
}

type MinePositions = {row: number, col: number}[];

const ROWS = 16;
const COLS = 16;
const MINES = 35;

const LEFT_CLICK = 0;
const RIGHT_CLICK = 2;

export class Minesweeper extends React.Component<{}, MinesweeperState> {
    private intervalId?: number;

    constructor(props) {
        super(props);

        this.state = {
            gameState: 'start',
            time: 0,
            board: List(range(ROWS).map(() => {
                return List(range(COLS).map(() => {
                    return CellRecord();
                }));
            }))
        };
    }

    handleCellClick = (ri: number, ci: number, button: number) => {
        let {gameState, board} = this.state;

        if (gameState !== 'start' && gameState !== 'playing') {
            return;
        } else if (gameState === 'start') {
            if (button !== LEFT_CLICK) {
                return;
            }

            gameState = 'playing';
            board = this.initializeBoard(ri, ci);

            this.startTime();
        } else {
            let row = board.get(ri)!;
            let cell = row.get(ci)!;

            if (cell.get('state', '') === 'shown') {
                return;
            }

            if (button === LEFT_CLICK) {
                if (cell.get('state', '') === 'flagged') {
                    return;
                }

                board = this.revealCells(board, ri, ci);

                if (cell.get('type', '') === 'mine') {
                    gameState = 'lose';
                    this.stopTime();
                } else if (this.allCellsRevealed(board)) {
                    gameState = 'win';
                    this.stopTime();
                }
            } else if (button === RIGHT_CLICK) {
                board = this.toggleCellFlag(board, ri, ci);
            }
        }

        this.setState({gameState, board});
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

    revealCells(board: Board, ri: number, ci: number): Board {
        let row = board.get(ri);
        if (row === undefined) {
            return board;
        }

        let cell = row.get(ci);
        if (cell === undefined) {
            return board;
        }

        if (cell.get('state', '') === 'shown' || cell.get('state', '') === 'flagged') {
            return board;
        }

        board = board.set(ri, row.set(ci, cell.set('state', 'shown')));

        if (cell.get('type', '') === 'mine' || cell.get('adjacentMines', 0) > 0) {
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

    allCellsRevealed(board: Board): boolean {
        let allRevealed = true;

        board.forEach(row => row.forEach(cell => {
            if (cell.get('type', '') !== 'mine' && cell.get('state', '') === 'hidden') {
                allRevealed = false;
            }
        }));

        return allRevealed;
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

    render() {
        return (
            <div className="msw-container">
                <Stats time={this.state.time} flags={this.getRemainingFlags()} gameState={this.state.gameState} />

                <div className="msw-board-container">
                    <BoardComponent
                        board={this.state.board}
                        gameState={this.state.gameState}
                        onCellClick={this.handleCellClick} />
                </div>
            </div>
        );
    }
}
