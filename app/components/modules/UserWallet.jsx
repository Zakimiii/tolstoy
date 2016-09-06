/* eslint react/prop-types: 0 */
import React from 'react';
import {connect} from 'react-redux'
import g from 'app/redux/GlobalReducer'
import TransferHistoryRow from 'app/components/cards/TransferHistoryRow';
import TransactionError from 'app/components/elements/TransactionError';
import TimeAgoWrapper from 'app/components/elements/TimeAgoWrapper';
import DropdownMenu from 'app/components/elements/DropdownMenu';
import BlocktradesDeposit from 'app/components/modules/BlocktradesDeposit';
import Reveal from 'react-foundation-components/lib/global/reveal'
import CloseButton from 'react-foundation-components/lib/global/close-button';
import {steemTip, powerTip, dollarTip, valueTip} from 'app/utils/Tips'
import {numberWithCommas, vestingSteem} from 'app/utils/StateFunctions'
import { translate } from 'app/Translator';

class UserWallet extends React.Component {
    constructor() {
        super()
        this.state = {}
        this.onShowDeposit = () => {this.setState({showDeposit: !this.state.showDeposit})}
        this.onShowDepositSteem = (e) => {
            e.preventDefault()
            this.setState({showDeposit: !this.state.showDeposit, depositType: 'STEEM'})
        }
        this.onShowDepositPower = (e) => {
            e.preventDefault()
            this.setState({showDeposit: !this.state.showDeposit, depositType: 'VESTS'})
        }
        // this.onShowDeposit = this.onShowDeposit.bind(this)
    }
    render() {
        const {state: {showDeposit, depositType, toggleDivestError}, onShowDeposit, onShowDepositSteem, onShowDepositPower} = this
        const {convertToSteem, price_per_steem} = this.props
        let account          = this.props.account;
        let current_user     = this.props.current_user;
        let gprops           = this.props.global.getIn( ['props'] ).toJS();

        let vesting_steemf = vestingSteem(account, gprops);
        let vesting_steem = vesting_steemf.toFixed(3);

        let isMyAccount = current_user && current_user.get('username') === account.name;

        const disabledWarning = false;
        // isMyAccount = false; // false to hide wallet transactions

        const showTransfer = (asset, e) => {
            e.preventDefault();
            if (!current_user) {
                this.props.login();
                return;
            }
            this.props.showTransfer({to: (isMyAccount ? null : account.name), asset});
        };

        const powerDown = (cancel, e) => {
            e.preventDefault()
            const {name} = account
            const vesting_shares = cancel ? '0.000000 VESTS' : account.vesting_shares
            this.setState({toggleDivestError: null})
            const errorCallback = e2 => {this.setState({toggleDivestError: e2.toString()})}
            const successCallback = () => {this.setState({toggleDivestError: null})}
            this.props.withdrawVesting({account: name, vesting_shares, errorCallback, successCallback})
        }


        /// vests + steem balance
        let balance_steem = parseFloat(account.balance.split(' ')[0]);
        let total_steem   = (vesting_steemf + balance_steem).toFixed(3);
        let divesting = parseFloat(account.vesting_withdraw_rate.split(' ')[0]) > 0.000000;
        const sbd_balance = parseFloat(account.sbd_balance)

        let total_value = '$' + numberWithCommas(
            (((vesting_steemf + balance_steem) * price_per_steem) + sbd_balance
        ).toFixed(2))
        const total_value_number = Number(total_value.substring(1).split('"'))

        /// transfer log
        let idx = 0
        const transfer_log = account.transfer_history.map(item => {
            const data = item[1].op[1]
            // Filter out rewards
            if (item[1].op[0] === "curation_reward" || item[1].op[0] === "author_reward") {
                return null;
            }

            if(data.sbd_payout === '0.000 SBD' && data.vesting_payout === '0.000000 VESTS')
                return null
            return <TransferHistoryRow key={idx++} op={item} context={account.name} />;
        }).filter(el => !!el);
        transfer_log.reverse();

        let steem_menu = [
            { value: translate('transfer'), link: '#', onClick: showTransfer.bind( this, 'STEEM' ) },
            { value: translate('power_up'), link: '#', onClick: showTransfer.bind( this, 'VESTS' ) },
        ]
        let power_menu = [
            { value: translate('power_down'), link: '#', onClick: powerDown.bind(this, false) }
        ]
        if(isMyAccount) {
            steem_menu.push({ value: translate('deposit'), link: '#', onClick: onShowDepositSteem })
            steem_menu.push({ value: translate('buy_or_sell'), link: '/market' })
            power_menu.push({ value: translate('deposit'), link: '#', onClick: onShowDepositPower })
        }
        if( divesting ) {
            power_menu.push({ value: translate('cancel_power_down'), link: '#', onClick: powerDown.bind(this, true) });
        }

        let dollar_menu = [
            { value: translate('transfer'), link: '#', onClick: showTransfer.bind( this, 'SBD' ) },
            { value: translate('buy_or_sell'), link: '/market' },
            { value: translate('convert_to_steem'), link: '#', onClick: convertToSteem },
        ]
        const isWithdrawScheduled = new Date(account.next_vesting_withdrawal + 'Z').getTime() > Date.now()
        const depositReveal = showDeposit && <div>
            <Reveal onHide={onShowDeposit} show={showDeposit}>
                <CloseButton onClick={onShowDeposit} />
                <BlocktradesDeposit onClose={onShowDeposit} outputCoinType={depositType} />
            </Reveal>
        </div>

        const steem_balance_str = numberWithCommas(balance_steem.toFixed(3)) // formatDecimal(balance_steem, 3)
        const power_balance_str = numberWithCommas(vesting_steem) // formatDecimal(vesting_steem, 3)
        const sbd_balance_str = numberWithCommas('$' + sbd_balance.toFixed(3)) // formatDecimal(account.sbd_balance, 3)
        return (<div className="UserWallet">
            <div className="row">
                <div className="column small-12 medium-8">
                    <h4 className="uppercase">{translate('balances')}</h4>
                </div>
                {isMyAccount && <div className="column small-12 medium-4">
                    <button className="UserWallet__buysp button hollow float-right " onClick={this.onShowDepositSteem}>{translate('buy_steem_or_steem_power')}</button>
                </div>}
            </div>
            <br />
            <div className="UserWallet__balance row">
                <div className="column small-12 medium-8">
                    STEEM
                    <br />
                    <span className="secondary">
                        {/* not using steemTip because translate strings may be undefined on load */}
                        {/* {steemTip.split(".").map((a, index) => {if (a) {return <div key={index}>{a}.</div>;} return null;})} */}
                        <div>{translate('tradeable_tokens_that_may_be_transferred_anywhere_at_anytime')}</div>
                        <div>{translate('steem_can_be_converted_to_steem_power_in_a_process_called_powering_up')}</div>
                    </span>
                </div>
                <div className="column small-12 medium-4">
                    {isMyAccount ?
                    <DropdownMenu selected={steem_balance_str + ' STEEM'} className="Header__sort-order-menu" items={steem_menu} el="span" />
                    : steem_balance_str + ' STEEM'}
                </div>
            </div>
            <div className="UserWallet__balance row">
                <div className="column small-12 medium-8">
                    STEEM POWER
                    <br />
                    <span className="secondary">
                        {/* not using steemTip because translate strings may be undefined on load */}
                        {/* {powerTip.split(".").map((a, index) => {if (a) {return <div key={index}>{a}.</div>;} return null;})} */}
                        <div>{translate('influence_tokens_which_earn_more_power_by_holding_long_term')}</div>
                        <div>{translate('the_more_you_hold_the_more_you_influence_post_rewards')}</div>
                    </span>
                </div>
                <div className="column small-12 medium-4">
                    {isMyAccount ?
                    <DropdownMenu selected={power_balance_str + ' STEEM'} className="Header__sort-order-menu" items={power_menu} el="span" />
                    : power_balance_str + ' STEEM'}
                </div>
            </div>
            <div className="UserWallet__balance row">
                <div className="column small-12 medium-8">
                    STEEM DOLLARS<br /><span className="secondary">{translate('tokens_worth_about_dollar_of_steem')}</span>
                </div>
                <div className="column small-12 medium-4">
                    {isMyAccount ?
                    <DropdownMenu selected={sbd_balance_str} items={dollar_menu} el="span" />
                    : sbd_balance_str}
                </div>
            </div>
            <div className="row">
                <div className="column small-12">
                    <div style={{borderTop: '1px solid #eee', paddingTop: '0.25rem', marginTop: '0.25rem'}}>
                    </div>
                </div>
            </div>
            {/* if 'total_value_number' is NaN hide the section */}
            {
                isNaN(total_value_number)
                ?   null
                :   <div className="UserWallet__balance row">
                        <div className="column small-12 medium-8">
                            {translate('estimate_account_value')}<br /><span className="secondary">{translate('the_estimated_value_is_based_on_a_7_day_average_value_of_steem_in_us_dollars')}</span>
                        </div>
                        <div className="column small-12 medium-4">
                            {total_value}
                        </div>
                    </div>
            }
            <div className="UserWallet__balance row">
                <div className="column small-12">
                    {isWithdrawScheduled && <span>{translate('next_power_down_is_scheduled_to_happen_at')}&nbsp; <TimeAgoWrapper date={account.next_vesting_withdrawal} />.</span> }
                    {/*toggleDivestError && <div className="callout alert">{toggleDivestError}</div>*/}
                    <TransactionError opType="withdraw_vesting" />
                </div>
            </div>
            {disabledWarning && <div className="row">
                <div className="column small-12">
                    <div className="callout warning">
                        {translate('transfers_are_temporary_disabled')}.
                    </div>
                </div>
            </div>}
            <div className="row">
                <div className="column small-12">
                    <hr />
                </div>
            </div>

            <div className="row">
                <div className="column small-12">
                    {/** history */}
                    <h4 className="uppercase">{translate('history')}</h4>
                    <table>
                        <tbody>
                        {transfer_log}
                        </tbody>
                     </table>
                </div>
            </div>
            {depositReveal}
        </div>);
    }
}

export default connect(
    // mapStateToProps
    (state, ownProps) => {
        let price_per_steem = undefined
        const feed_price = state.global.get('feed_price')
        if(feed_price && feed_price.has('base') && feed_price.has('quote')) {
            const {base, quote} = feed_price.toJS()
            if(/ SBD$/.test(base) && / STEEM$/.test(quote))
                price_per_steem = parseFloat(base.split(' ')[0])
        }
        return {
            ...ownProps,
            price_per_steem
        }
    },
    // mapDispatchToProps
    dispatch => ({
        convertToSteem: (e) => {
            e.preventDefault()
            const name = 'convertToSteem'
            dispatch(g.actions.showDialog({name}))
        },
        showChangePassword: (username) => {
            const name = 'changePassword'
            dispatch(g.actions.remove({key: name}))
            dispatch(g.actions.showDialog({name, params: {username}}))
        },
    })
)(UserWallet)
