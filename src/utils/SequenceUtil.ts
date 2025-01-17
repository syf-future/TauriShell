class Snowflake {
    private epoch: number = 1577836800000; // 雪花算法的纪元时间，通常设为 2019 年 1 月 1 日
    private workerIdBits: number = 5; // 机器 ID 的位数
    private sequenceBits: number = 12; // 序列号的位数

    private maxWorkerId: number = -1 ^ (-1 << this.workerIdBits); // 机器 ID 最大值
    private sequenceMask: number = -1 ^ (-1 << this.sequenceBits); // 序列号掩码

    private workerId: number = 0; // 机器 ID
    private sequence: number = 0; // 序列号
    private lastTimestamp: number = -1; // 上一次生成 ID 的时间戳

    constructor(workerId: number) {
        if (workerId > this.maxWorkerId || workerId < 0) {
            throw new Error(`workerId 必须在 0 到 ${this.maxWorkerId} 之间`);
        }
        this.workerId = workerId;
    }

    // 获取当前时间戳（毫秒级）
    private currentTimestamp(): number {
        return new Date().getTime();
    }

    // 生成唯一 ID
    public generateId(): number {
        let timestamp = this.currentTimestamp();
        if (timestamp === this.lastTimestamp) {
            // 如果当前时间戳和上次时间戳相同，递增序列号
            this.sequence = (this.sequence + 1) & this.sequenceMask;
            if (this.sequence === 0) {
                // 如果序列号已经达到最大值，等待下一个毫秒
                timestamp = this.waitForNextMillis(this.lastTimestamp);
            }
        } else {
            // 时间戳变化，序列号归零
            this.sequence = 0;
        }

        // 更新最后时间戳
        this.lastTimestamp = timestamp;

        // 计算雪花 ID
        const timestampBits = (timestamp - this.epoch) << (this.workerIdBits + this.sequenceBits);
        const workerIdBits = this.workerId << this.sequenceBits;
        const sequenceBits = this.sequence;

        // 最终生成的雪花 ID
        return timestampBits | workerIdBits | sequenceBits;
    }

    // 等待直到下一个毫秒
    private waitForNextMillis(lastTimestamp: number): number {
        let timestamp = this.currentTimestamp();
        while (timestamp <= lastTimestamp) {
            timestamp = this.currentTimestamp();
        }
        return timestamp;
    }
}

class SequenceUtil {
    private static snowflake: Snowflake | null = null;

    // 初始化 snowflake 实例，保证 workerId 是唯一的
    private static getSnowflake(): Snowflake {
        if (!this.snowflake) {
            this.snowflake = new Snowflake(1); // 设置唯一的 workerId，这里假设为 1
        }
        return this.snowflake;
    }

    static nextId(): string {
        const snowflake = this.getSnowflake(); // 获取同一个实例
        return snowflake.generateId().toString();
    }
}

export { SequenceUtil }