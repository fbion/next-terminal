import React, {Component} from 'react';
import {List, Card, Input, PageHeader} from "antd";
import Console from "../access/Console";
import {itemRender} from "../../utils/utils";
const {Search} = Input;
const routes = [
    {
        path: '',
        breadcrumbName: '首页',
    },
    {
        path: '/dynamic-command',
        breadcrumbName: '动态指令',
    },
    {
        path: '/batch-command',
        breadcrumbName: '批量执行命令',
    }
];

class BatchCommand extends Component {

    commandRef = React.createRef();

    state = {
        webSockets: [],
        assets: []
    }

    componentDidMount() {
        let params = new URLSearchParams(this.props.location.search);
        let command = params.get('command');
        let assets = JSON.parse(params.get('assets'));
        this.setState({
            command: command,
            assets: assets
        })
    }

    onPaneChange = activeKey => {
        this.setState({activeKey});
    };

    appendWebsocket = (webSocket) => {
        this.state.webSockets.push(webSocket);
    }

    render() {
        return (
            <>
                <PageHeader
                    className="site-page-header-ghost-wrapper page-herder"
                    title="批量执行命令"
                    breadcrumb={{
                        routes: routes,
                        itemRender: itemRender
                    }}
                    subTitle="动态指令"
                >
                </PageHeader>

                <div className="page-search">
                    <Search ref={this.commandRef} placeholder="请输入指令" onSearch={value => {
                        for (let i = 0; i < this.state.webSockets.length; i++) {
                            this.state.webSockets[i].send(value + String.fromCharCode(13))
                        }
                        this.commandRef.current.setValue('');
                    }} enterButton='执行'/>
                </div>

                <div className="page-card">
                    <List
                        grid={{gutter: 16, column: 2}}
                        dataSource={this.state.assets}
                        renderItem={item => (
                            <List.Item>
                                <Card title={item.name}>
                                    <Console assetId={item.id} command={this.state.command}
                                             width={(window.innerWidth - 350) / 2}
                                             height={400}
                                             appendWebsocket={this.appendWebsocket}/>
                                </Card>
                            </List.Item>
                        )}
                    />
                </div>
            </>
        );
    }
}

export default BatchCommand;