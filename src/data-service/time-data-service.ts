import { invoke } from '@tauri-apps/api/tauri';

const saveTimeData = async (dataValue) => {
    const dataToSave = JSON.stringify(dataValue);
    await invoke('save_time_data', {
        data: `${dataToSave}`, // ugly solution
    });
}

const loadTimeData = async () => {
    try {
        const data = await invoke('load_time_data');

        if (data) {
            const parsed = JSON.parse(data);
            return parsed;
        } else {
            return new Map();
        }

    } catch (e) {
        console.error('Failed to load time data', e);
    }
}

export { saveTimeData, loadTimeData };