import { connect } from 'react-redux';
import { List } from 'immutable';

import constants from 'app/redux/constants';
import { IGNORE_TAGS } from 'app/client_config';
import { changeHomeTagsCardCollapse } from 'src/app/redux/actions/ui';
import { saveTag } from 'src/app/redux/actions/tags';
import {
    createDeepEqualSelector,
    uiSelector,
    dataSelector,
    globalSelector,
    routeParamSelector,
} from 'src/app/redux/selectors/common';

import TagsCard from './TagsCard';

const emptyList = List();

export default connect(
    createDeepEqualSelector(
        [
            uiSelector('home'),
            dataSelector('settings'),
            globalSelector(['tag_idx', 'trending'], emptyList),
            routeParamSelector('category', ''),
            routeParamSelector('order', constants.DEFAULT_SORT_ORDER),
        ],
        (uiHome, settings, trendingTags, category, order) => {
            if (category === 'feed') {
                order = 'by_feed';
            }

            const tagsCollapsed = uiHome.get('tagsCollapsed');

            const tags = trendingTags
                // filter wrong tags
                .map(tag => {
                    if (/^(u\w{4}){6,}/.test(tag)) {
                        return null;
                    }
                    return tag;
                })
                // filter ignore tags and wrong tags
                .filter(tag => tag !== null && IGNORE_TAGS.indexOf(tag) === -1)
                // take only nedeed count of tags
                .take(tagsCollapsed ? 9 : 50);
 
            return {
                order,
                tags,
                tagsCollapsed,
                selectedFilterTags: settings.getIn(['basic', 'selectedFilterTags']),
                selectedSelectTags: settings.getIn(['basic', 'selectedSelectTags']),
                order,
            };
        }
    ),
    dispatch => ({
        loadMore: payload => dispatch({ type: 'REQUEST_DATA', payload }),
        changeHomeTagsCardCollapse: payload => dispatch(changeHomeTagsCardCollapse(payload)),
        saveTag: (tag, action) => dispatch(saveTag(tag, action)),
    })
)(TagsCard);
