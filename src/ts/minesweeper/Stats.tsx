import * as React from 'react';

interface StatsProps {
    time: number;
    flags: number;
}

export class Stats extends React.Component<StatsProps> {
    render() {
        let minutes = String(Math.floor(this.props.time / 60));
        let seconds = String(this.props.time % 60);

        if (seconds.length === 1) {
            seconds = `0${seconds}`;
        }

        return (
            <div className="msw-stats">
                <span>
                    <strong>Time:</strong> {minutes}:{seconds}
                </span>

                <span>
                    <strong>Flags:</strong> {this.props.flags}
                </span>
            </div>
        );
    }
}
