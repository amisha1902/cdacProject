import { toast } from "react-toastify";

export const success = (msg, opts = {}) => toast.success(msg, { position: "top-right", autoClose: 3000, ...opts });
export const error = (msg, opts = {}) => toast.error(msg, { position: "top-right", autoClose: 5000, ...opts });
export const info = (msg, opts = {}) => toast.info(msg, { position: "top-right", autoClose: 3000, ...opts });

export default { success, error, info };
