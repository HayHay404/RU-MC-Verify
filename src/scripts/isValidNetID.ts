export default function isValidnetID(netid : string) {
    return netid.match(/^[a-z]+[0-9]*$/i);
}

