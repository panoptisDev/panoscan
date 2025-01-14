import { WEI_PRECISION } from 'src/lib/utils';
import { stlos } from 'src/lib/logos.js';

const DAY_SECONDS = 86400;
const HOUR_SECONDS = 3600;

/**
 * Translates a number of seconds to a plain-english string, eg. 90 => "1.5 minutes"
 *
 * @param {number} seconds
 * @returns {string} plain english time period
 */
export function formatUnstakePeriod(seconds) {
    if (seconds === null)
        return '--';

    let quantity;
    let unit;

    if (seconds < HOUR_SECONDS) {
        quantity = seconds / 60;
        unit = 'minutes';
    } else if (seconds < DAY_SECONDS) {
        quantity = seconds / HOUR_SECONDS;
        unit = 'hours';
    } else {
        quantity = seconds / DAY_SECONDS;
        unit = 'days';
    }

    if (!Number.isInteger(quantity))
        quantity = quantity.toFixed(1);

    return `${quantity} ${unit}`;
}

export async function fetchStlosApy($telosApi) {
    try{
        return (await $telosApi.get('apy/evm')).data;
    }catch(e) {
        console.error(e);
    }
}

/**
 * Launches a prompt in MetaMask to add sTLOS as a tracked token, allowing the user to view their sTLOS balance
 * at a glance from MetaMask
 *
 * @returns {Promise<boolean>} - true iff the user granted the request to track sTLOS
 */
export async function promptAddToMetamask() {
    return window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
            type: 'ERC20',
            options: {
                address: process.env.STAKED_TLOS_CONTRACT_ADDRESS,
                symbol: 'STLOS',
                decimals: WEI_PRECISION,
                image: stlos,
            },
        },
    }).catch(({ message }) => {
        console.error(message);
    });
}
