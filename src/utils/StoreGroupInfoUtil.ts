import GroupInfo from '@/interfaces/GroupInfo';
import { Store } from '@tauri-apps/plugin-store';

// 将 Store 的加载操作移到异步函数中
async function loadStore() {
    return await Store.load('store.json');
}

class StoreGroupInfoUtil {
    private static store: Store;

    // 通过异步函数加载 store
    private static async initializeStore() {
        if (!this.store) {
            this.store = await loadStore();
        }
    }

    // 存储缓存数据
    private static async setStore(key: string, value: any) {
        await this.initializeStore();
        await this.store.set(key, value);
        await this.store.save();
    }

    // 获取缓存数据
    private static async getStore(key: string) {
        await this.initializeStore();
        return await this.store.get(key);
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

export { StoreGroupInfoUtil };
