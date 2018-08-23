import * as React from "react";
import WidgetHeader from "./widgetHeader";

interface IWidgetHeaderProps {
    icon?: any; // TODO
    containerClass?: string;
    title: {
        text: string,
        icon?: any; // TODO
    };
    toolbar?: React.ReactNode;
}

export default class Widget extends React.Component<IWidgetHeaderProps, {}> {
    public render() {
        return <div className={"widget widget-padding " + (this.props.containerClass || "")}>
            <WidgetHeader title={this.props.title.text} icon={this.props.title.icon} />
            {this.props.toolbar && <WidgetToolbar>{this.props.toolbar}</WidgetToolbar>}
            {this.props.children}
        </div>;
    }
}

class WidgetToolbar extends React.Component<{}, {}> {
    public render() {
        return <div className="widget-toolbar">test</div>;
    }
}
