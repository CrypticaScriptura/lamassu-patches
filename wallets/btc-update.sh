#!/bin/bash
set -e

export LOG_FILE=/tmp/btc-update.$(date +"%Y%m%d").log

echo
echo "Updating Bitcoin Core. This may take a minute."
supervisorctl stop bitcoin >> ${LOG_FILE} 2>&1
echo

echo "Downloading v0.21.0..."
curl -#o /tmp/bitcoin.tar.gz https://bitcoincore.org/bin/bitcoin-core-0.21.0/bitcoin-0.21.0-x86_64-linux-gnu.tar.gz >> ${LOG_FILE} 2>&1
tar -xzf /tmp/bitcoin.tar.gz -C /tmp/ >> ${LOG_FILE} 2>&1
echo

echo "Updating wallet..."
mv /usr/local/bin/bitcoind /usr/local/bin/bitcoind-old >> ${LOG_FILE} 2>&1
mv /usr/local/bin/bitcoin-cli /usr/local/bin/bitcoin-cli-old >> ${LOG_FILE} 2>&1
mv /usr/local/bin/bitcoin-tx /usr/local/bin/bitcoind-tx-old >> ${LOG_FILE} 2>&1
mv /usr/local/bin/bitcoin-qt /usr/local/bin/bitcoind-qt-old >> ${LOG_FILE} 2>&1
cp /tmp/bitcoin-0.21.0/bin/* /usr/local/bin/ >> ${LOG_FILE} 2>&1
rm -r /tmp/bitcoin-0.21.0 >> ${LOG_FILE} 2>&1
rm /tmp/bitcoin.tar.gz >> ${LOG_FILE} 2>&1
echo

echo "Starting wallet..."
supervisorctl start bitcoin >> ${LOG_FILE} 2>&1
echo

echo "Bitcoin Core is updated."
echo
