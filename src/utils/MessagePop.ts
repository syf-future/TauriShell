import { createApp, App } from "vue";
import Message from '@/components/messagePop.vue';

interface MessageOptions {
    message: string;
    type?: "info" | "success" | "warning" | "error";
    duration?: number;
    position?: "top" | "bottom" | "center";
}

const MessageInfo = (() => {
    const showMessage = (options: MessageOptions): void => {
        const { message, type = "info", duration = 1000, position = "top" } = options;

        // 创建容器
        const container = document.createElement("div");
        document.body.appendChild(container);

        // 创建 Vue 应用
        const app: App = createApp(Message, {
            message,
            type,
            duration,
            position,
            onClose: () => {
                app.unmount(); // 销毁 Vue 实例
                document.body.removeChild(container);
            },
        });

        app.mount(container);
    };

    return {
        info: (message: string, duration?: number): void => showMessage({ message, type: "info", duration }),
        success: (message: string, duration?: number): void => showMessage({ message, type: "success", duration }),
        warning: (message: string, duration?: number): void => showMessage({ message, type: "warning", duration }),
        error: (message: string, duration?: number): void => showMessage({ message, type: "error", duration }),
    };
})();

export default MessageInfo;
