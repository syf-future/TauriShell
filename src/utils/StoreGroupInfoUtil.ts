/**
 * 缓存工具类
 */
import GroupInfo from '@/interfaces/GroupInfo';
import { Store } from '@tauri-apps/plugin-store';
const store = await Store.load('store.json');

class StoreGroupInfoUtil {
    // 存储缓存数据
    private static async setStore(key: string, value: any) {
        await store.set(key, value);
        await store.save();
    }

    // 获取缓存数据
    private static async getStore(key: string) {
        return await store.get(key);
    }

    /**
     * 获取组信息缓存
     * @returns 
     */
    static async getGroupInfoStore(): Promise<GroupInfo[]> {
        const groupInfos = await this.getStore('GROUPS-INFO');
        if (groupInfos) {
            return groupInfos as GroupInfo[]; // 类型断言，告诉 TS 返回的是 GroupInfo[]
        }
        return []
    }

    /**
     * 设置组信息缓存
     * @param groupInfos 
     */
    static setGroupInfoStore(groupInfos: GroupInfo[]) {
        this.setStore('GROUPS-INFO', groupInfos);
    }
}
export { StoreGroupInfoUtil }