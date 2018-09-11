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
    noContentPad?: boolean;
}

export default class Widget extends React.Component<IWidgetHeaderProps, {}> {
    public render() {
        return <div className={"widget " + (this.props.containerClass || "")}>
            <WidgetHeader title={this.props.title.text} icon={this.props.title.icon} />
            {this.props.toolbar && <WidgetToolbar>{this.props.toolbar}</WidgetToolbar>}
            <div className="widget-content">
                {/* We use a wrapper to enable showing the scrollbar only on hover. */}
                <div className={"widget-content-scrollbox " + (this.props.noContentPad ? "" : "widget-padding")}>
                    {this.props.children}
                </div>
            </div>
        </div>;
    }
}

class WidgetToolbar extends React.Component<{}, {}> {
    public render() {
        return <div className="widget-toolbar">
            <div className="widget-toolbar-zoom">{this.props.children}</div>
        </div>;
    }
}
