import * as React from 'react';

interface NiceProps {
    foo: string;
}

export class Nice extends React.Component<NiceProps> {
    render() {
        return <>{this.props.foo}</>;
    }
}
