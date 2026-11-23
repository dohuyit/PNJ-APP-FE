import _ from 'lodash';

const form = {
    get_data_changed: (originalData = {}, dataChanged = {}) => {
        const newDataChanged = Object.keys(dataChanged).reduce((acc, key) => {
            if (dataChanged[key] != originalData[key]) {
                acc[key] = dataChanged[key];
            }
            return acc;
        }, {});
        return newDataChanged;
    }
}

export const get_data_changed = (originalData = {}, dataChanged = {}) => {
    const newDataChanged = Object.keys(dataChanged).reduce((acc, key) => {
        if (originalData[key] === null) {
            // convert null to empty string, because reactjs uncontrolled null value
            originalData[key] = '';
        }
        if (!_.isEqual(dataChanged[key], originalData[key])) {
            acc[key] = dataChanged[key];
        }
        return acc;
    }, {});
    return newDataChanged;
}
export default form
