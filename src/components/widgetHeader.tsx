import * as React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface IWidgetHeaderProps {
    icon?: any; // TODO
    title: string;
}

export default class WidgetHeader extends React.Component<IWidgetHeaderProps, {}> {
    public render() {
        return <div className="widget-header">
            <p>
                {this.props.icon && <FontAwesomeIcon icon={this.props.icon} />}
                <span style={{ marginLeft: this.props.icon ? "5px" : undefined }}>{this.props.title}</span>
            </p>
        </div>;
    }
}
