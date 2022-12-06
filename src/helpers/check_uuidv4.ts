import { validate as uuidValidate, version as uuidVersion } from 'uuid';

function check_uuidv4(uuid: string) {
    return uuidValidate(uuid) && uuidVersion(uuid) === 4;
}

export default check_uuidv4;