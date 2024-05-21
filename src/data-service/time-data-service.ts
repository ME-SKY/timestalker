import { invoke } from '@tauri-apps/api/tauri';

const saveTimeData = async (dataValue) => {
    console.log('dataValue', dataValue);
    const dataToSave = JSON.stringify(dataValue);
    console.log('saving process starts', dataToSave);
    await invoke('save_time_data', {
        data: `${dataToSave}`, // ugly solution
    });
}

const loadTimeData = async () => {
    try {
        const data = await invoke('load_time_data');
        const parsed = JSON.parse(data);
        console.log('parsed', parsed);
        return parsed;
        // set(parsed);
    } catch (e) {
        console.error('Failed to load time data', e);
    }
}

export { saveTimeData, loadTimeData };