/**
 * 缓存工具类
 */
import HostInfo from '@/interfaces/HostInfo';
import { Store } from '@tauri-apps/plugin-store';
const store = await Store.load('store.json');

class StoreHostInfoUtil {
    private static async setStore(key: string, value: any) {
        await store.set(key, value);
        await store.save();
    }
    private static async getStore(key: string) {
        return await store.get(key);
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
        return []
    }

    /**
     * 设置组信息缓存
     * @param HostInfos 
     */
    static setHostInfoStore(hostInfos: HostInfo[]) {
        this.setStore('Hosts-INFO', hostInfos);
    }
}
export { StoreHostInfoUtil }