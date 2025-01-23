import HostInfo from '@/interfaces/HostInfo';
import { Store } from '@tauri-apps/plugin-store';

class StoreHostInfoUtil {
    // 将 store 放到类中，避免顶层 await
    private static store: Store;

    // 异步初始化 store
    private static async initializeStore() {
        if (!this.store) {
            this.store = await Store.load('store.json');
        }
    }

    // 存储缓存数据
    private static async setStore(key: string, value: any) {
        await this.initializeStore(); // 确保 store 已初始化
        await this.store.set(key, value);
        await this.store.save();
    }

    // 获取缓存数据
    private static async getStore(key: string) {
        await this.initializeStore(); // 确保 store 已初始化
        return await this.store.get(key);
    }

    /**
     * 获取主机信息缓存
     * @returns 
     */
    static async getHostInfoStore(): Promise<HostInfo[]> {
        const hostInfos = await this.getStore('Hosts-INFO');
        if (hostInfos) {
            return hostInfos as HostInfo[]; // 类型断言，告诉 TS 返回的是 HostInfo[]
        }
        return [];
    }

    /**
     * 设置主机信息缓存
     * @param hostInfos 
     */
    static setHostInfoStore(hostInfos: HostInfo[]) {
        this.setStore('Hosts-INFO', hostInfos);
    }
}

export { StoreHostInfoUtil };
