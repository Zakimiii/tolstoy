export const routeRegex = {
    PostsIndex: /^\/(@[\w\.\d-]+)\/feed\/?$/,
    UserProfile1: /^\/(@[\w\.\d-]+)\/?$/,
    UserProfile2: /^\/(@[\w\.\d-]+)\/(blog|posts|comments|recommended|transfers|invites|curation-rewards|author-rewards|permissions|created|recent-replies|feed|password|followed|followers|settings)\/??(?:&?[^=&]*=[^=&]*)*$/,
    UserProfile3: /^\/(@[\w\.\d-]+)\/[\w\.\d-]+/,
    UserEndPoints: /^(blog|posts|comments|recommended|transfers|invites|curation-rewards|author-rewards|permissions|assets|created|recent-replies|feed|password|followed|followers|settings)$/,
    CategoryFilters: /^\/(hot|votes|responses|trending|trending30|promoted|cashout|payout|payout_comments|created|active)\/?$/ig,
    PostNoCategory: /^\/(@[\w\.\d-]+)\/([\w\d-]+)/,
    Post: /^\/([\w\d\-\/]+)\/(\@[\w\d\.-]+)\/([\w\d-]+)\/?($|\?)/,
    PostJson: /^\/([\w\d\-\/]+)\/(\@[\w\d\.-]+)\/([\w\d-]+)(\.json)$/,
    UserJson: /^\/(@[\w\.\d-]+)(\.json)$/,
    UserNameJson: /^.*(?=(\.json))/
};

export default function resolveRoute(path)
{
    if (path === '/') {
        return {page: 'PostsIndex', params: ['trending']};
    }
    if (path.indexOf("@bm-chara728") !== -1) {
        return {page: 'NotFound'};
    }
    if (path === '/welcome') {
        return {page: 'Welcome', hideSubMenu: true};
    }
    if (path === '/start'){
        return {page: 'Start'}
    }
    if (path === '/about') {
        return {page: 'Landing', hideSubMenu: true};
    }
    if (path === '/faq') {
        return {page: 'Faq'};
    }
    if (path === '/login.html') {
        return {page: 'Login'};
    }
    if (path === '/privacy.html') {
        return {page: 'Privacy'};
    }
    if (path === '/support.html') {
        return {page: 'Support'};
    }
    if (path === '/xss/test' && process.env.NODE_ENV === 'development') {
        return {page: 'XSSTest'};
    }
    if (path.match(/^\/tags\/?/)) {
        return {page: 'Tags'};
    }
    if (path === '/tos.html') {
        return {page: 'Tos'};
    }
    if (path === '/change_password') {
        return {page: 'ChangePassword'};
    }
    if (path === '/recover_account_step_1') {
        return {page: 'RecoverAccountStep1'};
    }
    if (path === '/recover_account_step_2') {
        return {page: 'RecoverAccountStep2'};
    }
    if (path === '/market') {
        return {page: 'Market'};
    }
    if (path === '/~witnesses') {
        return {page: 'Witnesses'};
    }
    if (path === '/submit') {
        return {page: 'SubmitPost', hideSubMenu: true};
    }
    if (path === '/leave_page') {
        return {page: 'LeavePage'};
    }
    let match = path.match(routeRegex.PostsIndex);
    if (match) {
        return {page: 'PostsIndex', params: ['home', match[1]]};
    }
    match = path.match(routeRegex.UserProfile1) ||
        // @user/"posts" is deprecated in favor of "comments" as of oct-2016 (#443)
        path.match(routeRegex.UserProfile2);
    if (match) {
        return {page: 'UserProfile', params: match.slice(1)};
    }
    match = path.match(routeRegex.PostNoCategory);
    if (match) {
        return {page: 'PostNoCategory', params: match.slice(1)};
    }
    match = path.match(routeRegex.Post);
    if (match) {
        return {page: 'Post', params: match.slice(1)};
    }
    match = path.match(/^\/(hot|votes|responses|trending|trending30|promoted|cashout|payout|payout_comments|created|active)\/?$/)
         || decodeURI(path).match(/^\/(hot|votes|responses|trending|trending30|promoted|cashout|payout|payout_comments|created|active)\/([\u0400-\u04FF-\w\d-]+)\/?$/)
    if (match) {
        return {page: 'PostsIndex', params: match.slice(1)};
    }
    return {page: 'NotFound'};
}
