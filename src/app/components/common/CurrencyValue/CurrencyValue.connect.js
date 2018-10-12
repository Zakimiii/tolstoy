import { connect } from 'react-redux';
import { dataSelector } from 'src/app/redux/selectors/common';
import CurrencyValue from './CurrencyValue';

export default connect(state => ({
    rates: dataSelector('rates')(state),
}))(CurrencyValue);