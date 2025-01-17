import { createApp } from "vue";
import Message from '../components/messagePop.vue';

const MessageInfo = (() => {
    const showMessage = (options) => {
        const { message, type = "info", duration = 1000, position = "top" } = options;

        // 创建容器
        const container = document.createElement("div");
        document.body.appendChild(container);

        // 创建 Vue 应用
        const app = createApp(Message, {
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
        info: (message, duration) => showMessage({ message, type: "info", duration }),
        success: (message, duration) => showMessage({ message, type: "success", duration }),
        warning: (message, duration) => showMessage({ message, type: "warning", duration }),
        error: (message, duration) => showMessage({ message, type: "error", duration }),
    };
})();

export default MessageInfo;
