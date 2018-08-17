import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List } from 'immutable';

import throttle from 'lodash/throttle';

import { NOTIFICATIONS_FILTER_TYPES } from 'src/app/redux/constants/common';
import { activityContentSelector } from 'src/app/redux/selectors/userProfile/activity';
import { getNotificationsHistory } from 'src/app/redux/actions/notifications';
import { changeProfileActivityTab } from 'src/app/redux/actions/ui';

import Card, { CardContent } from 'golos-ui/Card';
import { TabContainer, Tabs } from 'golos-ui/Tabs';

import ActivityList from 'src/app/components/userProfile/activity/ActivityList';

@connect(
    activityContentSelector,
    {
        getNotificationsHistory,
        changeProfileActivityTab,
    }
)
export default class ActivityContent extends PureComponent {
    static propTypes = {
        isFetching: PropTypes.bool,
        currentTabId: PropTypes.string,
        notifications: PropTypes.instanceOf(List),
        
        changeProfileActivityTab: PropTypes.func,
        getNotificationsHistory: PropTypes.func,
    };

    state = {
        page: 0,
    };

    rootRef = null;

    componentDidMount() {
        this.loadMore();
        window.addEventListener('scroll', this.handeScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handeScroll);
        this.handeScroll.cancel();
    }

    componentDidUpdate(prevProps) {
        if (this.props.currentTabId !== prevProps.currentTabId) {
            this.loadMore();
        }
    }

    setRootRef = el => (this.rootRef = el);

    handeScroll = throttle(
        () => {
            // const rect = this.rootRef.getBoundingClientRect();
            // if (rect.top + rect.height < window.innerHeight * 1.5) {
            //     this.loadMore();
            // }
        },
        100,
        { leading: false, tailing: true }
    );

    handleChangeTab = tab => this.props.changeProfileActivityTab(tab.id);

    loadMore = () => {
        const { page } = this.state;

        this.props.getNotificationsHistory({
            types: NOTIFICATIONS_FILTER_TYPES[this.props.currentTabId],
            fromId: null,
            limit: page * 5 + 15,
        });
    };

    renderTabs = () => {
        const { isFetching, notifications, accounts } = this.props;
        const tabs = [
            { id: 'all', title: 'Все' },
            { id: 'awards', title: 'Награды' },
            { id: 'answers', title: 'Ответы' },
            { id: 'social', title: 'Социальные' },
            { id: 'mentions', title: 'Упоминания' },
        ];

        return tabs.map(({ id, title }, key) => (
            <TabContainer id={id} title={title} key={key}>
                <ActivityList isFetching={isFetching} notifications={notifications} accounts={accounts} />
            </TabContainer>
        ));
    };

    render() {
        const { currentTabId } = this.props;

        return (
            <Card auto innerRef={this.setRootRef}>
                <Tabs activeTab={{ id: currentTabId }} onChange={this.handleChangeTab}>
                    <CardContent column auto>
                        {this.renderTabs()}
                    </CardContent>
                </Tabs>
            </Card>
        );
    }
}
