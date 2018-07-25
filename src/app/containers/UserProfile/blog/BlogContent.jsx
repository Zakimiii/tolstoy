import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import LoadingIndicator from 'app/components/elements/LoadingIndicator';
import Callout from 'app/components/elements/Callout';

import PostsList from 'src/app/components/common/PostsList';

const Loader = styled(LoadingIndicator)`
    margin-top: 30px;
`;

class BlogContent extends Component {
    render() {
        const { currentAccount } = this.props;

        const posts = currentAccount.get('blog');

        if (!posts) {
            return (
                <Loader type="circle" center size={40} />
            );
        }

        if (!posts.size) {
            return this._renderCallOut();
        }

        return (
            <PostsList
                account={currentAccount.get('name')}
                order="by_author"
                category="blog"
                //showSpam TODO
            />
        );
    }

    _renderCallOut() {
        const { currentAccount, isOwner } = this.props;

        return (
            <Callout>
                {isOwner ? (
                    <div>
                        {tt('submit_a_story.you_hasnt_started_bloggin_yet')}
                        <br />
                        <br />
                        <Link to="/submit">{tt('g.submit_a_story')}</Link>
                        <br />
                        <a href="/welcome">{tt('submit_a_story.welcome_to_the_blockchain')}</a>
                    </div>
                ) : (
                    tt('user_profile.user_hasnt_started_bloggin_yet', {
                        name: currentAccount.get('name'),
                    })
                )}
            </Callout>
        );
    }
}

export default connect((state, props) => {
    const accountName = props.params.accountName.toLowerCase();
    const currentAccount = state.global.getIn(['accounts', accountName]);
    const isOwner = state.user.getIn(['current', 'username'], null) === accountName;

    return {
        accountName,
        currentAccount,
        isOwner,
    };
})(BlogContent);
