const { COINS } = require('@lamassu/coins')
const _ = require('lodash/fp')

const kraken = require('../exchange/kraken')
const bitstamp = require('../exchange/bitstamp')
const itbit = require('../exchange/itbit')
const binanceus = require('../exchange/binanceus')
const cex = require('../exchange/cex')
const bitpay = require('../ticker/bitpay')
const binance = require('../exchange/binance')

const { BTC, BCH, DASH, ETH, LTC, ZEC, USDT } = COINS

const ALL = {
  cex: cex,
  binanceus: binanceus,
  kraken: kraken,
  bitstamp: bitstamp,
  itbit: itbit,
  bitpay: bitpay,
  coinbase: {
    CRYPTO: [BTC, ETH, LTC, DASH, ZEC, BCH, USDT],
    FIAT: 'ALL_CURRENCIES',
    DEFAULT_FIAT_MARKET: 'USD'
  },
  binance: binance
}

function buildMarket (fiatCode, cryptoCode, serviceName) {
  if (!_.includes(cryptoCode, ALL[serviceName].CRYPTO)) {
    throw new Error('Unsupported crypto: ' + cryptoCode)
  }

  if (_.isNil(fiatCode)) throw new Error('Market pair building failed: Missing fiat code')
  return cryptoCode + '/' + fiatCode
}

function verifyFiatSupport (fiatCode, serviceName) {
  const fiat = ALL[serviceName].FIAT
  return fiat === 'ALL_CURRENCIES' ? true : _.includes(fiatCode, fiat)
}

function isConfigValid (config, fields) {
  const values = _.map(it => _.get(it)(config))(fields)
  return _.every(it => it || it === 0)(values)
}

function defaultFiatMarket (serviceName) {
  return ALL[serviceName].DEFAULT_FIAT_MARKET
}

module.exports = { buildMarket, ALL, verifyFiatSupport, isConfigValid, defaultFiatMarket }
