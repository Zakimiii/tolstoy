import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { List } from 'immutable';
import { FormattedDate } from 'react-intl';

import LoadingIndicator from 'app/components/elements/LoadingIndicator';
import ActivityItem from './ActivityItem';

const Wrapper = styled.div`
    flex: 1;
`;

const Loader = styled(LoadingIndicator)`
    margin: 30px 0;
`;

const DateWrapper = styled.div`
    display: flex;
    justify-content: center;
`;

const Date = styled.div`
    display: flex;
    align-items: center;
    height: 30px;
    padding: 0 13px;
    margin: -15px 0 0;
    border-radius: 100px;
    font-size: 14px;
    font-weight: 300;
    color: #333;
    background: #fff;
    box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.3);
    cursor: default;
`;

export default class ActivityList extends Component {
    static propTypes = {
        isFetching: PropTypes.bool,
        notifications: PropTypes.instanceOf(List),
    };

    render() {
        const { isFetching, notifications, accounts } = this.props;

        if (isFetching) {
            return <Loader type="circle" center />;
        }

        if (!notifications.size) {
            return <div>Пусто</div>;
        }

        return (
            <Fragment>
                {notifications.map((notification) => (
                    <Fragment key={notification.get('_id')}>
                        {notification.get('isNextDay') && (
                            <DateWrapper>
                                <Date>
                                    <FormattedDate
                                        value={notification.get('createdAt')}
                                        day="numeric"
                                        month="long"
                                        year="numeric"
                                    />
                                </Date>
                            </DateWrapper>
                        )}
                        <ActivityItem notification={notification} accounts={accounts} />
                    </Fragment>
                ))}
            </Fragment>
        );
    }
}
